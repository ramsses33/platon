import "server-only";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  TronWeb,
} from "tronweb";

import {
  type TronDepositNetwork,
} from "@/lib/server/tronDepositWallet";

type ClaimWithdrawalResult = {
  success?: boolean;

  claimed?: boolean;

  withdrawalId?: string;

  userId?: string;

  network?: TronDepositNetwork;

  destinationAddress?: string;

  amount?:
    | string
    | number;

  netAmount?:
    | string
    | number;

  status?: string;
};

type SignedStatusResult = {
  success?: boolean;

  reserved?: boolean;

  alreadySigned?: boolean;

  withdrawalId?: string;

  txid?: string;

  status?: string;
};

type BroadcastStatusResult = {
  success?: boolean;

  updated?: boolean;

  alreadyBroadcast?: boolean;

  withdrawalId?: string;

  txid?: string;

  status?: string;

  broadcastAttempts?: number;
};

export type SendUsdtWithdrawalResult = {
  success: boolean;

  withdrawalId: string;

  txid: string;

  status: "BROADCAST";

  broadcast: boolean;
};

const DEFAULT_FEE_LIMIT =
  100_000_000;

function getConfiguredNetwork():
  TronDepositNetwork {
  const network =
    process.env
      .TRON_DEPOSIT_NETWORK
      ?.trim()
      .toUpperCase();

  if (
    network !==
      "SHASTA" &&
    network !==
      "MAINNET"
  ) {
    throw new Error(
      "TRON_DEPOSIT_NETWORK must be SHASTA or MAINNET."
    );
  }

  return network;
}

function getTronGridBaseUrl(
  network:
    TronDepositNetwork
) {
  if (
    network ===
    "SHASTA"
  ) {
    return "https://api.shasta.trongrid.io";
  }

  return "https://api.trongrid.io";
}

function getTronGridHeaders():
  Record<
    string,
    string
  > {
  const apiKey =
    process.env
      .TRONGRID_API_KEY
      ?.trim();

  if (
    !apiKey
  ) {
    return {};
  }

  return {
    "TRON-PRO-API-KEY":
      apiKey,
  };
}

function getUsdtContract() {
  const contract =
    process.env
      .TRON_USDT_CONTRACT
      ?.trim();

  if (
    !contract ||
    !TronWeb.isAddress(
      contract
    )
  ) {
    throw new Error(
      "TRON_USDT_CONTRACT is missing or invalid."
    );
  }

  return contract;
}

function getHotWalletAddress() {
  const address =
    process.env
      .TRON_HOT_WALLET_ADDRESS
      ?.trim();

  if (
    !address ||
    !TronWeb.isAddress(
      address
    )
  ) {
    throw new Error(
      "TRON_HOT_WALLET_ADDRESS is missing or invalid."
    );
  }

  return address;
}

function getHotWalletPrivateKey() {
  const privateKey =
    process.env
      .TRON_HOT_WALLET_PRIVATE_KEY
      ?.trim()
      .replace(
        /^0x/i,
        ""
      );

  if (
    !privateKey ||
    !/^[0-9a-fA-F]{64}$/.test(
      privateKey
    )
  ) {
    throw new Error(
      "TRON_HOT_WALLET_PRIVATE_KEY is missing or invalid."
    );
  }

  return privateKey;
}

function getSupabaseUrl() {
  const value =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  if (
    !value
  ) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not configured."
    );
  }

  return value;
}

function getServiceRoleKey() {
  const value =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

  if (
    !value
  ) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured."
    );
  }

  return value;
}

function getAdminClient() {
  return createClient(
    getSupabaseUrl(),

    getServiceRoleKey(),

    {
      auth: {
        persistSession:
          false,

        autoRefreshToken:
          false,
      },
    }
  );
}

function validateWithdrawalId(
  withdrawalId:
    string
) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      withdrawalId
    )
  ) {
    throw new Error(
      "USDT withdrawal ID is invalid."
    );
  }
}

function usdtAmountToRaw(
  value:
    string
    | number
) {
  const amount =
    String(
      value
    )
      .trim();

  if (
    !/^(?:0|[1-9]\d*)(?:\.\d{1,6})?$/.test(
      amount
    )
  ) {
    throw new Error(
      "USDT withdrawal amount is invalid."
    );
  }

  const [
    wholePart,

    fractionalPart =
      "",
  ] =
    amount.split(
      "."
    );

  const paddedFraction =
    fractionalPart
      .padEnd(
        6,
        "0"
      );

  const rawAmount =
    (
      `${wholePart}${paddedFraction}`
    )
      .replace(
        /^0+/,
        ""
      ) ||
    "0";

  if (
    BigInt(
      rawAmount
    ) <=
    BigInt(
      0
    )
  ) {
    throw new Error(
      "USDT withdrawal amount must be greater than zero."
    );
  }

  return rawAmount;
}

function getTransactionId(
  signedTransaction: {
    txID?:
      string;
  }
) {
  const txid =
    signedTransaction
      .txID
      ?.trim()
      .toLowerCase();

  if (
    !txid ||
    !/^[0-9a-f]{64}$/.test(
      txid
    )
  ) {
    throw new Error(
      "Signed TRON transaction ID is invalid."
    );
  }

  return txid;
}

function getTronErrorMessage(
  value:
    unknown
) {
  if (
    value ===
      null ||
    value ===
      undefined
  ) {
    return null;
  }

  const message =
    String(
      value
    )
      .trim();

  if (
    !message
  ) {
    return null;
  }

  return message;
}

function createSignedTransactionPayload(
  signedTransaction:
    unknown
) {
  const serialized =
    JSON.stringify(
      signedTransaction
    );

  const parsed =
    JSON.parse(
      serialized
    ) as
      Record<
        string,
        unknown
      >;

  if (
    !parsed ||
    typeof parsed !==
      "object" ||
    Array.isArray(
      parsed
    )
  ) {
    throw new Error(
      "Signed TRON transaction could not be serialized."
    );
  }

  return parsed;
}

async function refundProcessingWithdrawal(
  withdrawalId:
    string,

  errorMessage:
    string
) {
  const adminClient =
    getAdminClient();

  const {
    error,
  } =
    await adminClient.rpc(
      "fail_and_refund_usdt_withdrawal",

      {
        p_withdrawal_id:
          withdrawalId,

        p_error_message:
          errorMessage,
      }
    );

  if (
    error
  ) {
    console.error(
      "Unable to refund failed USDT withdrawal:",
      error
    );
  }
}

async function saveSignedError(
  withdrawalId:
    string,

  message:
    string
) {
  const adminClient =
    getAdminClient();

  const {
    error,
  } =
    await adminClient
      .from(
        "usdt_withdrawals"
      )
      .update({
        error_message:
          message.slice(
            0,
            1000
          ),

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        withdrawalId
      )
      .eq(
        "status",
        "SIGNED"
      );

  if (
    error
  ) {
    console.error(
      "Unable to save signed USDT withdrawal error:",
      error
    );
  }
}

export async function sendUsdtWithdrawal(
  withdrawalId:
    string
):
  Promise<
    SendUsdtWithdrawalResult
  > {
  validateWithdrawalId(
    withdrawalId
  );

  const adminClient =
    getAdminClient();

  const {
    data:
      claimData,

    error:
      claimError,
  } =
    await adminClient.rpc(
      "claim_usdt_withdrawal",

      {
        p_withdrawal_id:
          withdrawalId,
      }
    );

  if (
    claimError
  ) {
    throw new Error(
      `Unable to claim USDT withdrawal: ${claimError.message}`
    );
  }

  const claimResult =
    claimData as
      | ClaimWithdrawalResult
      | null;

  if (
    !claimResult ||
    claimResult.success !==
      true ||
    claimResult.claimed !==
      true
  ) {
    throw new Error(
      "USDT withdrawal could not be claimed."
    );
  }

  let signedReserved =
    false;

  try {
    if (
      claimResult
        .withdrawalId !==
      withdrawalId
    ) {
      throw new Error(
        "Claimed withdrawal ID does not match."
      );
    }

    const configuredNetwork =
      getConfiguredNetwork();

    if (
      claimResult.network !==
      configuredNetwork
    ) {
      throw new Error(
        "Withdrawal network does not match the configured TRON network."
      );
    }

    const destinationAddress =
      claimResult
        .destinationAddress
        ?.trim();

    if (
      !destinationAddress ||
      !TronWeb.isAddress(
        destinationAddress
      )
    ) {
      throw new Error(
        "Withdrawal destination address is invalid."
      );
    }

    const hotWalletAddress =
      getHotWalletAddress();

    const hotWalletPrivateKey =
      getHotWalletPrivateKey();

    const derivedAddress =
      TronWeb
        .address
        .fromPrivateKey(
          hotWalletPrivateKey
        );

    if (
      !derivedAddress ||
      derivedAddress !==
        hotWalletAddress
    ) {
      throw new Error(
        "PLATON Hot Wallet private key does not match its configured address."
      );
    }

    if (
      destinationAddress ===
      hotWalletAddress
    ) {
      throw new Error(
        "Withdrawal destination cannot be the PLATON Hot Wallet."
      );
    }

    if (
      claimResult.netAmount ===
        undefined ||
      claimResult.netAmount ===
        null
    ) {
      throw new Error(
        "USDT withdrawal net amount is missing."
      );
    }

    const rawAmount =
      usdtAmountToRaw(
        claimResult
          .netAmount
      );

    const usdtContract =
      getUsdtContract();

    const tronWeb =
      new TronWeb({
        fullHost:
          getTronGridBaseUrl(
            configuredNetwork
          ),

        headers:
          getTronGridHeaders(),

        privateKey:
          hotWalletPrivateKey,
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
                destinationAddress,
            },

            {
              type:
                "uint256",

              value:
                rawAmount,
            },
          ],

          hotWalletAddress
        );

    if (
      triggerResult
        .result
        ?.result !==
        true ||
      !triggerResult
        .transaction
    ) {
      throw new Error(
        getTronErrorMessage(
          triggerResult
            .result
            ?.message
        ) ??
          "Unable to create USDT withdrawal transaction."
      );
    }

    const signedTransaction =
      await tronWeb
        .trx
        .sign(
          triggerResult
            .transaction,

          hotWalletPrivateKey
        );

    if (
      typeof signedTransaction ===
      "string"
    ) {
      throw new Error(
        "TRON returned an invalid signed transaction."
      );
    }

    const txid =
      getTransactionId(
        signedTransaction
      );

    const signedPayload =
      createSignedTransactionPayload(
        signedTransaction
      );

    const {
      data:
        signedData,

      error:
        signedError,
    } =
      await adminClient.rpc(
        "reserve_signed_usdt_withdrawal",

        {
          p_withdrawal_id:
            withdrawalId,

          p_txid:
            txid,

          p_signed_transaction:
            signedPayload,
        }
      );

    if (
      signedError
    ) {
      throw new Error(
        `Unable to reserve signed USDT withdrawal: ${signedError.message}`
      );
    }

    const signedStatus =
      signedData as
        | SignedStatusResult
        | null;

    if (
      signedStatus
        ?.success !==
      true
    ) {
      throw new Error(
        "Signed USDT withdrawal could not be reserved."
      );
    }

    const savedTxid =
      signedStatus
        .txid
        ?.trim()
        .toLowerCase();

    if (
      savedTxid &&
      savedTxid !==
        txid
    ) {
      throw new Error(
        "Saved signed transaction ID does not match."
      );
    }

    signedReserved =
      true;

    const broadcastResult =
      await tronWeb
        .trx
        .sendRawTransaction(
          signedTransaction
        );

    if (
      broadcastResult.result !==
      true
    ) {
      const message =
        getTronErrorMessage(
          broadcastResult
            .message
        ) ??
        getTronErrorMessage(
          broadcastResult
            .code
        ) ??
        "TRON rejected the USDT withdrawal transaction.";

      await saveSignedError(
        withdrawalId,

        message
      );

      throw new Error(
        message
      );
    }

    const returnedTxid =
      broadcastResult
        .txid
        ?.trim()
        .toLowerCase();

    if (
      returnedTxid &&
      returnedTxid !==
        txid
    ) {
      const message =
        "Broadcast transaction ID does not match the signed transaction.";

      await saveSignedError(
        withdrawalId,

        message
      );

      throw new Error(
        message
      );
    }

    const {
      data:
        broadcastData,

      error:
        broadcastError,
    } =
      await adminClient.rpc(
        "mark_usdt_withdrawal_broadcast",

        {
          p_withdrawal_id:
            withdrawalId,

          p_txid:
            txid,
        }
      );

    if (
      broadcastError
    ) {
      const message =
        `USDT was broadcast, but the database status could not be updated: ${broadcastError.message}`;

      await saveSignedError(
        withdrawalId,

        message
      );

      throw new Error(
        message
      );
    }

    const broadcastStatus =
      broadcastData as
        | BroadcastStatusResult
        | null;

    if (
      broadcastStatus
        ?.success !==
      true
    ) {
      const message =
        "USDT withdrawal was broadcast, but the BROADCAST status was not saved.";

      await saveSignedError(
        withdrawalId,

        message
      );

      throw new Error(
        message
      );
    }

    const savedBroadcastTxid =
      broadcastStatus
        .txid
        ?.trim()
        .toLowerCase();

    if (
      savedBroadcastTxid &&
      savedBroadcastTxid !==
        txid
    ) {
      throw new Error(
        "Broadcast database transaction ID does not match."
      );
    }

    return {
      success:
        true,

      withdrawalId,

      txid,

      status:
        "BROADCAST",

      broadcast:
        true,
    };
  } catch (
    error
  ) {
    const message =
      error instanceof
      Error
        ? error.message
        : "USDT withdrawal failed.";

    /*
     * Возврат выполняется только
     * до сохранения подписанной
     * транзакции.
     *
     * После статуса SIGNED
     * автоматический возврат запрещён,
     * потому что транзакция уже может
     * быть отправлена в сеть.
     */

    if (
      !signedReserved
    ) {
      await refundProcessingWithdrawal(
        withdrawalId,

        message
      );
    }

    throw error;
  }
}