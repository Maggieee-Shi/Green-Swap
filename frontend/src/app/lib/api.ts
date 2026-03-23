const BASE = (import.meta.env.VITE_API_URL as string) ?? '';

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("jwt_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}/api${path}`, { ...options, headers });

  if (res.status === 401) {
    // Signal AuthContext to clear stale credentials
    window.dispatchEvent(new Event("auth:unauthorized"));
    throw new Error("Please sign in to continue");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function apiUpload(file: File): Promise<string> {
  const token = localStorage.getItem("jwt_token");
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE}/api/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (res.status === 401) {
    window.dispatchEvent(new Event("auth:unauthorized"));
    throw new Error("Please sign in to continue");
  }
  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.url as string;
}
