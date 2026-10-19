"use client";

import {
  CheckCircle2,
  Clock3,
  ListTodo,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: string | Date | null;
};

type TaskListProps = {
  tasks: Task[];
  loading?: boolean;
  onStatusChange?: (taskId: string, status: string) => void;
};

function formatDate(date?: string | Date | null) {
  if (!date) return "No due date";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "No due date";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusStyle(status: string) {
  switch (status.toUpperCase().replaceAll(" ", "_")) {
    case "COMPLETED":
    case "DONE":
      return "bg-emerald-50 text-emerald-700";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700";
    case "CANCELLED":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

function priorityStyle(priority: string) {
  switch (priority.toUpperCase()) {
    case "HIGH":
    case "URGENT":
      return "bg-rose-50 text-rose-700";
    case "MEDIUM":
      return "bg-orange-50 text-orange-700";
    default:
      return "bg-[#f0f2ec] text-[#66705f]";
  }
}

export default function TaskList({
  tasks,
  loading = false,
  onStatusChange,
}: TaskListProps) {
  const completed = tasks.filter((task) =>
    ["COMPLETED", "DONE"].includes(task.status.toUpperCase()),
  ).length;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e8eae3] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf2e9] text-[#22372b]">
            <ListTodo size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#26352a]">
              Tasks & Reviews
            </h2>
            <p className="mt-1 text-xs text-[#858a82]">
              Follow-ups and outstanding actions
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#f4f5f0] px-3 py-1.5 text-xs font-medium text-[#52604e]">
          {completed} of {tasks.length} completed
        </span>
      </div>

      {loading ? (
        <div className="space-y-3 p-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-xl bg-[#f4f5f0]"
            />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4f5f0] text-[#687563]">
            <CheckCircle2 size={23} />
          </div>
          <p className="text-sm font-semibold text-[#26352a]">
            All clear for now
          </p>
          <p className="mt-1 text-xs text-[#858a82]">
            New review tasks will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#edf0e9]">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="px-5 py-4 transition-colors hover:bg-[#fcfcfa] sm:px-6"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 text-[#7b8875]">
                  {task.status.toUpperCase() === "COMPLETED" ||
                  task.status.toUpperCase() === "DONE" ? (
                    <CheckCircle2 size={19} />
                  ) : task.priority.toUpperCase() === "HIGH" ||
                    task.priority.toUpperCase() === "URGENT" ? (
                    <AlertCircle size={19} />
                  ) : (
                    <Clock3 size={19} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-[#26352a]">
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="mt-1 text-xs leading-5 text-[#858a82]">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle(task.status)}`}
                    >
                      {task.status.replaceAll("_", " ")}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${priorityStyle(task.priority)}`}
                    >
                      {task.priority} priority
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] text-[#858a82]">
                      <CalendarDays size={13} />
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>

                {onStatusChange &&
                  !["COMPLETED", "DONE"].includes(
                    task.status.toUpperCase(),
                  ) && (
                    <button
                      type="button"
                      onClick={() => onStatusChange(task.id, "COMPLETED")}
                      className="shrink-0 rounded-lg border border-[#dfe5da] px-3 py-2 text-xs font-medium text-[#22372b] transition hover:bg-[#edf2e9]"
                    >
                      Complete
                    </button>
                  )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
