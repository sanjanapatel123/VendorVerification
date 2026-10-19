"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  ListTodo,
  Settings,
  ShieldCheck,
  X,
  Leaf,
} from "lucide-react";

const navigation = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Vendors", href: "/vendors", icon: Building2 },
  { label: "Verifications", href: "/vendors", icon: ClipboardCheck },
  { label: "Tasks & Reviews", href: "/vendors", icon: ListTodo },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar drawer */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-[#eaece6] bg-white px-5 py-6 shadow-xl transition-transform duration-300 ease-in-out lg:w-[248px] lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 px-1"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#22372b] text-white">
              <Leaf size={21} />
            </div>

            <div>
              <p className="font-editorial text-[23px] leading-none tracking-tight text-[#22372b]">
                Veridian
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[2px] text-[#858a82]">
                Vendor workspace
              </p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-[#747a71] transition hover:bg-[#f4f5f0] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-[#9a9d95]">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map(({ label, href, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#22372b] text-white shadow-sm"
                    : "text-[#747a71] hover:bg-[#f4f5f0] hover:text-[#22372b]"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />

                <span>{label}</span>

                {label === "Tasks & Reviews" && (
                  <span
                    className={`ml-auto h-1.5 w-1.5 rounded-full ${
                      active ? "bg-[#c5d8bd]" : "bg-[#b5c9ac]"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto">
          <div className="mb-5 rounded-2xl border border-[#e7e9e1] bg-[#fafbf7] p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7eee2] text-[#22372b]">
              <ShieldCheck size={19} />
            </div>

            <p className="text-sm font-semibold text-[#26352a]">
              Verification hub
            </p>

            <p className="mt-1 text-xs leading-5 text-[#858a82]">
              Keep every vendor record organized and review-ready.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new Event("open-settings"));
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#747a71] transition hover:bg-[#f4f5f0] hover:text-[#22372b]"
          >
            <Settings size={18} />
            Settings
          </button>

          <div className="mt-4 flex items-center gap-3 border-t border-[#eaece6] pt-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8e4d8] text-sm font-semibold text-[#534e40]">
              SP
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#26352a]">
                Workspace Admin
              </p>
              <p className="text-xs text-[#858a82]">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
