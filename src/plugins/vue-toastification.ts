import { defineNuxtPlugin } from "#app";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Toast as any, {
    transition: "Vue-Toastification__fade",
  });
});
