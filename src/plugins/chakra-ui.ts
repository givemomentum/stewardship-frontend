import * as ChakraComponents from "@chakra-ui/vue-next";

export default defineNuxtPlugin(nuxtApp => {

  // @chakra-ui/nuxt-next module is supposed to do that, but it's either broken or not implemented
  for (const moduleName in ChakraComponents) {
    const isComponent = moduleName.startsWith("C");
    if (isComponent) {
      // @ts-ignore
      nuxtApp.vueApp.component(moduleName, ChakraComponents[moduleName]);
    }
  }
});
