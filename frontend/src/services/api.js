import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const publicEndpoints = [
  "/auth/login/",
  "/auth/register/",
  "/token/",
  "/token/refresh/",
];

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token && !publicEndpoints.includes(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically refresh expired access token
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !publicEndpoints.includes(originalRequest.url)
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/token/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          const newAccessToken = response.data.access;

          localStorage.setItem("access_token", newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");

          window.location.href = "/login";

          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;