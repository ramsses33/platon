"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

type UserRow = {
  user_id: string;
  wallet_address: string;
  balance: number;
  usdt_balance: number;
  locked_platon: number;
  locked_usdt: number;
};

export default function UsersManager() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("wallets")
      .select(`
        user_id,
        wallet_address,
        balance,
        usdt_balance,
        locked_platon,
        locked_usdt
      `)
      .order("wallet_address", { ascending: true })
      .limit(200);

    if (error) {
      console.error(error);
      toast.error("Failed to load users.");
      setUsers([]);
      setLoading(false);
      return;
    }

    const formatted = (data ?? []).map((user) => ({
      ...user,
      balance: Number(user.balance),
      usdt_balance: Number(user.usdt_balance),
      locked_platon: Number(user.locked_platon),
      locked_usdt: Number(user.locked_usdt),
    })) as UserRow[];

    setUsers(formatted);
    setLoading(false);
  }

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return users;

    return users.filter(
      (user) =>
        user.user_id.toLowerCase().includes(normalizedSearch) ||
        user.wallet_address.toLowerCase().includes(normalizedSearch)
    );
  }, [users, search]);

  const totals = useMemo(() => {
    return users.reduce(
      (result, user) => {
        result.platon += user.balance;
        result.usdt += user.usdt_balance;
        result.lockedPlaton += user.locked_platon;
        result.lockedUsdt += user.locked_usdt;

        return result;
      },
      {
        platon: 0,
        usdt: 0,
        lockedPlaton: 0,
        lockedUsdt: 0,
      }
    );
  }, [users]);

  function shortValue(value: string) {
    if (value.length <= 24) return value;

    return `${value.slice(0, 12)}...${value.slice(-6)}`;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Users"
          value={users.length.toLocaleString()}
          className="text-white"
        />

        <StatCard
          label="Total PLATON"
          value={`${totals.platon.toLocaleString()} π`}
          className="text-yellow-400"
        />

        <StatCard
          label="Total USDT"
          value={`$${totals.usdt.toLocaleString()}`}
          className="text-emerald-400"
        />

        <StatCard
          label="Locked PLATON"
          value={`${totals.lockedPlaton.toLocaleString()} π`}
          className="text-cyan-400"
        />

        <StatCard
          label="Locked USDT"
          value={`$${totals.lockedUsdt.toLocaleString()}`}
          className="text-violet-400"
        />
      </div>

      <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-3xl font-black">Users Manager</h2>

            <p className="mt-2 text-sm text-gray-400">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>

          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="rounded-xl bg-white/10 px-4 py-3 font-bold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by user ID or wallet address"
          className="mt-8 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none focus:border-emerald-400"
        />

        {loading ? (
          <div className="py-12 text-center text-gray-400">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            No matching users found.
          </div>
        ) : (
          <div className="mt-8 grid gap-5 xl:grid-cols-2">
            {filteredUsers.map((user) => (
              <div
                key={user.user_id}
                className="rounded-2xl border border-white/10 bg-black/25 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[3px] text-gray-500">
                      Wallet
                    </p>

                    <p
                      title={user.wallet_address}
                      className="mt-2 truncate font-mono text-sm text-emerald-300"
                    >
                      {shortValue(user.wallet_address)}
                    </p>

                    <p
                      title={user.user_id}
                      className="mt-2 truncate font-mono text-xs text-gray-500"
                    >
                      User: {shortValue(user.user_id)}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
                    ACTIVE
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <BalanceItem
                    label="PLATON"
                    value={`${user.balance.toLocaleString()} π`}
                    className="text-yellow-400"
                  />

                  <BalanceItem
                    label="USDT"
                    value={`$${user.usdt_balance.toLocaleString()}`}
                    className="text-emerald-400"
                  />

                  <BalanceItem
                    label="Locked PLATON"
                    value={`${user.locked_platon.toLocaleString()} π`}
                    className="text-cyan-400"
                  />

                  <BalanceItem
                    label="Locked USDT"
                    value={`$${user.locked_usdt.toLocaleString()}`}
                    className="text-violet-400"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  className: string;
};

function StatCard({ label, value, className }: StatCardProps) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl">
      <p className="text-sm text-gray-400">{label}</p>
      <h2 className={`mt-3 text-2xl font-black ${className}`}>
        {value}
      </h2>
    </div>
  );
}

type BalanceItemProps = {
  label: string;
  value: string;
  className: string;
};

function BalanceItem({
  label,
  value,
  className,
}: BalanceItemProps) {
  return (
    <div className="rounded-2xl bg-white/[0.04] p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-2 font-black ${className}`}>{value}</p>
    </div>
  );
}