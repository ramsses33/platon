"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl">
      <div className="flex items-center gap-4">
        <Search className="text-gray-400" size={22} />

        <input
          type="text"
          placeholder="Search transaction, wallet or block..."
          className="w-full bg-transparent text-lg outline-none placeholder:text-gray-500"
        />
      </div>
    </div>
  );
}