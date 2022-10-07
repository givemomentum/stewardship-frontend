import { FormKitNode } from "@formkit/core";
import { ref } from "vue";
import { strings } from "~/constants";
import { useApi } from "~/composables/useApi";

export default function (args: {
  path: string;
  dataExtra?: any;
  serializers?: { [key: string]: (value: any) => any };
  method?: "POST" | "PATCH";
}) {
  const state = {
    isSuccess: ref(false),
  };

  const hooks = {
    api: useApi(),
  };

  async function submit(data: any, node: FormKitNode) {
    state.isSuccess.value = false;
    try {
      const res = await hooks.api.$post(args.path, { ...data, ...args.dataExtra });
      if (res.data.is_success === true) {
        state.isSuccess.value = true;
        node.reset();
      } else {
        node.setErrors([strings.error]);
      }
    } catch (error) {
      // todo sentry
      node.setErrors([strings.error]);
    }
  }

  return {
    submit: submit,
    isSuccess: state.isSuccess,
  };
}
