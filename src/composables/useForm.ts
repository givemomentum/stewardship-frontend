import { FormKitNode } from "@formkit/core";
import { captureException } from "@sentry/hub";
import { ref } from "vue";
import { strings } from "~/constants";
import { useApi } from "~/composables/useApi";

export function useForm(args: {
  path: string | (() => string);
  dataExtra?: any;
  serializers?: { [key: string]: (value: any) => any };
  method?: "POST" | "PATCH";
  onSuccess?: () => Promise<void>;
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
      const resArgs = { ...data, ...args.dataExtra };
      const method = args.method ?? "POST";
      if (method === "PATCH") {
        await hooks.api.$patch(path, resArgs);
      } else if (method === "POST") {
        await hooks.api.$post(path, resArgs);
      }
      state.isSuccess.value = true;
      await args.onSuccess();
    } catch (error) {
      captureException(error);
      node.setErrors([strings.error]);
    }
  }

  return {
    submit: submit,
    isSuccess: state.isSuccess,
  };
}
