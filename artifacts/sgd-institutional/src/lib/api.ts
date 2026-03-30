const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? "Unbekannter Fehler");
  }

  return res.json() as Promise<T>;
}

export interface UserPayload {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  company?: string | null;
  role: string;
  verified: boolean;
  createdAt: string;
}

export interface Transaction {
  id: number;
  userId: number;
  type: string;
  amountGrams: string;
  priceEurPerGram?: string | null;
  totalEur?: string | null;
  status: string;
  note?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserPayload;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface NewTransaction {
  type: "buy" | "sell" | "deposit" | "withdrawal" | "repo" | "hypo";
  amountGrams: string;
  priceEurPerGram?: string;
  note?: string;
}

export const api = {
  auth: {
    register: (data: RegisterData) =>
      request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data: LoginData) =>
      request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    me: () => request<{ user: UserPayload }>("/auth/me"),
  },
  transactions: {
    list: () => request<{ transactions: Transaction[] }>("/transactions"),
    create: (data: NewTransaction) =>
      request<{ transaction: Transaction }>("/transactions", { method: "POST", body: JSON.stringify(data) }),
  },
};
