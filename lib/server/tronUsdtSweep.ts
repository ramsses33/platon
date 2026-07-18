import "server-only";

import { createClient } from "@supabase/supabase-js";
import { TronWeb } from "tronweb";

import {
  deriveTronDepositWallet,
  type TronDepositNetwork,
} from "@/lib/server/tronDepositWallet";

export type UsdtSweepRequest = {
  depositId: string;
  depositAddress: string;
  derivationIndex: number;
  network: TronDepositNetwork;
  rawAmount: string;
};

export type UsdtSweepResult = {
  success: boolean;
  depositId: string;
  sweepTxid: string;
  status: "SWEEP_PENDING";
  broadcast: boolean;
  alreadyPending: boolean;
};

type ReserveSweepResult = {
  success?: boolean;
  reserved?: boolean;
  alreadyPending?: boolean;
  alreadySwept?: boolean;
  depositId?: string;
  sweepTxid?: string;
  status?: string;
};

const DEFAULT_FEE_LIMIT = 100_000_000;

function getDepositNetwork(): TronDepositNetwork {
  const network = process.env.TRON_DEPOSIT_NETWORK
    ?.trim()
    .toUpperCase();

  if (
    network !== "SHASTA" &&
    network !== "MAINNET"
  ) {
    throw new Error(
      "TRON_DEPOSIT_NETWORK must be SHASTA or MAINNET."
    );
  }

  return network;
}

function getTronGridBaseUrl(
  network: TronDepositNetwork
) {
  if (network === "SHASTA") {
    return "https://api.shasta.trongrid.io";
  }

  return "https://api.trongrid.io";
}

function getTronGridHeaders():
  Record<string, string> {
  const apiKey =
    process.env.TRONGRID_API_KEY?.trim();

  if (!apiKey) {
    return {};
  }

  return {
    "TRON-PRO-API-KEY": apiKey,
  };
}

function getUsdtContract() {
  const contract =
    process.env.TRON_USDT_CONTRACT?.trim();

  if (
    !contract ||
    !TronWeb.isAddress(contract)
  ) {
    throw new Error(
      "TRON_USDT_CONTRACT is missing or invalid."
    );
  }

  return contract;
}

function getTreasuryAddress() {
  const address =
    process.env.TRON_TREASURY_ADDRESS?.trim();

  if (
    !address ||
    !TronWeb.isAddress(address)
  ) {
    throw new Error(
      "TRON_TREASURY_ADDRESS is missing or invalid."
    );
  }

  return address;
}

function getAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    !supabaseUrl ||
    !serviceRoleKey
  ) {
    throw new Error(
      "Supabase server configuration is incomplete."
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

function validateDepositId(
  depositId: string
) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      depositId
    )
  ) {
    throw new Error(
      "USDT deposit ID is invalid."
    );
  }
}

function validateRawAmount(
  rawAmount: string
) {
  if (
    !/^\d+$/.test(rawAmount)
  ) {
    throw new Error(
      "USDT raw amount is invalid."
    );
  }

  if (
    BigInt(rawAmount) <=
    BigInt(0)
  ) {
    throw new Error(
      "USDT raw amount must be greater than zero."
    );
  }
}

function getSweepTxid(
  signedTransaction: {
    txID?: string;
  }
) {
  const txid =
    signedTransaction.txID
      ?.trim()
      .toLowerCase();

  if (
    !txid ||
    !/^[0-9a-f]{64}$/.test(txid)
  ) {
    throw new Error(
      "Signed TRON transaction ID is invalid."
    );
  }

  return txid;
}

function getTronErrorMessage(
  value: unknown
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const message =
    String(value).trim();

  if (!message) {
    return null;
  }

  return message;
}

async function releaseReservedSweep(
  depositId: string,
  sweepTxid: string,
  errorMessage: string
) {
  const adminClient =
    getAdminClient();

  const { error } =
    await adminClient.rpc(
      "release_usdt_deposit_sweep",
      {
        p_deposit_id:
          depositId,

        p_sweep_txid:
          sweepTxid,

        p_error_message:
          errorMessage,
      }
    );

  if (error) {
    console.error(
      "Unable to release failed USDT sweep:",
      error
    );
  }
}

export async function sweepUsdtDeposit(
  request: UsdtSweepRequest
): Promise<UsdtSweepResult> {
  validateDepositId(
    request.depositId
  );

  validateRawAmount(
    request.rawAmount
  );

  if (
    !TronWeb.isAddress(
      request.depositAddress
    )
  ) {
    throw new Error(
      "USDT deposit address is invalid."
    );
  }

  const configuredNetwork =
    getDepositNetwork();

  if (
    request.network !==
    configuredNetwork
  ) {
    throw new Error(
      "Deposit network does not match the configured TRON network."
    );
  }

  const usdtContract =
    getUsdtContract();

  const treasuryAddress =
    getTreasuryAddress();

  if (
    request.depositAddress ===
    treasuryAddress
  ) {
    throw new Error(
      "Deposit address and Treasury address must be different."
    );
  }

  const depositWallet =
    deriveTronDepositWallet(
      request.derivationIndex
    );

  if (
    depositWallet.address !==
    request.depositAddress
  ) {
    throw new Error(
      "Derived TRON address does not match the saved deposit address."
    );
  }

  const tronWeb =
    new TronWeb({
      fullHost:
        getTronGridBaseUrl(
          configuredNetwork
        ),

      headers:
        getTronGridHeaders(),

      privateKey:
        depositWallet.privateKey,
    });

  const triggerResult =
    await tronWeb
      .transactionBuilder
      .triggerSmartContract(
        usdtContract,

        "transfer(address,uint256)",

        {
          feeLimit:
            DEFAULT_FEE_LIMIT,
        },

        [
          {
            type:
              "address",

            value:
              treasuryAddress,
          },

          {
            type:
              "uint256",

            value:
              request.rawAmount,
          },
        ],

        request.depositAddress
      );

  if (
    triggerResult.result
      ?.result !== true ||
    !triggerResult.transaction
  ) {
    throw new Error(
      getTronErrorMessage(
        triggerResult.result
          ?.message
      ) ??
        "Unable to create USDT sweep transaction."
    );
  }

  const signedTransaction =
    await tronWeb.trx.sign(
      triggerResult.transaction,

      depositWallet.privateKey
    );

  if (
    typeof signedTransaction ===
    "string"
  ) {
    throw new Error(
      "TRON returned an invalid signed transaction."
    );
  }

  const sweepTxid =
    getSweepTxid(
      signedTransaction
    );

  const adminClient =
    getAdminClient();

  const {
    data: reserveData,
    error: reserveError,
  } =
    await adminClient.rpc(
      "reserve_usdt_deposit_sweep",
      {
        p_deposit_id:
          request.depositId,

        p_sweep_txid:
          sweepTxid,
      }
    );

  if (
    reserveError
  ) {
    throw new Error(
      `Unable to reserve USDT sweep: ${reserveError.message}`
    );
  }

  const reserveResult =
    reserveData as
      | ReserveSweepResult
      | null;

  if (
    reserveResult
      ?.alreadySwept ===
    true
  ) {
    throw new Error(
      "USDT deposit has already been swept."
    );
  }

  if (
    reserveResult
      ?.alreadyPending ===
    true
  ) {
    return {
      success: true,

      depositId:
        request.depositId,

      sweepTxid,

      status:
        "SWEEP_PENDING",

      broadcast:
        false,

      alreadyPending:
        true,
    };
  }

  if (
    reserveResult
      ?.reserved !==
    true
  ) {
    throw new Error(
      "USDT sweep could not be reserved."
    );
  }

  try {
    const broadcastResult =
      await tronWeb.trx
        .sendRawTransaction(
          signedTransaction
        );

    if (
      broadcastResult.result !==
      true
    ) {
      const message =
        getTronErrorMessage(
          broadcastResult.message
        ) ??
        getTronErrorMessage(
          broadcastResult.code
        ) ??
        "TRON rejected the USDT sweep transaction.";

      throw new Error(
        message
      );
    }

    const broadcastTxid =
      broadcastResult.txid
        ?.trim()
        .toLowerCase();

    if (
      broadcastTxid &&
      broadcastTxid !==
      sweepTxid
    ) {
      throw new Error(
        "Broadcast transaction ID does not match the signed transaction."
      );
    }

    return {
      success: true,

      depositId:
        request.depositId,

      sweepTxid,

      status:
        "SWEEP_PENDING",

      broadcast:
        true,

      alreadyPending:
        false,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "USDT sweep broadcast failed.";

    await releaseReservedSweep(
      request.depositId,

      sweepTxid,

      message
    );

    throw error;
  }
}