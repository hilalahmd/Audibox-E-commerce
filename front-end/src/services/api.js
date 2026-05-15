import axios from "axios";

const api = axios.create({

  baseURL: import.meta.env.VITE_DATA_API_URL || "http://127.0.0.1:5000/api",

  timeout: 5000,

  withCredentials: true,
});

const attachToken = (config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const isAuthFlow = (url) => {
  if (!url) return false;
  return /\/auth\/(login|register|refresh)(\?|$)/.test(url) || /\/admin\/(login|refresh)(\?|$)/.test(url);
};

const isAdminSession = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    return user?.role === "admin";
  } catch {
    return false;
  }
};

const isAdminRequest = (url) => url?.includes("/admin") || isAdminSession();

api.interceptors.request.use(attachToken);

const retryRequestWithRefresh = async (error) => {
  const originalRequest = error.config;
  if (originalRequest._retry) return Promise.reject(error);
  originalRequest._retry = true;

  const refreshUrl = isAdminRequest(originalRequest.url) ? "/admin/refresh" : "/auth/refresh";

  try {
    const refreshResponse = await api.post(refreshUrl);
    const newToken = refreshResponse.data?.token;
    if (!newToken) throw new Error('Refresh failed');

    sessionStorage.setItem('token', newToken);
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return api(originalRequest);
  } catch (refreshError) {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    if (isAdminRequest(originalRequest.url)) {
      window.location.href = "/admin/login";
    } else {
      window.location.href = "/login";
    }
    return Promise.reject(refreshError);
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url;
    if (error.response?.status === 401 && !isAuthFlow(url)) {
      return retryRequestWithRefresh(error);
    }
    return Promise.reject(error);
  }
);

export default api;  // execute statement
