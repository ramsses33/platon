import "server-only";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  getConfirmedIncomingUsdtTransfers,
  type TronDepositNetwork,
} from "@/lib/server/tronGridUsdt";

type DepositAddressRow = {
  id: string;

  user_id: string;

  address: string;

  network:
    TronDepositNetwork;

  created_at: string;

  last_scanned_at:
    | string
    | null;
};

type CreditDepositResult = {
  success?: boolean;

  credited?: boolean;

  duplicate?: boolean;

  depositId?: string;

  userId?: string;

  amount?:
    | number
    | string;

  status?: string;
};

type ScanError = {
  depositAddressId:
    string;

  address:
    string;

  message:
    string;
};

export type UsdtDepositScanResult = {
  success:
    boolean;

  network:
    TronDepositNetwork;

  scannedAddresses:
    number;

  detectedTransfers:
    number;

  creditedDeposits:
    number;

  duplicateDeposits:
    number;

  failedAddresses:
    number;

  errors:
    ScanError[];
};

const MAX_ADDRESSES_PER_SCAN =
  100;

const SCAN_OVERLAP_MS =
  15 *
  60 *
  1000;

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

function getMinimumTimestamp(
  depositAddress:
    DepositAddressRow
) {
  const sourceTimestamp =
    depositAddress
      .last_scanned_at ??
    depositAddress
      .created_at;

  const parsedTimestamp =
    new Date(
      sourceTimestamp
    ).getTime();

  if (
    !Number.isFinite(
      parsedTimestamp
    )
  ) {
    throw new Error(
      "Deposit address scan timestamp is invalid."
    );
  }

  return Math.max(
    0,

    parsedTimestamp -
      SCAN_OVERLAP_MS
  );
}

function getErrorMessage(
  error: unknown
) {
  if (
    error instanceof
    Error
  ) {
    return error.message;
  }

  return (
    "Unknown USDT deposit scan error."
  );
}

export async function scanConfirmedUsdtDeposits():
  Promise<
    UsdtDepositScanResult
  > {
  const network =
    getDepositNetwork();

  const adminClient =
    getAdminClient();

  const scanStartedAt =
    new Date()
      .toISOString();

  const {
    data:
      depositAddressData,

    error:
      depositAddressError,
  } =
    await adminClient
      .from(
        "usdt_deposit_addresses"
      )
      .select(
        `
          id,
          user_id,
          address,
          network,
          created_at,
          last_scanned_at
        `
      )
      .eq(
        "network",
        network
      )
      .eq(
        "is_active",
        true
      )
      .order(
        "last_scanned_at",
        {
          ascending:
            true,

          nullsFirst:
            true,
        }
      )
      .order(
        "created_at",
        {
          ascending:
            true,
        }
      )
      .limit(
        MAX_ADDRESSES_PER_SCAN
      );

  if (
    depositAddressError
  ) {
    throw new Error(
      `Unable to load USDT deposit addresses: ${depositAddressError.message}`
    );
  }

  const depositAddresses =
    (
      depositAddressData ??
      []
    ) as
      DepositAddressRow[];

  const result:
    UsdtDepositScanResult = {
      success:
        true,

      network,

      scannedAddresses:
        0,

      detectedTransfers:
        0,

      creditedDeposits:
        0,

      duplicateDeposits:
        0,

      failedAddresses:
        0,

      errors:
        [],
    };

  for (
    const depositAddress
    of depositAddresses
  ) {
    try {
      const minimumTimestamp =
        getMinimumTimestamp(
          depositAddress
        );

      const transfers =
        await getConfirmedIncomingUsdtTransfers(
          depositAddress.address,

          minimumTimestamp
        );

      result.detectedTransfers +=
        transfers.length;

      for (
        const transfer
        of transfers
      ) {
        const {
          data:
            creditData,

          error:
            creditError,
        } =
          await adminClient.rpc(
            "credit_confirmed_usdt_deposit",
            {
              p_deposit_address_id:
                depositAddress.id,

              p_network:
                network,

              p_txid:
                transfer.txid,

              p_event_index:
                transfer.eventIndex,

              p_from_address:
                transfer.fromAddress,

              p_to_address:
                transfer.toAddress,

              p_token_contract:
                transfer.tokenContract,

              p_token_decimals:
                transfer.tokenDecimals,

              p_raw_amount:
                transfer.rawAmount,

              p_amount:
                transfer.amount,

              p_block_number:
                transfer.blockNumber,

              p_block_timestamp:
                transfer.blockTimestamp,
            }
          );

        if (
          creditError
        ) {
          throw new Error(
            `Unable to credit transaction ${transfer.txid}: ${creditError.message}`
          );
        }

        const creditResult =
          creditData as
            | CreditDepositResult
            | null;

        if (
          creditResult
            ?.credited ===
          true
        ) {
          result
            .creditedDeposits +=
            1;
        } else if (
          creditResult
            ?.duplicate ===
          true
        ) {
          result
            .duplicateDeposits +=
            1;
        } else {
          throw new Error(
            `Unexpected credit result for transaction ${transfer.txid}.`
          );
        }
      }

      const {
        error:
          updateError,
      } =
        await adminClient
          .from(
            "usdt_deposit_addresses"
          )
          .update({
            last_scanned_at:
              scanStartedAt,

            updated_at:
              new Date()
                .toISOString(),
          })
          .eq(
            "id",
            depositAddress.id
          )
          .eq(
            "network",
            network
          );

      if (
        updateError
      ) {
        throw new Error(
          `Unable to update address scan time: ${updateError.message}`
        );
      }

      result
        .scannedAddresses +=
        1;
    } catch (
      error
    ) {
      const message =
        getErrorMessage(
          error
        );

      console.error(
        "USDT deposit address scan failed:",
        {
          depositAddressId:
            depositAddress.id,

          address:
            depositAddress.address,

          message,
        }
      );

      result
        .failedAddresses +=
        1;

      result.errors.push({
        depositAddressId:
          depositAddress.id,

        address:
          depositAddress.address,

        message,
      });
    }
  }

  result.success =
    result
      .failedAddresses ===
    0;

  return result;
}