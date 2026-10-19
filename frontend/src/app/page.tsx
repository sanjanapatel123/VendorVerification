"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ShieldCheck,
  Users,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import VendorTable from "../components/VendorTable";
import { api, type Vendor } from "../lib/api";
import Link from "next/link";

function Skeleton() {
  return (
    <div className="space-y-3 p-5">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex items-center gap-4 py-2">
          <div className="skeleton h-10 w-10" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3 w-40" />
            <div className="skeleton h-3 w-28" />
          </div>
          <div className="skeleton h-6 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const loadVendors = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await api.getVendors();
      setVendors(result.vendors);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load vendors";
      setError(message);
      toast.error("Could not load vendors", { description: message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVendors();
  }, [loadVendors]);

  const approved = vendors.filter((v) => v.status === "APPROVED").length;
  const underReview = vendors.filter((v) => v.status === "UNDER_REVIEW").length;
  const actionRequired = vendors.filter(
    (v) => v.status === "ACTION_REQUIRED",
  ).length;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="min-h-screen lg:pl-[248px]">
        <Navbar onMenuClick={() => setMobileOpen(true)} />

        <main className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9">
          <div className="animate-fade-up flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e5e9df] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[1.2px] text-[#65735f]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6c9868]" />
                Vendor operations
              </div>
              <h1 className="font-editorial text-[36px] leading-tight tracking-[-1px] text-[#24352a] sm:text-[43px]">
                Good morning.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#858a82]">
                Your vendor verification workspace, organized and ready for
                review.
              </p>
            </div>

            <button
              onClick={() => void loadVendors()}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-[#e5e8e0] bg-white px-4 text-xs font-semibold text-[#455345] hover:border-[#b8c5b2] hover:bg-[#f6f8f3] disabled:opacity-60 sm:self-auto"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh data
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total vendors"
              value={loading ? "—" : vendors.length}
              note="All vendor records"
              icon={Users}
              accent
            />
            <StatCard
              title="Approved vendors"
              value={loading ? "—" : approved}
              note="Successfully approved"
              icon={CheckCircle2}
              delay="delay-100"
            />
            <StatCard
              title="Under review"
              value={loading ? "—" : underReview}
              note="Awaiting review"
              icon={Clock3}
              delay="delay-100"
            />
            <StatCard
              title="Action required"
              value={loading ? "—" : actionRequired}
              note="Needs follow-up"
              icon={AlertCircle}
              delay="delay-200"
            />
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <section className="animate-fade-up overflow-hidden rounded-2xl border border-[#e9ebe4] bg-white delay-100">
              <div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:px-6">
                <div>
                  <h2 className="font-editorial text-[23px] text-[#26372b]">
                    Vendor directory
                  </h2>
                  <p className="mt-1 text-xs text-[#92968e]">
                    Recent vendor records and verification status
                  </p>
                </div>
                <Link
                  href="/vendors"
                  className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-xs font-semibold text-[#334b37] hover:bg-[#f0f4ec]"
                >
                  View all vendors <ArrowRight size={14} />
                </Link>
              </div>

              {loading ? (
                <Skeleton />
              ) : error ? (
                <div className="p-8 text-center">
                  <AlertCircle className="mx-auto text-[#b76a4c]" size={25} />
                  <p className="mt-3 text-sm font-semibold">
                    Unable to load directory
                  </p>
                  <p className="mt-1 text-xs text-[#858a82]">{error}</p>
                  <button
                    onClick={() => void loadVendors()}
                    className="mt-4 rounded-lg bg-[#22372b] px-4 py-2 text-xs text-white"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <VendorTable vendors={vendors.slice(0, 5)} />
              )}
            </section>

            <aside className="animate-fade-up space-y-5 delay-200">
              <div className="overflow-hidden rounded-2xl bg-[#e8ede2] p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-[#344c39]">
                    <ShieldCheck size={21} />
                  </div>
                  <span className="rounded-full border border-[#cfd9c7] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[1px] text-[#60765d]">
                    Workspace
                  </span>
                </div>
                <h3 className="mt-5 font-editorial text-[25px] leading-tight text-[#26372b]">
                  Trust starts with the details.
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#657361]">
                  Keep company information, documents and review tasks together
                  in one place.
                </p>
                <Link
                  href="/vendors"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#22372b] px-4 py-3 text-xs font-semibold text-white hover:bg-[#304b3a]"
                >
                  Manage vendors <ArrowRight size={14} />
                </Link>
                <div className="pointer-events-none relative -mb-12 -mr-6 ml-auto mt-2 flex h-24 w-24 items-center justify-center rounded-full border border-[#c9d4c1]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c9d4c1]">
                    <ShieldCheck size={30} className="text-[#71866a]" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e9ebe4] bg-white p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f9eee6] text-[#a66d4e]">
                    <ArrowDownRight size={17} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#303a30]">
                      Needs attention
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[#92968e]">
                      Vendor follow-up queue
                    </p>
                  </div>
                </div>
                <p className="mt-4 font-editorial text-[34px] text-[#28372c]">
                  {loading ? "—" : actionRequired}
                </p>
                <p className="mt-1 text-xs text-[#858a82]">
                  vendor{actionRequired === 1 ? "" : "s"} need additional
                  action.
                </p>
                <Link
                  href="/vendors"
                  className="mt-4 flex items-center justify-between border-t border-[#eff0eb] pt-4 text-xs font-semibold text-[#435b45] hover:text-[#22372b]"
                >
                  Review records <ArrowRight size={14} />
                </Link>
              </div>
            </aside>
          </div>

          <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-[#e9ebe4] pt-5 text-[10px] text-[#9a9d95] sm:flex-row">
            <span>VERIDIAN WORKSPACE · VENDOR OPERATIONS</span>
            <span>Designed for clarity. Built for confidence.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
