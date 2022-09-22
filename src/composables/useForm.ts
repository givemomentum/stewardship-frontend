import { FormKitNode } from "@formkit/core";
import axios from "axios";
import { ref } from "vue";
import { strings } from "~/constants";

export default function (args: {
  url: string;
  dataExtra?: any;
  serializers?: { [key: string]: (value: any) => any };
  method?: "POST" | "PATCH";
}) {
  const state = {
    isSuccess: ref(false),
  };

  async function submit(data: any, node: FormKitNode) {
    state.isSuccess.value = false;
    try {
      const res = await axios.post(args.url, {...data, ...args.dataExtra});
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
