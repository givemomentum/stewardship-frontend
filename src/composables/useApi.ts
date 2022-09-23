import { useRuntimeConfig } from "#app";
import Cookies from "js-cookie";
import axios from "axios";

export function useApi() {
  const hooks = {
    config: useRuntimeConfig(),
  }

  const axiosInstance = axios.create({
    baseURL: `${hooks.config.public.serverHostname}/api`,
    withCredentials: true,
    xsrfHeaderName: "X-CSRFToken",
    xsrfCookieName: "csrftoken",
    validateStatus: function (status) {
      return status < 400 || status === 403;
    }
  });

  async function ensureCSRFToken() {
    // Refresh CSRF token if necessary
    if (!Cookies.get('csrftoken')) {
      await $get("/auth/csrf");
    }
  }

  async function $get(path: string, config?: any) {
    return axiosInstance.get(path, config);
  }

  async function $delete(path: string, config?: any) {
    await ensureCSRFToken();
    return axiosInstance.delete(path, config);
  }

  async function $post(path: string, data?: any, config?: any) {
    await ensureCSRFToken();
    return axiosInstance.post(path, data, config);
  }

  async function $put(path: string, data?: any, config?: any) {
    await ensureCSRFToken();
    return axiosInstance.put(path, data, config);
  }

  async function $patch(path: string, data?: any, config?: any) {
    await ensureCSRFToken();
    return axiosInstance.patch(path, data, config);
  }

  return {
    $get, $delete, $post, $put, $patch
  };
}
