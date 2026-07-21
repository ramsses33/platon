"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Blocks,
  CheckCircle2,
  CircleX,
  Clock3,
  Hash,
  LoaderCircle,
  Search,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type ExplorerBlock = {
  block_number: number;
  block_hash: string;
  previous_hash: string;
  validator: string;
  transaction_count: number;
  confirmed_at: string;
};

type ExplorerTransaction = {
  id: string;
  sender_wallet: string | null;
  receiver_wallet: string;
  amount: number;
  type: string;
  status: string;
  created_at: string;
  block_number: number;
};

type BlockSearchResult = {
  type: "block";
  block: ExplorerBlock;
  transactions: ExplorerTransaction[];
};

type TransactionSearchResult = {
  type: "transaction";
  transaction: ExplorerTransaction;
  block: ExplorerBlock | null;
};

type WalletSearchResult = {
  type: "wallet";
  walletAddress: string;
  transactions: ExplorerTransaction[];
};

type NotFoundSearchResult = {
  type: "not_found";
};

type ExplorerSearchResult =
  | BlockSearchResult
  | TransactionSearchResult
  | WalletSearchResult
  | NotFoundSearchResult;

type ExplorerSearchResponse = {
  success: boolean;
  query?: string;
  result?: ExplorerSearchResult;
  error?: string;
};

function formatAmount(value: number) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "0";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(amount);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (
    !Number.isFinite(
      date.getTime(),
    )
  ) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "medium",
    },
  ).format(date);
}

function shortenValue(
  value: string,
  startLength = 12,
  endLength = 10,
) {
  if (
    value.length <=
    startLength + endLength + 3
  ) {
    return value;
  }

  return `${value.slice(
    0,
    startLength,
  )}...${value.slice(
    -endLength,
  )}`;
}

function statusStyle(
  status: string,
) {
  const normalizedStatus =
    status.toLowerCase();

  if (
    normalizedStatus ===
      "completed" ||
    normalizedStatus ===
      "confirmed"
  ) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-400";
  }

  if (
    normalizedStatus ===
      "failed" ||
    normalizedStatus ===
      "cancelled"
  ) {
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }

  return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
}

function TransactionRow({
  transaction,
  walletAddress,
}: {
  transaction: ExplorerTransaction;
  walletAddress?: string;
}) {
  const isSent =
    walletAddress &&
    transaction.sender_wallet ===
      walletAddress &&
    transaction.receiver_wallet !==
      walletAddress;

  const isReceived =
    walletAddress &&
    transaction.receiver_wallet ===
      walletAddress &&
    transaction.sender_wallet !==
      walletAddress;

  const directionLabel = isSent
    ? "Sent"
    : isReceived
      ? "Received"
      : transaction.type;

  const DirectionIcon = isSent
    ? ArrowUpRight
    : ArrowDownLeft;

  return (
    <article className="rounded-[20px] border border-white/[0.07] bg-black/20 p-4 transition hover:border-white/15 hover:bg-black/30 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
              isSent
                ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
                : "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
            }`}
          >
            <DirectionIcon
              size={19}
              strokeWidth={2.2}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-black capitalize text-white">
                {directionLabel}
              </p>

              <span
                className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${statusStyle(
                  transaction.status,
                )}`}
              >
                {transaction.status}
              </span>
            </div>

            <p className="mt-2 break-all font-mono text-[10px] leading-5 text-white/30">
              {transaction.id}
            </p>
          </div>
        </div>

        <div className="shrink-0 sm:text-right">
          <p className="text-lg font-black text-white">
            {formatAmount(
              transaction.amount,
            )}{" "}
            <span className="text-sm text-yellow-300">
              π
            </span>
          </p>

          <p className="mt-1 text-xs font-semibold text-violet-400">
            Block #
            {
              transaction.block_number
            }
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-white/[0.06] pt-4 lg:grid-cols-2">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/20">
            From
          </p>

          <p className="mt-1 break-all font-mono text-[10px] leading-5 text-white/40">
            {transaction.sender_wallet ??
              "PLATON_NETWORK"}
          </p>
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/20">
            To
          </p>

          <p className="mt-1 break-all font-mono text-[10px] leading-5 text-white/40">
            {
              transaction.receiver_wallet
            }
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[10px] font-medium text-white/25">
        <Clock3 size={12} />

        {formatDate(
          transaction.created_at,
        )}
      </div>
    </article>
  );
}

function BlockDetails({
  block,
}: {
  block: ExplorerBlock;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/20">
          Block Number
        </p>

        <p className="mt-2 text-xl font-black text-violet-400">
          #{block.block_number}
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/20">
          Transactions
        </p>

        <p className="mt-2 text-xl font-black text-cyan-400">
          {
            block.transaction_count
          }
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/20">
          Producer
        </p>

        <p className="mt-2 text-sm font-black text-white">
          {block.validator}
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/20">
          Confirmed
        </p>

        <p className="mt-2 text-xs font-bold leading-5 text-emerald-400">
          {formatDate(
            block.confirmed_at,
          )}
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4 sm:col-span-2">
        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/20">
          Block Hash
        </p>

        <p className="mt-2 break-all font-mono text-[10px] leading-5 text-white/40">
          {block.block_hash}
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4 sm:col-span-2">
        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/20">
          Previous Hash
        </p>

        <p className="mt-2 break-all font-mono text-[10px] leading-5 text-white/40">
          {block.previous_hash}
        </p>
      </div>
    </div>
  );
}

export default function ExplorerSearch() {
  const [query, setQuery] =
    useState("");

  const [searchedQuery, setSearchedQuery] =
    useState("");

  const [result, setResult] =
    useState<ExplorerSearchResult | null>(
      null,
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const inputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleShortcut(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "/" &&
        document.activeElement
          ?.tagName !== "INPUT"
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === "Escape") {
        inputRef.current?.blur();
      }
    }

    window.addEventListener(
      "keydown",
      handleShortcut,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleShortcut,
      );
    };
  }, []);

  async function searchNetwork(
    normalizedQuery: string,
  ) {
    setLoading(true);
    setError("");
    setResult(null);
    setSearchedQuery(
      normalizedQuery,
    );

    try {
      const response = await fetch(
        `/api/explorer/search?q=${encodeURIComponent(
          normalizedQuery,
        )}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data =
        (await response.json()) as
          ExplorerSearchResponse;

      if (
        !response.ok ||
        !data.success ||
        !data.result
      ) {
        throw new Error(
          data.error ??
            "Unable to search the PLATON Network.",
        );
      }

      setResult(data.result);
    } catch (searchError) {
      console.error(
        "Explorer search failed:",
        searchError,
      );

      setError(
        searchError instanceof Error
          ? searchError.message
          : "Unable to search the PLATON Network.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedQuery =
      query.trim();

    if (!normalizedQuery) {
      inputRef.current?.focus();
      return;
    }

    void searchNetwork(
      normalizedQuery,
    );
  }

  function clearSearch() {
    setQuery("");
    setSearchedQuery("");
    setResult(null);
    setError("");
    inputRef.current?.focus();
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/20 p-4 sm:p-5">
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-400/[0.07] blur-[80px]" />

      <div className="relative">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 lg:flex-row"
        >
          <div className="relative flex-1">
            <Search
              size={21}
              strokeWidth={2.2}
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400"
            />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value,
                )
              }
              placeholder="Search wallet address, transaction ID, block number or block hash..."
              autoComplete="off"
              spellCheck={false}
              maxLength={128}
              className="h-16 w-full rounded-2xl border border-white/10 bg-white/[0.045] py-4 pl-14 pr-24 text-base font-semibold text-white outline-none transition placeholder:font-normal placeholder:text-white/25 hover:border-white/15 focus:border-emerald-400/50 focus:bg-white/[0.065] focus:shadow-[0_0_35px_rgba(52,211,153,0.08)]"
            />

            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/[0.08] hover:text-white"
                  aria-label="Clear explorer search"
                >
                  <X size={16} />
                </button>
              )}

              {!query && (
                <span className="hidden rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-[10px] font-black text-white/25 sm:block">
                  /
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={
              !query.trim() || loading
            }
            className="flex h-16 items-center justify-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400 px-7 text-sm font-black text-[#05070A] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.06] disabled:text-white/25 lg:min-w-[190px]"
          >
            {loading ? (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            ) : (
              <Search size={18} />
            )}

            {loading
              ? "Searching..."
              : "Search Network"}
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-4 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-2">
              <Wallet
                size={13}
                className="text-cyan-400"
              />

              <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/35">
                Wallets
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-2">
              <ShieldCheck
                size={13}
                className="text-emerald-400"
              />

              <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/35">
                Transactions
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-2">
              <Blocks
                size={13}
                className="text-violet-400"
              />

              <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/35">
                Blocks
              </span>
            </div>
          </div>

          <p className="text-xs font-medium text-white/25">
            Press{" "}
            <span className="font-black text-white/45">
              /
            </span>{" "}
            to focus search
          </p>
        </div>

        {error && (
          <div
            className="mt-6 rounded-[22px] border border-rose-400/20 bg-rose-400/[0.07] p-5"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <CircleX
                size={20}
                className="mt-0.5 shrink-0 text-rose-300"
              />

              <div>
                <p className="font-black text-rose-300">
                  Search failed
                </p>

                <p className="mt-1 text-sm leading-6 text-white/40">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div
            className="mt-6 rounded-[26px] border border-white/10 bg-white/[0.035] p-4 sm:p-6"
            aria-live="polite"
          >
            <div className="mb-6 flex flex-col gap-4 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                  Search Result
                </p>

                <p className="mt-2 break-all font-mono text-xs text-white/35">
                  {searchedQuery}
                </p>
              </div>

              {result.type !==
                "not_found" && (
                <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-400"
                  />

                  <span className="text-[10px] font-black uppercase tracking-[0.13em] text-emerald-400">
                    Verified Record
                  </span>
                </div>
              )}
            </div>

            {result.type ===
              "not_found" && (
              <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/25">
                  <Search size={27} />
                </div>

                <h3 className="mt-5 text-lg font-black text-white">
                  Record not found
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                  No block, transaction or
                  wallet activity matched
                  this identifier.
                </p>
              </div>
            )}

            {result.type ===
              "block" && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
                    <Blocks size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-white/25">
                      Network Block
                    </p>

                    <h3 className="mt-1 text-xl font-black text-white">
                      Block #
                      {
                        result.block
                          .block_number
                      }
                    </h3>
                  </div>
                </div>

                <BlockDetails
                  block={result.block}
                />

                <div className="mt-6">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-white/25">
                    Block Transactions
                  </p>

                  <div className="space-y-3">
                    {result.transactions.map(
                      (transaction) => (
                        <TransactionRow
                          key={
                            transaction.id
                          }
                          transaction={
                            transaction
                          }
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {result.type ===
              "transaction" && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                    <ShieldCheck
                      size={20}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-white/25">
                      Transaction
                    </p>

                    <h3 className="mt-1 font-mono text-sm font-black text-white sm:text-base">
                      {shortenValue(
                        result.transaction
                          .id,
                        14,
                        12,
                      )}
                    </h3>
                  </div>
                </div>

                <TransactionRow
                  transaction={
                    result.transaction
                  }
                />

                {result.block && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Hash
                        size={15}
                        className="text-violet-400"
                      />

                      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/25">
                        Confirmed In Block
                      </p>
                    </div>

                    <BlockDetails
                      block={result.block}
                    />
                  </div>
                )}
              </div>
            )}

            {result.type ===
              "wallet" && (
              <div>
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                      <Wallet size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-white/25">
                        Wallet Activity
                      </p>

                      <p className="mt-2 break-all font-mono text-xs leading-5 text-white sm:text-sm">
                        {
                          result.walletAddress
                        }
                      </p>
                    </div>
                  </div>

                  <div className="w-fit rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/20">
                      Transactions Found
                    </p>

                    <p className="mt-1 text-xl font-black text-cyan-400">
                      {
                        result
                          .transactions
                          .length
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {result.transactions.map(
                    (transaction) => (
                      <TransactionRow
                        key={
                          transaction.id
                        }
                        transaction={
                          transaction
                        }
                        walletAddress={
                          result.walletAddress
                        }
                      />
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
