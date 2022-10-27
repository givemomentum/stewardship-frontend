import { defineNuxtPlugin } from "#app";
import FloatingVue, { VTooltip } from "floating-vue";
import "floating-vue/dist/style.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(FloatingVue);
});
