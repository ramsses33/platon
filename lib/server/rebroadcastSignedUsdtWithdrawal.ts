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

type WithdrawalStatus =
  | "SIGNED"
  | "BROADCAST"
  | "COMPLETED";

type SignedWithdrawalRow = {
  id:
    string;

  network:
    TronDepositNetwork;

  status:
    WithdrawalStatus;

  txid:
    string;

  signed_transaction:
    unknown;
};

type TronTransactionResponse = {
  txID?:
    string;
};

type BroadcastStatusResult = {
  success?:
    boolean;

  updated?:
    boolean;

  alreadyBroadcast?:
    boolean;

  withdrawalId?:
    string;

  txid?:
    string;

  status?:
    string;
};

export type RebroadcastSignedUsdtWithdrawalResult = {
  success:
    boolean;

  withdrawalId:
    string;

  txid:
    string;

  status:
    "BROADCAST"
    | "COMPLETED";

  broadcast:
    boolean;

  alreadyKnown:
    boolean;
};

const REQUEST_TIMEOUT_MS =
  15_000;

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

function getRequestHeaders() {
  return {
    Accept:
      "application/json",

    "Content-Type":
      "application/json",

    ...getTronGridHeaders(),
  };
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

function normalizeTxid(
  value:
    string
) {
  const txid =
    value
      .trim()
      .toLowerCase();

  if (
    !/^[0-9a-f]{64}$/.test(
      txid
    )
  ) {
    throw new Error(
      "USDT withdrawal transaction ID is invalid."
    );
  }

  return txid;
}

function isPlainObject(
  value:
    unknown
): value is
  Record<
    string,
    unknown
  > {
  return (
    typeof value ===
      "object" &&
    value !==
      null &&
    !Array.isArray(
      value
    )
  );
}

function getSignedTransaction(
  value:
    unknown,

  expectedTxid:
    string
) {
  if (
    !isPlainObject(
      value
    )
  ) {
    throw new Error(
      "Saved signed TRON transaction is invalid."
    );
  }

  const transactionTxid =
    typeof value.txID ===
      "string"
      ? value.txID
          .trim()
          .toLowerCase()
      : "";

  if (
    transactionTxid !==
    expectedTxid
  ) {
    throw new Error(
      "Saved signed transaction ID does not match."
    );
  }

  return value;
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

async function transactionExists(
  txid:
    string,

  network:
    TronDepositNetwork
) {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () => {
        controller.abort();
      },

      REQUEST_TIMEOUT_MS
    );

  try {
    const response =
      await fetch(
        `${getTronGridBaseUrl(
          network
        )}/wallet/gettransactionbyid`,

        {
          method:
            "POST",

          headers:
            getRequestHeaders(),

          body:
            JSON.stringify({
              value:
                txid,
            }),

          signal:
            controller.signal,

          cache:
            "no-store",
        }
      );

    if (
      !response.ok
    ) {
      throw new Error(
        `TRON transaction lookup failed with status ${response.status}.`
      );
    }

    const result =
      (
        await response.json()
      ) as
        TronTransactionResponse;

    return (
      result
        .txID
        ?.trim()
        .toLowerCase() ===
      txid
    );
  } finally {
    clearTimeout(
      timeout
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
      "Unable to save signed withdrawal retry error:",
      error
    );
  }
}

async function markAsBroadcast(
  withdrawalId:
    string,

  txid:
    string
) {
  const adminClient =
    getAdminClient();

  const {
    data,

    error,
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
    error
  ) {
    throw new Error(
      `Unable to mark USDT withdrawal as broadcast: ${error.message}`
    );
  }

  const result =
    data as
      | BroadcastStatusResult
      | null;

  if (
    result
      ?.success !==
    true
  ) {
    throw new Error(
      "USDT withdrawal BROADCAST status was not saved."
    );
  }

  const savedTxid =
    result
      .txid
      ?.trim()
      .toLowerCase();

  if (
    savedTxid &&
    savedTxid !==
      txid
  ) {
    throw new Error(
      "Saved BROADCAST transaction ID does not match."
    );
  }
}

export async function rebroadcastSignedUsdtWithdrawal(
  withdrawalId:
    string
):
  Promise<
    RebroadcastSignedUsdtWithdrawalResult
  > {
  validateWithdrawalId(
    withdrawalId
  );

  const adminClient =
    getAdminClient();

  const {
    data,

    error,
  } =
    await adminClient
      .from(
        "usdt_withdrawals"
      )
      .select(
        `
          id,
          network,
          status,
          txid,
          signed_transaction
        `
      )
      .eq(
        "id",
        withdrawalId
      )
      .single();

  if (
    error
  ) {
    throw new Error(
      `Unable to load signed USDT withdrawal: ${error.message}`
    );
  }

  const withdrawal =
    data as
      SignedWithdrawalRow;

  const txid =
    normalizeTxid(
      withdrawal.txid
    );

  if (
    withdrawal.status ===
    "COMPLETED"
  ) {
    return {
      success:
        true,

      withdrawalId,

      txid,

      status:
        "COMPLETED",

      broadcast:
        false,

      alreadyKnown:
        true,
    };
  }

  if (
    withdrawal.status ===
    "BROADCAST"
  ) {
    return {
      success:
        true,

      withdrawalId,

      txid,

      status:
        "BROADCAST",

      broadcast:
        false,

      alreadyKnown:
        true,
    };
  }

  if (
    withdrawal.status !==
    "SIGNED"
  ) {
    throw new Error(
      "USDT withdrawal is not waiting for signed transaction recovery."
    );
  }

  const configuredNetwork =
    getConfiguredNetwork();

  if (
    withdrawal.network !==
    configuredNetwork
  ) {
    throw new Error(
      "Signed withdrawal network does not match the configured TRON network."
    );
  }

  const signedTransaction =
    getSignedTransaction(
      withdrawal
        .signed_transaction,

      txid
    );

  const tronWeb =
    new TronWeb({
      fullHost:
        getTronGridBaseUrl(
          configuredNetwork
        ),

      headers:
        getTronGridHeaders(),
    });

  try {
    const broadcastResult =
      await tronWeb
        .trx
        .sendRawTransaction(
          signedTransaction as
            unknown as
            Parameters<
              typeof tronWeb
                .trx
                .sendRawTransaction
            >[0]
        );

    if (
      broadcastResult
        .result ===
      true
    ) {
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
        throw new Error(
          "Recovered broadcast transaction ID does not match."
        );
      }

      await markAsBroadcast(
        withdrawalId,

        txid
      );

      return {
        success:
          true,

        withdrawalId,

        txid,

        status:
          "BROADCAST",

        broadcast:
          true,

        alreadyKnown:
          false,
      };
    }

    const alreadyExists =
      await transactionExists(
        txid,

        configuredNetwork
      );

    if (
      alreadyExists
    ) {
      await markAsBroadcast(
        withdrawalId,

        txid
      );

      return {
        success:
          true,

        withdrawalId,

        txid,

        status:
          "BROADCAST",

        broadcast:
          false,

        alreadyKnown:
          true,
      };
    }

    const message =
      getTronErrorMessage(
        broadcastResult
          .message
      ) ??
      getTronErrorMessage(
        broadcastResult
          .code
      ) ??
      "TRON rejected the saved signed USDT transaction.";

    await saveSignedError(
      withdrawalId,

      message
    );

    throw new Error(
      message
    );
  } catch (
    error
  ) {
    const message =
      error instanceof
      Error
        ? error.message
        : "Signed USDT withdrawal recovery failed.";

    await saveSignedError(
      withdrawalId,

      message
    );

    throw error;
  }
}