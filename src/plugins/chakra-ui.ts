import * as ChakraComponents from "@chakra-ui/vue-next";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(nuxtApp => {

  // @chakra-ui/nuxt-next module is supposed to do that, but it's either broken or not implemented
  console.log(ChakraComponents);
  for (const moduleName in ChakraComponents) {
    const isComponent = moduleName.startsWith("C");
    if (isComponent) {
      // @ts-ignore
      console.log("Registering component", moduleName, ChakraComponents[moduleName])
      nuxtApp.vueApp.component(moduleName, ChakraComponents[moduleName]);
    }
  }
});
