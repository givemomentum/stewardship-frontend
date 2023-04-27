import { defineNuxtPlugin } from "#app";
import InstantSearch from "vue-instantsearch/vue3/es";

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(InstantSearch as any);
});
