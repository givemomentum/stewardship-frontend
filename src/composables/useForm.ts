import { FormKitNode } from "@formkit/core";
import { captureException } from "@sentry/hub";
import { ref } from "vue";
import { strings } from "~/constants";
import { useApi } from "~/composables/useApi";

export type HttpMethod = "POST" | "PATCH";

export function useForm(args: {
  path: string | (() => string);
  getExtraData?: () => any;
  serializers?: { [key: string]: (value: any) => any };
  method?: HttpMethod | (() => HttpMethod);
  onSuccess?: (formData, responseData) => Promise<void>;
}) {
  const state = {
    isSuccess: ref(false),
  };

  const hooks = {
    api: useApi(),
  };

  async function submit(data: any, node: FormKitNode) {
    state.isSuccess.value = false;
    node.setErrors([]);
    try {
      let path = args.path as string;
      if (typeof args.path === "function") {
        path = args.path();
      }
      const extraData = args.getExtraData ? args.getExtraData() : {};
      const resArgs = { ...data, ...extraData };
      let method = args.method ?? "POST";
      if (typeof args.method === "function") {
        method = args.method();
      }

      let res;
      if (method === "PATCH") {
        res = await hooks.api.patch(path, resArgs);
      } else if (method === "POST") {
        res = await hooks.api.post(path, resArgs);
      }
      state.isSuccess.value = true;
      args.onSuccess(data, res.data);
    } catch (error) {
      console.log(error);
      captureException(error);
      node.setErrors([strings.error]);
    }
  }

  return {
    submit: submit,
    isSuccess: state.isSuccess,
  };
}
