import "server-only";

import { TronWeb } from "tronweb";

export type TronDepositNetwork =
  | "SHASTA"
  | "MAINNET";

export type ConfirmedIncomingUsdtTransfer = {
  txid: string;
  eventIndex: number;
  fromAddress: string;
  toAddress: string;
  tokenContract: string;
  tokenDecimals: number;
  rawAmount: string;
  amount: string;
  blockNumber: number;
  blockTimestamp: string;
};

type TronGridTrc20Transfer = {
  transaction_id?: string;

  token_info?: {
    symbol?: string;
    address?: string;
    decimals?: number;
    name?: string;
  };

  block_timestamp?: number;

  from?: string;

  to?: string;

  type?: string;

  value?: string;
};

type TronGridAccountResponse = {
  data?: TronGridTrc20Transfer[];

  success?: boolean;

  meta?: {
    fingerprint?: string;
  };
};

type TronGridEvent = {
  block_number?: number;

  block_timestamp?: number;

  contract_address?: string;

  event_index?:
    | number
    | string;

  event_name?: string;

  event?: string;

  transaction_id?: string;

  result?: Record<
    string,
    string
  >;

  _unconfirmed?: boolean;
};

type TronGridEventsResponse = {
  data?: TronGridEvent[];

  success?: boolean;
};

type TronTransactionInfo = {
  id?: string;

  blockNumber?: number;

  blockTimeStamp?: number;

  receipt?: {
    result?: string;
  };

  result?: string;
};

const REQUEST_TIMEOUT_MS =
  15_000;

const PAGE_LIMIT =
  200;

const MAX_PAGES =
  20;

function getDepositNetwork():
  TronDepositNetwork {
  const network =
    process.env
      .TRON_DEPOSIT_NETWORK
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

function getTronGridBaseUrl() {
  const network =
    getDepositNetwork();

  if (
    network === "SHASTA"
  ) {
    return "https://api.shasta.trongrid.io";
  }

  return "https://api.trongrid.io";
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

async function fetchJson<T>(
  input: string,

  init?: RequestInit
): Promise<T> {
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
        input,
        {
          ...init,

          signal:
            controller.signal,

          cache:
            "no-store",
        }
      );

    if (
      !response.ok
    ) {
      const responseText =
        await response
          .text()
          .catch(
            () => ""
          );

      throw new Error(
        `TronGrid request failed with status ${response.status}${
          responseText
            ? `: ${responseText.slice(
                0,
                300
              )}`
            : ""
        }`
      );
    }

    return (
      await response.json()
    ) as T;
  } finally {
    clearTimeout(
      timeout
    );
  }
}

function normalizeTronAddressToHex(
  value:
    | string
    | null
    | undefined
) {
  if (
    !value
  ) {
    return null;
  }

  const trimmed =
    value.trim();

  if (
    !trimmed
  ) {
    return null;
  }

  if (
    trimmed.startsWith(
      "T"
    ) &&
    TronWeb.isAddress(
      trimmed
    )
  ) {
    const hexAddress =
      TronWeb.address.toHex(
        trimmed
      );

    if (
      typeof hexAddress !==
      "string"
    ) {
      return null;
    }

    return hexAddress
      .toLowerCase();
  }

  const hexValue =
    trimmed.replace(
      /^0x/i,
      ""
    );

  if (
    /^[0-9a-fA-F]{40}$/.test(
      hexValue
    )
  ) {
    return (
      `41${hexValue}`
        .toLowerCase()
    );
  }

  if (
    /^41[0-9a-fA-F]{40}$/.test(
      hexValue
    )
  ) {
    return hexValue
      .toLowerCase();
  }

  return null;
}

function tronAddressesMatch(
  firstAddress:
    | string
    | null
    | undefined,

  secondAddress:
    | string
    | null
    | undefined
) {
  const firstHex =
    normalizeTronAddressToHex(
      firstAddress
    );

  const secondHex =
    normalizeTronAddressToHex(
      secondAddress
    );

  return (
    firstHex !== null &&
    secondHex !== null &&
    firstHex === secondHex
  );
}

function isValidTxid(
  value: string
) {
  return (
    /^[0-9a-fA-F]{64}$/.test(
      value
    )
  );
}

function parseEventIndex(
  value:
    | number
    | string
    | undefined
) {
  if (
    value === undefined
  ) {
    throw new Error(
      "TRON event index is missing."
    );
  }

  const eventIndex =
    Number(
      value
    );

  if (
    !Number.isSafeInteger(
      eventIndex
    ) ||
    eventIndex < 0
  ) {
    throw new Error(
      "TRON event index is invalid."
    );
  }

  return eventIndex;
}

function parsePositiveInteger(
  value:
    | number
    | undefined,

  fieldName: string
) {
  if (
    !Number.isSafeInteger(
      value
    ) ||
    Number(
      value
    ) <= 0
  ) {
    throw new Error(
      `${fieldName} is invalid.`
    );
  }

  return Number(
    value
  );
}

function getEventResultValue(
  result:
    | Record<
        string,
        string
      >
    | undefined,

  names: string[]
) {
  if (
    !result
  ) {
    return null;
  }

  for (
    const name
    of names
  ) {
    const value =
      result[
        name
      ];

    if (
      typeof value ===
        "string" &&
      value.length > 0
    ) {
      return value;
    }
  }

  return null;
}

function createDecimalAmount(
  rawAmount: string,

  decimals: number
) {
  if (
    !/^\d+$/.test(
      rawAmount
    )
  ) {
    throw new Error(
      "TRC20 raw amount is invalid."
    );
  }

  if (
    !Number.isSafeInteger(
      decimals
    ) ||
    decimals < 0 ||
    decimals > 18
  ) {
    throw new Error(
      "TRC20 token decimals are invalid."
    );
  }

  const normalized =
    rawAmount
      .replace(
        /^0+/,
        ""
      ) ||
    "0";

  if (
    decimals === 0
  ) {
    return normalized;
  }

  const padded =
    normalized.padStart(
      decimals + 1,
      "0"
    );

  const wholePart =
    padded.slice(
      0,
      -decimals
    );

  const fractionalPart =
    padded
      .slice(
        -decimals
      )
      .replace(
        /0+$/,
        ""
      );

  if (
    !fractionalPart
  ) {
    return wholePart;
  }

  return (
    `${wholePart}.${fractionalPart}`
  );
}

function matchesTransferEvent(
  event:
    TronGridEvent,

  transfer:
    TronGridTrc20Transfer,

  usdtContract:
    string
) {
  const eventName =
    (
      event.event_name ??
      ""
    )
      .trim()
      .toLowerCase();

  const eventSignature =
    (
      event.event ??
      ""
    )
      .trim()
      .toLowerCase();

  const isTransfer =
    eventName ===
      "transfer" ||
    eventSignature.startsWith(
      "transfer("
    );

  if (
    !isTransfer
  ) {
    return false;
  }

  if (
    event._unconfirmed ===
    true
  ) {
    return false;
  }

  if (
    !tronAddressesMatch(
      event.contract_address,

      usdtContract
    )
  ) {
    return false;
  }

  if (
    event.transaction_id !==
    transfer.transaction_id
  ) {
    return false;
  }

  const resultFrom =
    getEventResultValue(
      event.result,

      [
        "from",
        "_from",
      ]
    );

  const resultTo =
    getEventResultValue(
      event.result,

      [
        "to",
        "_to",
      ]
    );

  const resultValue =
    getEventResultValue(
      event.result,

      [
        "value",
        "_value",
      ]
    );

  const hasComparableData =
    resultFrom !== null ||
    resultTo !== null ||
    resultValue !== null;

  if (
    !hasComparableData
  ) {
    return true;
  }

  if (
    resultFrom !== null &&
    !tronAddressesMatch(
      resultFrom,

      transfer.from
    )
  ) {
    return false;
  }

  if (
    resultTo !== null &&
    !tronAddressesMatch(
      resultTo,

      transfer.to
    )
  ) {
    return false;
  }

  if (
    resultValue !== null &&
    resultValue !==
      transfer.value
  ) {
    return false;
  }

  return true;
}

async function getConfirmedEvent(
  transfer:
    TronGridTrc20Transfer,

  baseUrl:
    string,

  headers:
    Record<
      string,
      string
    >,

  usdtContract:
    string
) {
  const txid =
    transfer.transaction_id;

  if (
    !txid ||
    !isValidTxid(
      txid
    )
  ) {
    throw new Error(
      "TRON transaction ID is invalid."
    );
  }

  const requestUrl =
    new URL(
      `/v1/transactions/${txid}/events`,

      baseUrl
    );

  requestUrl.searchParams.set(
    "only_confirmed",
    "true"
  );

  const response =
    await fetchJson<
      TronGridEventsResponse
    >(
      requestUrl.toString(),

      {
        method:
          "GET",

        headers,
      }
    );

  if (
    response.success !==
    true
  ) {
    throw new Error(
      "TronGrid events request was unsuccessful."
    );
  }

  const matchingEvents =
    (
      response.data ??
      []
    )
      .filter(
        (
          event
        ) =>
          matchesTransferEvent(
            event,

            transfer,

            usdtContract
          )
      );

  if (
    matchingEvents.length ===
    1
  ) {
    return matchingEvents[0];
  }

  if (
    matchingEvents.length >
    1
  ) {
    throw new Error(
      `Multiple matching USDT events found for transaction ${txid}.`
    );
  }

  throw new Error(
    `Confirmed USDT event was not found for transaction ${txid}.`
  );
}

async function getConfirmedTransactionInfo(
  txid: string,

  baseUrl:
    string,

  headers:
    Record<
      string,
      string
    >
) {
  const response =
    await fetchJson<
      TronTransactionInfo
    >(
      `${baseUrl}/walletsolidity/gettransactioninfobyid`,

      {
        method:
          "POST",

        headers,

        body:
          JSON.stringify({
            value:
              txid,
          }),
      }
    );

  if (
    response.id !==
    txid
  ) {
    throw new Error(
      `Confirmed transaction information was not found for ${txid}.`
    );
  }

  if (
    response.receipt
      ?.result !==
    "SUCCESS"
  ) {
    throw new Error(
      `TRON transaction ${txid} was not successful.`
    );
  }

  return response;
}

async function convertTransfer(
  transfer:
    TronGridTrc20Transfer,

  depositAddress:
    string,

  baseUrl:
    string,

  headers:
    Record<
      string,
      string
    >,

  usdtContract:
    string
):
  Promise<
    ConfirmedIncomingUsdtTransfer
  > {
  const txid =
    transfer.transaction_id
      ?.trim();

  const fromAddress =
    transfer.from
      ?.trim();

  const toAddress =
    transfer.to
      ?.trim();

  const rawAmount =
    transfer.value
      ?.trim();

  const tokenContract =
    transfer.token_info
      ?.address
      ?.trim();

  const tokenDecimals =
    Number(
      transfer.token_info
        ?.decimals
    );

  const transferType =
    transfer.type
      ?.trim()
      .toLowerCase();

  if (
    !txid ||
    !isValidTxid(
      txid
    )
  ) {
    throw new Error(
      "TRON transaction ID is invalid."
    );
  }

  if (
    transferType !==
    "transfer"
  ) {
    throw new Error(
      `Unsupported TRC20 transaction type: ${transfer.type ?? "unknown"}.`
    );
  }

  if (
    !fromAddress ||
    !TronWeb.isAddress(
      fromAddress
    )
  ) {
    throw new Error(
      `Sender address is invalid for transaction ${txid}.`
    );
  }

  if (
    !toAddress ||
    !TronWeb.isAddress(
      toAddress
    )
  ) {
    throw new Error(
      `Recipient address is invalid for transaction ${txid}.`
    );
  }

  if (
    !tronAddressesMatch(
      toAddress,

      depositAddress
    )
  ) {
    throw new Error(
      `Transaction ${txid} was not sent to the requested deposit address.`
    );
  }

  if (
    !tronAddressesMatch(
      tokenContract,

      usdtContract
    )
  ) {
    throw new Error(
      `Unexpected token contract in transaction ${txid}.`
    );
  }

  if (
    tokenDecimals !==
    6
  ) {
    throw new Error(
      `Unexpected USDT decimals in transaction ${txid}.`
    );
  }

  if (
    !rawAmount ||
    !/^\d+$/.test(
      rawAmount
    ) ||
    BigInt(
      rawAmount
    ) <=
      BigInt(0)
  ) {
    throw new Error(
      `Invalid USDT amount in transaction ${txid}.`
    );
  }

  const [
    confirmedEvent,

    transactionInfo,
  ] =
    await Promise.all(
      [
        getConfirmedEvent(
          transfer,

          baseUrl,

          headers,

          usdtContract
        ),

        getConfirmedTransactionInfo(
          txid,

          baseUrl,

          headers
        ),
      ]
    );

  const eventIndex =
    parseEventIndex(
      confirmedEvent
        .event_index
    );

  const blockNumber =
    parsePositiveInteger(
      transactionInfo
        .blockNumber,

      "TRON block number"
    );

  const blockTimestampMs =
    parsePositiveInteger(
      transactionInfo
        .blockTimeStamp,

      "TRON block timestamp"
    );

  if (
    confirmedEvent
      .block_number !==
      undefined &&
    confirmedEvent
      .block_number !==
      blockNumber
  ) {
    throw new Error(
      `Block number mismatch for transaction ${txid}.`
    );
  }

  const blockTimestamp =
    new Date(
      blockTimestampMs
    );

  if (
    Number.isNaN(
      blockTimestamp.getTime()
    )
  ) {
    throw new Error(
      `Invalid block timestamp for transaction ${txid}.`
    );
  }

  return {
    txid,

    eventIndex,

    fromAddress,

    toAddress,

    tokenContract:
      usdtContract,

    tokenDecimals,

    rawAmount,

    amount:
      createDecimalAmount(
        rawAmount,

        tokenDecimals
      ),

    blockNumber,

    blockTimestamp:
      blockTimestamp.toISOString(),
  };
}

export async function getConfirmedIncomingUsdtTransfers(
  depositAddress:
    string,

  minTimestampMs =
    0
):
  Promise<
    ConfirmedIncomingUsdtTransfer[]
  > {
  if (
    !TronWeb.isAddress(
      depositAddress
    )
  ) {
    throw new Error(
      "Deposit TRON address is invalid."
    );
  }

  if (
    !Number.isSafeInteger(
      minTimestampMs
    ) ||
    minTimestampMs < 0
  ) {
    throw new Error(
      "Minimum timestamp is invalid."
    );
  }

  const baseUrl =
    getTronGridBaseUrl();

  const usdtContract =
    getUsdtContract();

  const headers =
    getRequestHeaders();

  const transfers:
    ConfirmedIncomingUsdtTransfer[] =
      [];

  const processedKeys =
    new Set<
      string
    >();

  let fingerprint:
    | string
    | undefined;

  for (
    let page = 0;

    page <
    MAX_PAGES;

    page += 1
  ) {
    const requestUrl =
      new URL(
        `/v1/accounts/${depositAddress}/transactions/trc20`,

        baseUrl
      );

    requestUrl.searchParams.set(
      "only_confirmed",
      "true"
    );

    requestUrl.searchParams.set(
      "only_to",
      "true"
    );

    requestUrl.searchParams.set(
      "contract_address",
      usdtContract
    );

    requestUrl.searchParams.set(
      "order_by",
      "block_timestamp,asc"
    );

    requestUrl.searchParams.set(
      "limit",
      String(
        PAGE_LIMIT
      )
    );

    if (
      minTimestampMs >
      0
    ) {
      requestUrl.searchParams.set(
        "min_timestamp",
        String(
          minTimestampMs
        )
      );
    }

    if (
      fingerprint
    ) {
      requestUrl.searchParams.set(
        "fingerprint",
        fingerprint
      );
    }

    const response =
      await fetchJson<
        TronGridAccountResponse
      >(
        requestUrl.toString(),

        {
          method:
            "GET",

          headers,
        }
      );

    if (
      response.success !==
      true
    ) {
      throw new Error(
        "TronGrid TRC20 history request was unsuccessful."
      );
    }

    const pageTransfers =
      response.data ??
      [];

    for (
      const transfer
      of pageTransfers
    ) {
      const converted =
        await convertTransfer(
          transfer,

          depositAddress,

          baseUrl,

          headers,

          usdtContract
        );

      const uniqueKey =
        `${converted.txid}:${converted.eventIndex}`;

      if (
        processedKeys.has(
          uniqueKey
        )
      ) {
        continue;
      }

      processedKeys.add(
        uniqueKey
      );

      transfers.push(
        converted
      );
    }

    const nextFingerprint =
      response.meta
        ?.fingerprint
        ?.trim();

    if (
      !nextFingerprint ||
      pageTransfers.length ===
      0
    ) {
      break;
    }

    fingerprint =
      nextFingerprint;
  }

  return transfers.sort(
    (
      first,

      second
    ) => {
      const timeDifference =
        new Date(
          first.blockTimestamp
        ).getTime() -
        new Date(
          second.blockTimestamp
        ).getTime();

      if (
        timeDifference !==
        0
      ) {
        return timeDifference;
      }

      if (
        first.txid !==
        second.txid
      ) {
        return first.txid.localeCompare(
          second.txid
        );
      }

      return (
        first.eventIndex -
        second.eventIndex
      );
    }
  );
}