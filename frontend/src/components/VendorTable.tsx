import Link from "next/link";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import type { Vendor } from "../lib/api";

const statusStyles: Record<string, string> = {
  APPROVED: "bg-[#e8f3e6] text-[#35633a]",
  UNDER_REVIEW: "bg-[#edf0fa] text-[#53669b]",
  ACTION_REQUIRED: "bg-[#fff0e7] text-[#a35d34]",
  REJECTED: "bg-[#fae9e7] text-[#a54e45]",
  DRAFT: "bg-[#f0f1ed] text-[#73796f]",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function VendorTable({ vendors }: { vendors: Vendor[] }) {
  if (!vendors.length) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="font-editorial text-2xl">
          Your vendor workspace starts here
        </p>
        <p className="mt-2 text-sm text-[#858a82]">
          Create your first vendor record to start verification.
        </p>
        <Link
          href="/vendors"
          className="mt-5 inline-flex rounded-xl bg-[#22372b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#304b3a]"
        >
          Open vendors
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-left">
        <thead>
          <tr className="border-y border-[#eff0eb] bg-[#fbfcf9]">
            {["Vendor", "Contact", "Status", "Documents", "Created", ""].map(
              (label) => (
                <th
                  key={label}
                  className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[1.1px] text-[#93988f]"
                >
                  {label}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0f1ec]">
          {vendors.map((vendor) => (
            <tr key={vendor.id} className="group hover:bg-[#fbfcf9]">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf1e8] text-xs font-bold text-[#3c553e]">
                    {initials(vendor.companyName)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#28352b]">
                      {vendor.companyName}
                    </p>
                    <p className="mt-1 text-[11px] text-[#969a91]">
                      {vendor.id.slice(0, 12)}…
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <p className="text-xs font-medium text-[#454c43]">
                  {vendor.contactPerson}
                </p>
                <p className="mt-1 text-[11px] text-[#969a91]">
                  {vendor.email}
                </p>
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${statusStyles[vendor.status] ?? statusStyles.DRAFT}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {vendor.status.replaceAll("_", " ")}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className="text-xs text-[#626a60]">
                  {vendor.documents?.length ?? 0} uploaded
                </span>
              </td>
              <td className="px-5 py-4 text-xs text-[#858a82]">
                {new Date(vendor.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-5 py-4">
                <Link
                  href={`/vendors/${vendor.id}`}
                  title="View vendor"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#858a82] hover:bg-[#edf1e8] hover:text-[#22372b]"
                >
                  <ArrowUpRight size={16} />
                </Link>
                <button
                  title="More options"
                  onClick={() =>
                    window.location.assign(`/vendors/${vendor.id}`)
                  }
                  className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#858a82] hover:bg-[#edf1e8] hover:text-[#22372b]"
                >
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
