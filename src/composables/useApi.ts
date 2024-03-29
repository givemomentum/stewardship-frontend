import axios from "axios";

import { useRuntimeConfig } from "#app";
import { PrimaryKey } from "~/apps/auth/interfaces";
import { security, blackbaud } from "~/constants";

export function useApi() {
  const hooks = {
    config: useRuntimeConfig(),
  };

  const axiosInstance = axios.create({
    baseURL: `${hooks.config.public.apiBase}`,
    withCredentials: true,
    xsrfHeaderName: security.xsrfHeader,
    xsrfCookieName: security.xsrfCookie,
    validateStatus: function (status: number) {
      return status < 400 || status === 403;
    },
  });

  axiosInstance.interceptors.request.use(function (config) {
    const blackbaudUserId = localStorage.getItem(blackbaud.authStorageKey);
    if (blackbaudUserId) {
      config.headers['Authorization'] = `${blackbaud.authHeader} ${blackbaudUserId}`;
    }
    return config;
  });

  async function get(path: string, config?: any) {
    return axiosInstance.get(path, config);
  }

  async function getJson<Json = any>(path: string, config?: any): Promise<Json> {
    return axiosInstance.get(path, config).then(res => res.data);
  }

  async function del(path: string, config?: any) {
    return axiosInstance.delete(path, config);
  }

  async function post(path: string, data?: any, config?: any) {
    return axiosInstance.post(path, data, config);
  }

  async function put(path: string, data?: any, config?: any) {
    return axiosInstance.put(path, data, config);
  }

  async function patch(path: string, data?: any, config?: any) {
    return axiosInstance.patch(path, data, config);
  }

  function url(path: string) {
    return `${hooks.config.public.apiBase}${path}`;
  }

  return {
    get: get, post: post, delete: del, put: put, patch: patch, url: url, getJson: getJson,
  };
}
