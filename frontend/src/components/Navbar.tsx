"use client";

import { Bell, Search, Plus, Menu } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between gap-4 border-b border-[#eaece6] bg-white/90 px-5 backdrop-blur-xl sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          className="rounded-lg p-2 text-[#667066] hover:bg-[#f2f4ef] lg:hidden"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <div className="hidden items-center gap-2 text-xs text-[#8b9087] sm:flex">
          Workspace <span>/</span>
          <span className="font-medium text-[#26352a]">Overview</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <label className="hidden h-10 w-[230px] items-center gap-2 rounded-xl border border-[#e9ebe4] bg-[#fafbf8] px-3 focus-within:border-[#9aab96] md:flex">
          <Search size={16} className="text-[#92978e]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search workspace..."
            className="w-full bg-transparent text-xs outline-none placeholder:text-[#a0a49c]"
            onKeyDown={(event) => {
              if (event.key === "Enter" && search.trim()) {
                window.location.href = `/vendors?search=${encodeURIComponent(search)}`;
              }
            }}
          />
          <span className="rounded border border-[#e4e6df] px-1.5 py-0.5 text-[10px] text-[#9a9d95]">
            ↵
          </span>
        </label>

        <button
          onClick={() =>
            toast.info("You're all caught up.", {
              description: "Notifications will appear here.",
            })
          }
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9ebe4] text-[#667066] hover:bg-[#f5f6f2]"
        >
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#bd7956] ring-2 ring-white" />
        </button>

        <Link
          href="/vendors"
          className="flex h-10 items-center gap-2 rounded-xl bg-[#22372b] px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-[#304b3a] sm:px-4"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add vendor</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>
    </header>
  );
}
