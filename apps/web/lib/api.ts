const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

type RequestOptions = RequestInit & {
  token?: string | null;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", headers.get("Content-Type") || "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new Error("Unable to reach the API. Start the backend and try again.");
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(data.message || "Request failed");
    }

    const responseText = await response.text().catch(() => "");
    const message = responseText.trim() || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export { API_URL };
