const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export type Vendor = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string | null;
  status:
    | "DRAFT"
    | "UNDER_REVIEW"
    | "ACTION_REQUIRED"
    | "APPROVED"
    | "REJECTED";
  createdAt: string;
  documents?: { id: string; type: string; status: string }[];
  tasks?: { id: string; status: string; priority: string }[];
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isForm = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "API request failed");
  }

  return data as T;
}

export const api = {
  getVendors: () =>
    request<{ success: boolean; count: number; vendors: Vendor[] }>("/vendors"),

  getVendor: (id: string) => request<any>(`/vendors/${id}`),

  createVendor: (data: Record<string, unknown>) =>
    request<any>("/vendors", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateVendor: (id: string, data: Record<string, unknown>) =>
    request<any>(`/vendors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  updateVendorStatus: (id: string, status: string) =>
    request<any>(`/vendors/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  uploadDocument: (id: string, type: string, file: File) => {
    const form = new FormData();
    form.append("type", type);
    form.append("document", file);

    return request<any>(`/vendors/${id}/documents`, {
      method: "POST",
      body: form,
    });
  },

  verifyCompany: (id: string) =>
    request<any>(`/vendors/${id}/verify-company`, { method: "POST" }),

  getTasks: (id: string) => request<any>(`/vendors/${id}/tasks`),

  createTask: (id: string, data: Record<string, unknown>) =>
    request<any>(`/vendors/${id}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTask: (taskId: string, data: Record<string, unknown>) =>
    request<any>(`/vendors/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getVersions: (id: string) => request<any>(`/vendors/${id}/versions`),

  restoreVersion: (id: string, version: number) =>
    request<any>(`/vendors/${id}/versions/${version}/restore`, {
      method: "POST",
    }),

  sendMissingDocumentsEmail: (id: string) =>
    request<any>(`/vendors/${id}/missing-documents-email`, {
      method: "POST",
    }),
};
