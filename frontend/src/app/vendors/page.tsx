"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  X,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import VendorTable from "../../components/VendorTable";
import { api, type Vendor } from "../../lib/api";

const initialForm = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  registrationNumber: "",
  gstNumber: "",
  bankAccountNumber: "",
  ifscCode: "",
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [mobileOpen, setMobileOpen] = useState(false);

  const loadVendors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getVendors();
      setVendors(data.vendors);
    } catch (error) {
      toast.error("Could not load vendors", {
        description: error instanceof Error ? error.message : "API unavailable",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVendors();
  }, [loadVendors]);

  const filtered = vendors.filter((vendor) =>
    `${vendor.companyName} ${vendor.contactPerson} ${vendor.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      await api.createVendor({
        ...form,
        phone: form.phone || undefined,
        address: form.address || undefined,
        registrationNumber: form.registrationNumber || undefined,
        gstNumber: form.gstNumber || undefined,
        bankAccountNumber: form.bankAccountNumber || undefined,
        ifscCode: form.ifscCode || undefined,
      });

      toast.success("Vendor created successfully");
      setForm(initialForm);
      setShowForm(false);
      await loadVendors();
    } catch (error) {
      toast.error("Unable to create vendor", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setSaving(false);
    }
  }

  const fields = [
    { key: "companyName", label: "Company name", required: true },
    { key: "contactPerson", label: "Contact person", required: true },
    { key: "email", label: "Business email", required: true, type: "email" },
    { key: "phone", label: "Phone number" },
    { key: "address", label: "Business address" },
    { key: "registrationNumber", label: "Registration number" },
    { key: "gstNumber", label: "GST / Tax number" },
    { key: "bankAccountNumber", label: "Bank account number" },
    { key: "ifscCode", label: "IFSC code" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="min-h-screen lg:pl-[248px]">
        <Navbar onMenuClick={() => setMobileOpen(true)} />

        <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[1.7px] text-[#77866f]">
                Workspace / Directory
              </p>
              <h1 className="font-editorial text-4xl tracking-tight text-[#24352a]">
                Vendors
              </h1>
              <p className="mt-2 text-sm text-[#858a82]">
                Manage company records and track verification progress.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#22372b] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#304b3a]"
            >
              <Plus size={17} /> Add vendor
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-[#e9ebe4] bg-white">
            <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6">
              <div>
                <h2 className="font-editorial text-2xl text-[#26372b]">
                  All vendors
                </h2>
                <p className="mt-1 text-xs text-[#92968e]">
                  {loading
                    ? "Loading records…"
                    : `${filtered.length} vendor records`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-[#e9ebe4] bg-[#fafbf8] px-3 sm:w-[260px]">
                  <Search size={16} className="text-[#92968e]" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search vendors..."
                    className="w-full bg-transparent text-xs outline-none placeholder:text-[#a0a49c]"
                  />
                </label>
                <button
                  onClick={() => void loadVendors()}
                  disabled={loading}
                  aria-label="Refresh vendors"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9ebe4] text-[#667066] hover:bg-[#f5f6f2]"
                >
                  <RefreshCw
                    size={15}
                    className={loading ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="skeleton h-10 w-10" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-3 w-40" />
                      <div className="skeleton h-3 w-28" />
                    </div>
                    <div className="skeleton h-6 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <VendorTable vendors={filtered} />
            )}
          </div>
        </main>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18231c]/45 p-3 backdrop-blur-sm sm:p-6">
          <div className="animate-fade-up flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#e9ebe4] px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf0e5] text-[#304b3a]">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="font-editorial text-2xl text-[#26372b]">
                    New vendor
                  </h2>
                  <p className="mt-1 text-xs text-[#858a82]">
                    Add business details to begin verification.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                aria-label="Close form"
                className="rounded-lg p-2 text-[#858a82] hover:bg-[#f1f3ee]"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreate}
              className="overflow-y-auto px-5 py-6 sm:px-7"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((field) => (
                  <label key={field.key} className="block">
                    <span className="mb-2 block text-xs font-semibold text-[#4d574b]">
                      {field.label}
                      {"required" in field && field.required && (
                        <span className="ml-1 text-[#b56d4d]">*</span>
                      )}
                    </span>
                    <input
                      required={"required" in field && field.required}
                      type={"type" in field ? field.type : "text"}
                      value={form[field.key]}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className="h-11 w-full rounded-xl border border-[#e4e7df] bg-[#fcfcfa] px-3.5 text-sm outline-none transition placeholder:text-[#b0b4ab] focus:border-[#82947b] focus:bg-white focus:ring-4 focus:ring-[#22372b]/[0.05]"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-7 flex flex-col-reverse justify-end gap-2 border-t border-[#eff0eb] pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="h-11 rounded-xl border border-[#e4e7df] px-5 text-sm font-semibold text-[#596256] hover:bg-[#f7f8f4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#22372b] px-6 text-sm font-semibold text-white hover:bg-[#304b3a] disabled:opacity-60"
                >
                  {saving && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}
                  {saving ? "Creating vendor..." : "Create vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
