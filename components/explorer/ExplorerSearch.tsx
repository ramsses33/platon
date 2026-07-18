"use client";

import {
  Blocks,
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

export default function ExplorerSearch() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (
        event.key === "/" &&
        document.activeElement?.tagName !== "INPUT"
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
      handleShortcut
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleShortcut
      );
    };
  }, []);

  function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      inputRef.current?.focus();
      return;
    }

    window.dispatchEvent(
      new CustomEvent(
        "platon-explorer-search",
        {
          detail: {
            query: normalizedQuery,
          },
        }
      )
    );
  }

  function clearSearch() {
    setQuery("");
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
                setQuery(event.target.value)
              }
              placeholder="Search wallet address, transaction or block..."
              autoComplete="off"
              spellCheck={false}
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
            disabled={!query.trim()}
            className="flex h-16 items-center justify-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400 px-7 text-sm font-black text-[#05070A] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.06] disabled:text-white/25 lg:min-w-[190px]"
          >
            <Search size={18} />

            Search Network
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
      </div>
    </section>
  );
}