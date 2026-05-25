import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((cfg) => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("ams-auth");
    if (raw) {
      try {
        const { access_token } = JSON.parse(raw);
        if (access_token) cfg.headers.Authorization = `Bearer ${access_token}`;
      } catch {}
    }
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
          const { refresh_token } = JSON.parse(raw);
          const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refresh_token });
          const newData = res.data;
          const existing = JSON.parse(raw);
          localStorage.setItem("ams-auth", JSON.stringify({ ...existing, ...newData }));
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
