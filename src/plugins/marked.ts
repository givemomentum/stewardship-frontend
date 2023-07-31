import { defineNuxtPlugin } from "#app";
import { marked } from "marked";

export default defineNuxtPlugin(nuxtApp => {
  marked.use({
    mangle: false,
    headerIds: false,
  });
});
