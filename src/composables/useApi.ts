import { useRuntimeConfig } from "#app";
import Cookies from "js-cookie";
import axios from "axios";

export default function () {
  const hooks = {
    config: useRuntimeConfig(),
  }

  const instance = axios.create({
    baseURL: `${hooks.config.public.serverHostname}/api`,
    withCredentials: true,
    validateStatus: function (status) {
      return status < 400 || status === 403;
    }
  });

  function getCsrfToken(): string {
    // Get cookie on each request, in case it's changed since initialization.
    return Cookies.get('csrftoken');
  }

  async function $get(path: string) {
    return instance.get(path);
  }

  async function $delete(path: string) {
    return instance.delete(path, {
      headers: {"X-CSRFToken": getCsrfToken()},
    });
  }

  async function $post(path: string, data?: any) {
    return instance.post(path, data, {
      headers: {"X-CSRFToken": getCsrfToken()},
    });
  }

  async function $put(path: string, data?: any) {
    return instance.put(path, data, {
      headers: {"X-CSRFToken": getCsrfToken()},
    });
  }

  async function $patch(path: string, data?: any) {
    return instance.patch(path, data, {
      headers: {"X-CSRFToken": getCsrfToken()},
    });
  }

  return {$get, $delete, $post, $put, $patch};
}