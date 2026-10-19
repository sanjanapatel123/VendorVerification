"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Upload,
  ShieldCheck,
  Mail,
  History,
  ListTodo,
  LoaderCircle,
  RefreshCw,
  CheckCircle2,
  FileText,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { api } from "../../../lib/api";

type AnyRecord = Record<string, any>;

const statusOptions = [
  "DRAFT",
  "UNDER_REVIEW",
  "ACTION_REQUIRED",
  "APPROVED",
  "REJECTED",
];

export default function VendorDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [vendor, setVendor] = useState<AnyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [documentType, setDocumentType] = useState("GST_CERTIFICATE");
  const [file, setFile] = useState<File | null>(null);
  const [taskTitle, setTaskTitle] = useState("Request missing vendor document");
  const [taskPriority, setTaskPriority] = useState("HIGH");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getVendor(id);
      setVendor(result.vendor);
    } catch (error) {
      toast.error("Could not load vendor", {
        description: error instanceof Error ? error.message : "API error",
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(
    key: string,
    action: () => Promise<any>,
    successMessage: string,
  ) {
    setBusy(key);
    try {
      const result = await action();
      toast.success(successMessage);
      await load();
      return result;
    } catch (error) {
      toast.error("Action failed", {
        description: error instanceof Error ? error.message : "Please retry",
      });
      return null;
    } finally {
      setBusy("");
    }
  }

  async function upload() {
    if (!file) {
      toast.error("Choose a document first");
      return;
    }

    const result = await runAction(
      "upload",
      () => api.uploadDocument(id, documentType, file),
      "Document uploaded and processed",
    );

    if (result) setFile(null);
  }

  async function createTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await runAction(
      "task",
      () =>
        api.createTask(id, {
          title: taskTitle,
          priority: taskPriority,
          dueDate: taskDueDate
            ? new Date(taskDueDate).toISOString()
            : undefined,
        }),
      "Task created successfully",
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="lg:pl-[248px]">
          <Navbar onMenuClick={() => setMobileOpen(true)} />
          <div className="space-y-4 p-8">
            <div className="skeleton h-8 w-64" />
            <div className="skeleton h-32 w-full rounded-2xl" />
            <div className="skeleton h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#fafaf8] lg:pl-[248px]">
        <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <div className="p-10 text-center">
          <AlertCircle className="mx-auto text-[#b56d4d]" size={28} />
          <p className="mt-3 font-semibold">Vendor not found</p>
          <Link
            href="/vendors"
            className="mt-4 inline-block text-sm text-[#304b3a] underline"
          >
            Back to vendors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
<Sidebar
  open={mobileOpen}
  onClose={() => setMobileOpen(false)}
/>


      <div className="lg:pl-[248px]">
      <Navbar onMenuClick={() => setMobileOpen(true)} />

        <main className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8">
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#7c8379] hover:text-[#22372b]"
          >
            <ArrowLeft size={15} /> Back to vendors
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-5 rounded-2xl border border-[#e9ebe4] bg-white p-5 sm:flex-row sm:items-center sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eaf0e5] text-[#304b3a]">
                <Building2 size={25} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#8a9284]">
                  Vendor profile
                </p>
                <h1 className="mt-1 font-editorial text-3xl text-[#24352a]">
                  {vendor.companyName}
                </h1>
                <p className="mt-1 text-sm text-[#858a82]">
                  {vendor.contactPerson} · {vendor.email}
                </p>
                <p className="mt-2 text-[11px] text-[#9a9d95]">
                  ID: {vendor.id}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={vendor.status}
                disabled={busy === "status"}
                onChange={(event) =>
                  void runAction(
                    "status",
                    () => api.updateVendorStatus(id, event.target.value),
                    "Vendor status updated",
                  )
                }
                className="h-10 rounded-xl border border-[#e4e7df] bg-white px-3 text-xs font-semibold text-[#3e4b3d] outline-none focus:border-[#82947b]"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
              <button
                onClick={() => void load()}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4e7df] text-[#667066] hover:bg-[#f5f6f2]"
                aria-label="Refresh vendor"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <section className="rounded-2xl border border-[#e9ebe4] bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf1e8] text-[#304b3a]">
                  <Upload size={18} />
                </div>
                <div>
                  <h2 className="font-editorial text-2xl text-[#26372b]">
                    Documents
                  </h2>
                  <p className="text-xs text-[#92968e]">
                    Upload a certificate for AI extraction
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block text-xs font-semibold text-[#4d574b]">
                  Document type
                  <select
                    value={documentType}
                    onChange={(event) => setDocumentType(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-[#e4e7df] bg-[#fcfcfa] px-3 text-sm outline-none focus:border-[#82947b]"
                  >
                    <option value="REGISTRATION_CERTIFICATE">
                      Registration certificate
                    </option>
                    <option value="GST_CERTIFICATE">GST certificate</option>
                    <option value="BANK_DOCUMENT">Bank document</option>
                    <option value="OTHER">Other</option>
                  </select>
                </label>

                <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#cdd7c7] bg-[#fafbf7] px-4 py-5 text-center hover:bg-[#f4f7f0]">
                  <FileText size={22} className="text-[#637a5d]" />
                  <span className="mt-2 text-xs font-semibold text-[#394b38]">
                    {file ? file.name : "Choose a document"}
                  </span>
                  <span className="mt-1 text-[10px] text-[#969a91]">
                    PDF, JPG, PNG or WEBP · Maximum 10 MB
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(event) =>
                      setFile(event.target.files?.[0] ?? null)
                    }
                  />
                </label>

                <button
                  onClick={() => void upload()}
                  disabled={busy === "upload" || !file}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#22372b] text-sm font-semibold text-white hover:bg-[#304b3a] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy === "upload" ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {busy === "upload"
                    ? "Uploading & extracting..."
                    : "Upload and extract"}
                </button>
              </div>

              <div className="mt-6 border-t border-[#eff0eb] pt-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[1.3px] text-[#969a91]">
                  Uploaded files
                </p>
                {vendor.documents?.length ? (
                  <div className="space-y-2">
                    {vendor.documents.map((doc: AnyRecord) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 rounded-xl bg-[#fafbf8] p-3"
                      >
                        <FileText size={17} className="text-[#71866a]" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#3e493c]">
                            {doc.fileName}
                          </p>
                          <p className="mt-1 text-[10px] text-[#92968e]">
                            {doc.type.replaceAll("_", " ")}
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold text-[#667d60]">
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#969a91]">
                    No documents uploaded yet.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e9ebe4] bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf1e8] text-[#304b3a]">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h2 className="font-editorial text-2xl text-[#26372b]">
                    Verification
                  </h2>
                  <p className="text-xs text-[#92968e]">
                    Compare company details with available records
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  void runAction(
                    "verify",
                    () => api.verifyCompany(id),
                    "Company verification completed",
                  )
                }
                disabled={busy === "verify"}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#22372b] text-sm font-semibold text-white hover:bg-[#304b3a] disabled:opacity-60"
              >
                {busy === "verify" ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <ShieldCheck size={16} />
                )}
                {busy === "verify" ? "Verifying..." : "Verify company"}
              </button>

              <div className="mt-5 space-y-3">
                {vendor.verifications?.length ? (
                  vendor.verifications.map((verification: AnyRecord) => (
                    <div
                      key={verification.id}
                      className="rounded-xl border border-[#e9ebe4] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold text-[#3e493c]">
                          {verification.provider}
                        </p>
                        <span className="rounded-full bg-[#f1f2ee] px-2.5 py-1 text-[10px] font-bold text-[#687063]">
                          {verification.status.replaceAll("_", " ")}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] text-[#858a82]">
                        {verification.searchedTerm}
                      </p>
                      {verification.errorMessage && (
                        <p className="mt-2 text-[11px] text-[#a16a4a]">
                          {verification.errorMessage}
                        </p>
                      )}
                      {Array.isArray(verification.result) && (
                        <div className="mt-3 space-y-2">
                          {verification.result.map(
                            (item: AnyRecord, index: number) => (
                              <div
                                key={`${item.field}-${index}`}
                                className="flex items-center justify-between gap-2 text-[11px]"
                              >
                                <span className="text-[#737a70]">
                                  {item.field}
                                </span>
                                <span
                                  className={
                                    item.result === "MATCH"
                                      ? "text-[#477c4b]"
                                      : "text-[#a16a4a]"
                                  }
                                >
                                  {item.result}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-[#fafbf7] p-5 text-center">
                    <ShieldCheck className="mx-auto text-[#8ca184]" size={24} />
                    <p className="mt-2 text-xs text-[#858a82]">
                      No verification runs yet.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e9ebe4] bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7eee6] text-[#a66d4e]">
                  <ListTodo size={18} />
                </div>
                <div>
                  <h2 className="font-editorial text-2xl text-[#26372b]">
                    Tasks & follow-ups
                  </h2>
                  <p className="text-xs text-[#92968e]">
                    Create a task for the review team
                  </p>
                </div>
              </div>

              <form onSubmit={createTask} className="mt-5 space-y-3">
                <input
                  required
                  value={taskTitle}
                  onChange={(event) => setTaskTitle(event.target.value)}
                  placeholder="Task title"
                  className="h-11 w-full rounded-xl border border-[#e4e7df] bg-[#fcfcfa] px-3 text-sm outline-none focus:border-[#82947b]"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={taskPriority}
                    onChange={(event) => setTaskPriority(event.target.value)}
                    className="h-11 rounded-xl border border-[#e4e7df] bg-[#fcfcfa] px-3 text-xs outline-none"
                  >
                    <option value="LOW">Low priority</option>
                    <option value="MEDIUM">Medium priority</option>
                    <option value="HIGH">High priority</option>
                  </select>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(event) => setTaskDueDate(event.target.value)}
                    className="h-11 rounded-xl border border-[#e4e7df] bg-[#fcfcfa] px-3 text-xs outline-none"
                  />
                </div>
                <button
                  disabled={busy === "task"}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#dce3d7] bg-[#f5f7f2] text-sm font-semibold text-[#344b37] hover:bg-[#eaf0e5] disabled:opacity-60"
                >
                  {busy === "task" ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <ListTodo size={16} />
                  )}
                  Create task
                </button>
              </form>

              <div className="mt-5 space-y-2">
                {vendor.tasks?.length ? (
                  vendor.tasks.map((task: AnyRecord) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 rounded-xl border border-[#edf0e9] p-3"
                    >
                      <CheckCircle2
                        size={17}
                        className={
                          task.status === "COMPLETED"
                            ? "text-[#55855a]"
                            : "text-[#b2b7ac]"
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-[#3e493c]">
                          {task.title}
                        </p>
                        <p className="mt-1 text-[10px] text-[#92968e]">
                          {task.priority} · {task.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#969a91]">
                    No tasks created yet.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e9ebe4] bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf1e8] text-[#304b3a]">
                  <History size={18} />
                </div>
                <div>
                  <h2 className="font-editorial text-2xl text-[#26372b]">
                    Version history
                  </h2>
                  <p className="text-xs text-[#92968e]">
                    Previous vendor record changes
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {vendor.versions?.length ? (
                  vendor.versions.map((version: AnyRecord) => (
                    <div
                      key={version.id}
                      className="rounded-xl border border-[#e9ebe4] p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-[#3e493c]">
                          Version {version.version}
                        </p>
                        <span className="text-[10px] text-[#92968e]">
                          {new Date(version.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-[#fafbf8] p-3 text-[10px] leading-5 text-[#687063]">
                        {JSON.stringify(version.changes, null, 2)}
                      </pre>
                      <button
                        onClick={() =>
                          void runAction(
                            `restore-${version.version}`,
                            () => api.restoreVersion(id, version.version),
                            `Restored version ${version.version}`,
                          )
                        }
                        disabled={busy === `restore-${version.version}`}
                        className="mt-3 rounded-lg border border-[#e1e6dc] px-3 py-2 text-[11px] font-semibold text-[#435b45] hover:bg-[#f3f6ef] disabled:opacity-50"
                      >
                        Restore this version
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#969a91]">
                    No version history available yet.
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  void runAction(
                    "email",
                    () => api.sendMissingDocumentsEmail(id),
                    "Missing-document email sent",
                  )
                }
                disabled={busy === "email"}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#e4e7df] text-sm font-semibold text-[#435345] hover:bg-[#f5f6f2] disabled:opacity-60"
              >
                {busy === "email" ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Mail size={16} />
                )}
                Send missing-documents email
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
