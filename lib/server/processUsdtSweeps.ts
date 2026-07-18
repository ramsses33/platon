import "server-only";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  type TronDepositNetwork,
} from "@/lib/server/tronDepositWallet";

import {
  sweepUsdtDeposit,
} from "@/lib/server/tronUsdtSweep";

type CreditedDepositRow = {
  id: string;

  deposit_address_id:
    string;

  network:
    TronDepositNetwork;

  raw_amount:
    string;
};

type DepositAddressRow = {
  address:
    string;

  derivation_index:
    number;

  network:
    TronDepositNetwork;

  is_active:
    boolean;
};

type PendingDepositRow = {
  id:
    string;

  sweep_txid:
    string;
};

type TronTransactionInfo = {
  id?:
    string;

  receipt?: {
    result?:
      string;
  };

  result?:
    string;

  resMessage?:
    string;
};

export type UsdtSweepProcessingResult = {
  success:
    boolean;

  network:
    TronDepositNetwork;

  creditedDeposits:
    number;

  startedSweeps:
    number;

  alreadyPending:
    number;

  pendingSweeps:
    number;

  completedSweeps:
    number;

  releasedSweeps:
    number;

  errors:
    string[];
};

const MAX_CREDITED_DEPOSITS =
  25;

const MAX_PENDING_SWEEPS =
  100;

const REQUEST_TIMEOUT_MS =
  15_000;

function getDepositNetwork():
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

function getTransactionFailureMessage(
  transactionInfo:
    TronTransactionInfo
) {
  const receiptResult =
    transactionInfo
      .receipt
      ?.result
      ?.trim();

  const result =
    transactionInfo
      .result
      ?.trim();

  const responseMessage =
    transactionInfo
      .resMessage
      ?.trim();

  return (
    responseMessage ||
    receiptResult ||
    result ||
    "TRON sweep transaction failed."
  );
}

export async function processUsdtSweeps():
  Promise<
    UsdtSweepProcessingResult
  > {
  const network =
    getDepositNetwork();

  const adminClient =
    getAdminClient();

  const errors:
    string[] =
      [];

  let creditedDeposits =
    0;

  let startedSweeps =
    0;

  let alreadyPending =
    0;

  let pendingSweeps =
    0;

  let completedSweeps =
    0;

  let releasedSweeps =
    0;

  /*
   * Сначала проверяем ранее
   * отправленные переводы.
   */
  const {
    data:
      pendingData,

    error:
      pendingError,
  } =
    await adminClient
      .from(
        "usdt_deposits"
      )
      .select(
        `
          id,
          sweep_txid
        `
      )
      .eq(
        "network",
        network
      )
      .eq(
        "status",
        "SWEEP_PENDING"
      )
      .not(
        "sweep_txid",
        "is",
        null
      )
      .order(
        "updated_at",
        {
          ascending:
            true,
        }
      )
      .limit(
        MAX_PENDING_SWEEPS
      );

  if (
    pendingError
  ) {
    throw new Error(
      `Unable to load pending USDT sweeps: ${pendingError.message}`
    );
  }

  const pendingRows =
    (
      pendingData ??
      []
    ) as
      PendingDepositRow[];

  pendingSweeps =
    pendingRows.length;

  for (
    const deposit
    of pendingRows
  ) {
    try {
      const txid =
        deposit
          .sweep_txid
          .trim()
          .toLowerCase();

      if (
        !/^[0-9a-f]{64}$/.test(
          txid
        )
      ) {
        throw new Error(
          `Invalid sweep transaction ID for deposit ${deposit.id}.`
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
       * не подтверждена.
       */
      if (
        !transactionInfo.id
      ) {
        continue;
      }

      if (
        transactionInfo.id
          .trim()
          .toLowerCase() !==
        txid
      ) {
        throw new Error(
          `TRON transaction ID mismatch for deposit ${deposit.id}.`
        );
      }

      if (
        transactionInfo
          .receipt
          ?.result ===
        "SUCCESS"
      ) {
        const {
          error:
            completeError,
        } =
          await adminClient.rpc(
            "complete_usdt_deposit_sweep",

            {
              p_deposit_id:
                deposit.id,

              p_sweep_txid:
                txid,
            }
          );

        if (
          completeError
        ) {
          throw new Error(
            `Unable to complete USDT sweep: ${completeError.message}`
          );
        }

        completedSweeps +=
          1;

        continue;
      }

      const failureMessage =
        getTransactionFailureMessage(
          transactionInfo
        );

      const {
        error:
          releaseError,
      } =
        await adminClient.rpc(
          "release_usdt_deposit_sweep",

          {
            p_deposit_id:
              deposit.id,

            p_sweep_txid:
              txid,

            p_error_message:
              failureMessage,
          }
        );

      if (
        releaseError
      ) {
        throw new Error(
          `Unable to release failed USDT sweep: ${releaseError.message}`
        );
      }

      releasedSweeps +=
        1;
    } catch (
      error
    ) {
      const message =
        error instanceof
        Error
          ? error.message
          : "Unknown USDT sweep confirmation error.";

      errors.push(
        message
      );
    }
  }

  /*
   * Затем запускаем новые
   * переводы CREDITED.
   */
  const {
    data:
      creditedData,

    error:
      creditedError,
  } =
    await adminClient
      .from(
        "usdt_deposits"
      )
      .select(
        `
          id,
          deposit_address_id,
          network,
          raw_amount
        `
      )
      .eq(
        "network",
        network
      )
      .eq(
        "status",
        "CREDITED"
      )
      .order(
        "credited_at",
        {
          ascending:
            true,
        }
      )
      .limit(
        MAX_CREDITED_DEPOSITS
      );

  if (
    creditedError
  ) {
    throw new Error(
      `Unable to load credited USDT deposits: ${creditedError.message}`
    );
  }

  const creditedRows =
    (
      creditedData ??
      []
    ) as
      CreditedDepositRow[];

  creditedDeposits =
    creditedRows.length;

  for (
    const deposit
    of creditedRows
  ) {
    try {
      const {
        data:
          addressData,

        error:
          addressError,
      } =
        await adminClient
          .from(
            "usdt_deposit_addresses"
          )
          .select(
            `
              address,
              derivation_index,
              network,
              is_active
            `
          )
          .eq(
            "id",
            deposit
              .deposit_address_id
          )
          .single();

      if (
        addressError
      ) {
        throw new Error(
          `Unable to load deposit address: ${addressError.message}`
        );
      }

      const depositAddress =
        addressData as
          DepositAddressRow;

      if (
        depositAddress
          .network !==
        network
      ) {
        throw new Error(
          `Deposit address network mismatch for deposit ${deposit.id}.`
        );
      }

      if (
        depositAddress
          .is_active !==
        true
      ) {
        throw new Error(
          `Deposit address is inactive for deposit ${deposit.id}.`
        );
      }

      const result =
        await sweepUsdtDeposit(
          {
            depositId:
              deposit.id,

            depositAddress:
              depositAddress
                .address,

            derivationIndex:
              depositAddress
                .derivation_index,

            network:
              deposit.network,

            rawAmount:
              String(
                deposit
                  .raw_amount
              ),
          }
        );

      if (
        result
          .alreadyPending
      ) {
        alreadyPending +=
          1;
      } else {
        startedSweeps +=
          1;
      }
    } catch (
      error
    ) {
      const message =
        error instanceof
        Error
          ? error.message
          : "Unknown USDT sweep start error.";

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

    creditedDeposits,

    startedSweeps,

    alreadyPending,

    pendingSweeps,

    completedSweeps,

    releasedSweeps,

    errors,
  };
}