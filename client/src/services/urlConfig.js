const configuredApiUrl = String(
  import.meta.env.VITE_API_URL || ""
).trim().replace(/\/+$/, "");

export const API_URL =
  configuredApiUrl ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

export const API_ORIGIN = API_URL
  .replace(/\/api\/?$/i, "")
  .replace(/\/+$/, "");
