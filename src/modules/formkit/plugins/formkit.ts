import { plugin, defaultConfig, createInput } from "@formkit/vue";
import FTextarea from "~/modules/formkit/components/f-textarea.vue";

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(
    plugin,
    defaultConfig({
      inputs: {
        "ckeditor": createInput(FTextarea, {

        }),
      },
    })
  );
});
