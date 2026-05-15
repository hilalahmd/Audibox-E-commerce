import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || "http://127.0.0.1:5000/api",
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

authApi.interceptors.request.use(attachToken);

const isAuthFlow = (url) => {
  if (!url) return false;
  return /\/auth\/(login|register|refresh)(\?|$)/.test(url) || /\/admin\/(login|refresh)(\?|$)/.test(url);
};

const isAdminRequest = (url) => url?.includes("/admin");

const retryRequestWithRefresh = async (error) => {
  const originalRequest = error.config;
  if (originalRequest._retry) return Promise.reject(error);
  originalRequest._retry = true;

  const refreshUrl = isAdminRequest(originalRequest.url) ? "/admin/refresh" : "/auth/refresh";

  try {
    const refreshResponse = await authApi.post(refreshUrl);
    const newToken = refreshResponse.data?.token;
    if (!newToken) throw new Error("Refresh failed");

    sessionStorage.setItem("token", newToken);
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return authApi(originalRequest);
  } catch (refreshError) {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    window.location.href = isAdminRequest(originalRequest.url) ? "/admin/login" : "/login";
    return Promise.reject(refreshError);
  }
};

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url;
    if (error.response?.status === 401 && !isAuthFlow(url)) {
      return retryRequestWithRefresh(error);
    }
    return Promise.reject(error);
  }
);

export default authApi;  // execute statement
