import { useRuntimeConfig } from "#app";
import axios from "axios";
import { security } from "~/constants";

export function useApi() {
  const hooks = {
    config: useRuntimeConfig(),
  }

  const axiosInstance = axios.create({
    baseURL: `${hooks.config.public.serverHostname}/api`,
    withCredentials: true,
    xsrfHeaderName: security.xsrfHeader,
    xsrfCookieName: security.xsrfCookie,
    validateStatus: function (status) {
      return status < 400 || status === 403;
    }
  });

  async function $get(path: string, config?: any) {
    return axiosInstance.get(path, config);
  }

  async function $delete(path: string, config?: any) {
    return axiosInstance.delete(path, config);
  }

  async function $post(path: string, data?: any, config?: any) {
    return axiosInstance.post(path, data, config);
  }

  async function $put(path: string, data?: any, config?: any) {
    return axiosInstance.put(path, data, config);
  }

  async function $patch(path: string, data?: any, config?: any) {
    return axiosInstance.patch(path, data, config);
  }

  return {
    $get, $delete, $post, $put, $patch
  };
}
