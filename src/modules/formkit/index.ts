import { addComponent, addPlugin, createResolver, defineNuxtModule, installModule } from "@nuxt/kit";

export default defineNuxtModule({
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    await installModule("@formkit/nuxt");
  },
});
