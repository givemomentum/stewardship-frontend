import { defineNuxtPlugin } from "#app";
import VueMultiselect from 'vue-multiselect'
import "vue-multiselect/dist/vue-multiselect.css";

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component("VueMultiselect", VueMultiselect);
});
