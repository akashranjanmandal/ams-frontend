import axios from "axios";

function readAuth() {
  const raw = localStorage.getItem("ams-auth");
  if (!raw) return null;

  const parsed = JSON.parse(raw);
  return parsed.state ?? parsed;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((cfg) => {
  if (typeof window !== "undefined") {
    try {
      const auth = readAuth();
      if (auth) {
        const { access_token } = auth;
        if (access_token) cfg.headers.Authorization = `Bearer ${access_token}`;
      }
    } catch {}
  }
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      const raw = localStorage.getItem("ams-auth");
      if (raw) {
        try {
          const existing = JSON.parse(raw);
          const auth = existing.state ?? existing;
          const { refresh_token } = auth;
          const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refresh_token });
          const newData = res.data;
          const updated = existing.state
            ? { ...existing, state: { ...auth, ...newData } }
            : { ...existing, ...newData };
          localStorage.setItem("ams-auth", JSON.stringify(updated));
          err.config.headers.Authorization = `Bearer ${newData.access_token}`;
          return api.request(err.config);
        } catch {
          localStorage.removeItem("ams-auth");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(err);
  }
);
