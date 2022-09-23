import { useRuntimeConfig } from "#app";
import Cookies from "js-cookie";
import axios from "axios";

const XSRF_HEADER = "x-csrftoken";
const XSRF_COOKIE = "csrftoken";

export function useApi() {
  const hooks = {
    config: useRuntimeConfig(),
  }

  const axiosInstance = axios.create({
    baseURL: `${hooks.config.public.serverHostname}/api`,
    withCredentials: true,
    xsrfHeaderName: XSRF_HEADER,
    xsrfCookieName: XSRF_COOKIE,
    validateStatus: function (status) {
      return status < 400 || status === 403;
    }
  });

  async function ensureCSRFToken() {
    // Refresh CSRF token if necessary
    if (!Cookies.get(XSRF_COOKIE)) {
      const res = await $get("/auth/csrf");
      const token = res.headers[XSRF_HEADER];
      console.log(res);
      console.log("Loaded token", token);
      Cookies.set(XSRF_COOKIE, token);
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
