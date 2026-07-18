import "server-only";

import {
  createClient,
} from "@supabase/supabase-js";

import type {
  TronDepositNetwork,
} from "@/lib/server/tronDepositWallet";

import {
  sendUsdtWithdrawal,
} from "@/lib/server/sendUsdtWithdrawal";

import {
  rebroadcastSignedUsdtWithdrawal,
} from "@/lib/server/rebroadcastSignedUsdtWithdrawal";

type ProcessingWithdrawalRow = {
  id: string;
};

type RequestedWithdrawalRow = {
  id: string;
};

type SignedWithdrawalRow = {
  id: string;
};

type BroadcastWithdrawalRow = {
  id: string;

  txid: string;
};

type TronTransactionInfo = {
  id?: string;

  receipt?: {
    result?: string;
  };

  result?: string;

  resMessage?: string;
};

type StaleProcessingRefundResult = {
  success?: boolean;

  refunded?: boolean;

  alreadyRefunded?: boolean;

  tooEarly?: boolean;

  withdrawalId?: string;

  amount?:
    | string
    | number;

  status?: string;
};

export type UsdtWithdrawalProcessingResult = {
  success: boolean;

  network:
    TronDepositNetwork;

  staleProcessingWithdrawals:
    number;

  refundedStaleProcessingWithdrawals:
    number;

  alreadyRefundedStaleProcessingWithdrawals:
    number;

  broadcastWithdrawals:
    number;

  completedWithdrawals:
    number;

  failedConfirmations:
    number;

  signedWithdrawals:
    number;

  recoveredSignedWithdrawals:
    number;

  alreadyKnownSignedWithdrawals:
    number;

  requestedWithdrawals:
    number;

  startedWithdrawals:
    number;

  errors:
    string[];
};

const MAX_STALE_PROCESSING_WITHDRAWALS =
  100;

const MAX_BROADCAST_WITHDRAWALS =
  100;

const MAX_SIGNED_WITHDRAWALS =
  100;

const MAX_REQUESTED_WITHDRAWALS =
  10;

const PROCESSING_TIMEOUT_MS =
  10 *
  60 *
  1000;

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

function getRequestHeaders() {
  const apiKey =
    process.env
      .TRONGRID_API_KEY
      ?.trim();

  const headers:
    Record<
      string,
      string
    > = {
      Accept:
        "application/json",

      "Content-Type":
        "application/json",
    };

  if (
    apiKey
  ) {
    headers[
      "TRON-PRO-API-KEY"
    ] =
      apiKey;
  }

  return headers;
}

function getAdminClient() {
  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

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
        persistSession:
          false,

        autoRefreshToken:
          false,
      },
    }
  );
}

async function fetchTransactionInfo(
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
        )}/walletsolidity/gettransactioninfobyid`,

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
        `TRON confirmation request failed with status ${response.status}.`
      );
    }

    return (
      await response.json()
    ) as
      TronTransactionInfo;
  } finally {
    clearTimeout(
      timeout
    );
  }
}

function getReceiptResult(
  transactionInfo:
    TronTransactionInfo
) {
  const result =
    transactionInfo
      .receipt
      ?.result
      ?.trim()
      .toUpperCase();

  if (
    !result
  ) {
    return null;
  }

  return result;
}

function getTransactionFailureMessage(
  transactionInfo:
    TronTransactionInfo
) {
  const responseMessage =
    transactionInfo
      .resMessage
      ?.trim();

  const receiptResult =
    transactionInfo
      .receipt
      ?.result
      ?.trim();

  const result =
    transactionInfo
      .result
      ?.trim();

  return (
    responseMessage ||
    receiptResult ||
    result ||
    "TRON withdrawal transaction failed."
  );
}

async function refundStaleProcessingWithdrawal(
  withdrawalId:
    string
) {
  const adminClient =
    getAdminClient();

  const {
    data,

    error,
  } =
    await adminClient.rpc(
      "refund_stale_processing_usdt_withdrawal",

      {
        p_withdrawal_id:
          withdrawalId,
      }
    );

  if (
    error
  ) {
    throw new Error(
      `Unable to refund stale USDT withdrawal: ${error.message}`
    );
  }

  const result =
    data as
      | StaleProcessingRefundResult
      | null;

  if (
    result
      ?.success !==
    true
  ) {
    throw new Error(
      "Stale USDT withdrawal refund was not completed."
    );
  }

  if (
    result
      .withdrawalId !==
    withdrawalId
  ) {
    throw new Error(
      "Refunded stale withdrawal ID does not match."
    );
  }

  return result;
}

async function refundFailedBroadcastWithdrawal(
  withdrawalId:
    string,

  txid:
    string,

  errorMessage:
    string
) {
  const adminClient =
    getAdminClient();

  const {
    data,

    error,
  } =
    await adminClient.rpc(
      "fail_and_refund_broadcast_usdt_withdrawal",

      {
        p_withdrawal_id:
          withdrawalId,

        p_txid:
          txid,

        p_error_message:
          errorMessage,
      }
    );

  if (
    error
  ) {
    throw new Error(
      `Unable to refund failed USDT withdrawal: ${error.message}`
    );
  }

  const result =
    data as
      | {
          success?:
            boolean;

          refunded?:
            boolean;

          alreadyRefunded?:
            boolean;

          withdrawalId?:
            string;

          txid?:
            string;

          status?:
            string;
        }
      | null;

  if (
    result
      ?.success !==
    true
  ) {
    throw new Error(
      "Failed USDT withdrawal refund was not completed."
    );
  }

  if (
    result
      .withdrawalId !==
    withdrawalId
  ) {
    throw new Error(
      "Refunded withdrawal ID does not match."
    );
  }

  const refundedTxid =
    result
      .txid
      ?.trim()
      .toLowerCase();

  if (
    refundedTxid &&
    refundedTxid !==
      txid
  ) {
    throw new Error(
      "Refunded withdrawal transaction ID does not match."
    );
  }
}

export async function processUsdtWithdrawals():
  Promise<
    UsdtWithdrawalProcessingResult
  > {
  const network =
    getConfiguredNetwork();

  const adminClient =
    getAdminClient();

  const errors:
    string[] =
      [];

  let staleProcessingWithdrawals =
    0;

  let refundedStaleProcessingWithdrawals =
    0;

  let alreadyRefundedStaleProcessingWithdrawals =
    0;

  let broadcastWithdrawals =
    0;

  let completedWithdrawals =
    0;

  let failedConfirmations =
    0;

  let signedWithdrawals =
    0;

  let recoveredSignedWithdrawals =
    0;

  let alreadyKnownSignedWithdrawals =
    0;

  let requestedWithdrawals =
    0;

  let startedWithdrawals =
    0;

  /*
   * Этап 1.
   *
   * Возвращаем USDT по заявкам,
   * которые зависли в PROCESSING
   * больше 10 минут и не получили
   * TXID или подписанную транзакцию.
   */

  const staleBefore =
    new Date(
      Date.now() -
      PROCESSING_TIMEOUT_MS
    )
      .toISOString();

  const {
    data:
      staleProcessingData,

    error:
      staleProcessingError,
  } =
    await adminClient
      .from(
        "usdt_withdrawals"
      )
      .select(
        "id"
      )
      .eq(
        "network",
        network
      )
      .eq(
        "status",
        "PROCESSING"
      )
      .is(
        "txid",
        null
      )
      .is(
        "signed_transaction",
        null
      )
      .not(
        "processing_at",
        "is",
        null
      )
      .lte(
        "processing_at",
        staleBefore
      )
      .order(
        "processing_at",

        {
          ascending:
            true,
        }
      )
      .limit(
        MAX_STALE_PROCESSING_WITHDRAWALS
      );

  if (
    staleProcessingError
  ) {
    throw new Error(
      `Unable to load stale processing USDT withdrawals: ${staleProcessingError.message}`
    );
  }

  const staleProcessingRows =
    (
      staleProcessingData ??
      []
    ) as
      ProcessingWithdrawalRow[];

  staleProcessingWithdrawals =
    staleProcessingRows.length;

  for (
    const withdrawal
    of staleProcessingRows
  ) {
    try {
      const result =
        await refundStaleProcessingWithdrawal(
          withdrawal.id
        );

      if (
        result.refunded ===
        true
      ) {
        refundedStaleProcessingWithdrawals +=
          1;

        continue;
      }

      if (
        result.alreadyRefunded ===
        true
      ) {
        alreadyRefundedStaleProcessingWithdrawals +=
          1;
      }
    } catch (
      error
    ) {
      const message =
        error instanceof
        Error
          ? error.message
          : "Unknown stale USDT withdrawal refund error.";

      errors.push(
        message
      );
    }
  }

  /*
   * Этап 2.
   *
   * Проверяем уже отправленные
   * транзакции BROADCAST.
   */

  const {
    data:
      broadcastData,

    error:
      broadcastError,
  } =
    await adminClient
      .from(
        "usdt_withdrawals"
      )
      .select(
        `
          id,
          txid
        `
      )
      .eq(
        "network",
        network
      )
      .eq(
        "status",
        "BROADCAST"
      )
      .not(
        "txid",
        "is",
        null
      )
      .order(
        "broadcast_at",

        {
          ascending:
            true,
        }
      )
      .limit(
        MAX_BROADCAST_WITHDRAWALS
      );

  if (
    broadcastError
  ) {
    throw new Error(
      `Unable to load broadcast USDT withdrawals: ${broadcastError.message}`
    );
  }

  const broadcastRows =
    (
      broadcastData ??
      []
    ) as
      BroadcastWithdrawalRow[];

  broadcastWithdrawals =
    broadcastRows.length;

  for (
    const withdrawal
    of broadcastRows
  ) {
    try {
      const txid =
        withdrawal
          .txid
          .trim()
          .toLowerCase();

      if (
        !/^[0-9a-f]{64}$/.test(
          txid
        )
      ) {
        throw new Error(
          `Invalid TRON transaction ID for withdrawal ${withdrawal.id}.`
        );
      }

      const transactionInfo =
        await fetchTransactionInfo(
          txid,

          network
        );

      /*
       * Пустой объект означает,
       * что транзакция ещё
       * не появилась среди
       * подтверждённых операций.
       */

      if (
        !transactionInfo.id
      ) {
        continue;
      }

      if (
        transactionInfo
          .id
          .trim()
          .toLowerCase() !==
        txid
      ) {
        throw new Error(
          `TRON transaction ID mismatch for withdrawal ${withdrawal.id}.`
        );
      }

      const receiptResult =
        getReceiptResult(
          transactionInfo
        );

      /*
       * Транзакция уже найдена,
       * но TRON ещё не вернул
       * окончательный результат.
       *
       * Не завершаем вывод
       * и не возвращаем USDT.
       */

      if (
        !receiptResult
      ) {
        continue;
      }

      if (
        receiptResult ===
        "SUCCESS"
      ) {
        const {
          error:
            completeError,
        } =
          await adminClient.rpc(
            "complete_usdt_withdrawal",

            {
              p_withdrawal_id:
                withdrawal.id,

              p_txid:
                txid,
            }
          );

        if (
          completeError
        ) {
          throw new Error(
            `Unable to complete USDT withdrawal: ${completeError.message}`
          );
        }

        completedWithdrawals +=
          1;

        continue;
      }

      /*
       * Возврат выполняется
       * только при явном результате
       * ошибки от сети TRON.
       */

      const failureMessage =
        getTransactionFailureMessage(
          transactionInfo
        );

      await refundFailedBroadcastWithdrawal(
        withdrawal.id,

        txid,

        failureMessage
      );

      failedConfirmations +=
        1;
    } catch (
      error
    ) {
      const message =
        error instanceof
        Error
          ? error.message
          : "Unknown USDT withdrawal confirmation error.";

      errors.push(
        message
      );
    }
  }

  /*
   * Этап 3.
   *
   * Восстанавливаем подписанные
   * транзакции SIGNED.
   */

  const {
    data:
      signedData,

    error:
      signedError,
  } =
    await adminClient
      .from(
        "usdt_withdrawals"
      )
      .select(
        "id"
      )
      .eq(
        "network",
        network
      )
      .eq(
        "status",
        "SIGNED"
      )
      .order(
        "signed_at",

        {
          ascending:
            true,
        }
      )
      .limit(
        MAX_SIGNED_WITHDRAWALS
      );

  if (
    signedError
  ) {
    throw new Error(
      `Unable to load signed USDT withdrawals: ${signedError.message}`
    );
  }

  const signedRows =
    (
      signedData ??
      []
    ) as
      SignedWithdrawalRow[];

  signedWithdrawals =
    signedRows.length;

  for (
    const withdrawal
    of signedRows
  ) {
    try {
      const result =
        await rebroadcastSignedUsdtWithdrawal(
          withdrawal.id
        );

      if (
        result.status ===
          "BROADCAST" &&
        result.broadcast ===
          true
      ) {
        recoveredSignedWithdrawals +=
          1;

        continue;
      }

      if (
        result.alreadyKnown ===
        true
      ) {
        alreadyKnownSignedWithdrawals +=
          1;
      }
    } catch (
      error
    ) {
      const message =
        error instanceof
        Error
          ? error.message
          : "Unknown signed USDT withdrawal recovery error.";

      errors.push(
        message
      );
    }
  }

  /*
   * Этап 4.
   *
   * Запускаем новые заявки
   * REQUESTED.
   */

  const {
    data:
      requestedData,

    error:
      requestedError,
  } =
    await adminClient
      .from(
        "usdt_withdrawals"
      )
      .select(
        "id"
      )
      .eq(
        "network",
        network
      )
      .eq(
        "status",
        "REQUESTED"
      )
      .order(
        "requested_at",

        {
          ascending:
            true,
        }
      )
      .limit(
        MAX_REQUESTED_WITHDRAWALS
      );

  if (
    requestedError
  ) {
    throw new Error(
      `Unable to load requested USDT withdrawals: ${requestedError.message}`
    );
  }

  const requestedRows =
    (
      requestedData ??
      []
    ) as
      RequestedWithdrawalRow[];

  requestedWithdrawals =
    requestedRows.length;

  for (
    const withdrawal
    of requestedRows
  ) {
    try {
      const result =
        await sendUsdtWithdrawal(
          withdrawal.id
        );

      if (
        result.success &&
        result.broadcast
      ) {
        startedWithdrawals +=
          1;
      }
    } catch (
      error
    ) {
      const message =
        error instanceof
        Error
          ? error.message
          : "Unknown USDT withdrawal start error.";

      errors.push(
        message
      );
    }
  }

  return {
    success:
      errors.length ===
      0,

    network,

    staleProcessingWithdrawals,

    refundedStaleProcessingWithdrawals,

    alreadyRefundedStaleProcessingWithdrawals,

    broadcastWithdrawals,

    completedWithdrawals,

    failedConfirmations,

    signedWithdrawals,

    recoveredSignedWithdrawals,

    alreadyKnownSignedWithdrawals,

    requestedWithdrawals,

    startedWithdrawals,

    errors,
  };
}