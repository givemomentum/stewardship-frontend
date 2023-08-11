import { RouteLocationNormalized } from "vue-router";
import { useUserStore } from "~/apps/auth/useUserStore";
import { urls } from "~/urls";

export default defineNuxtRouteMiddleware(
  async (to: RouteLocationNormalized) => {
    const hooks = {
      userStore: useUserStore(),
    };

    const publicRoutes = ["/privacy-policy", "/terms-of-use", "/login"];
    if (publicRoutes.includes(to.fullPath)) {
      return;
    }

    // Skip auth redirect for Blackbaud add-ins.
    if (Object.values(urls.blackbaud).includes(to.fullPath)) {
      return;
    }

    await hooks.userStore.loadUser();

    if (!hooks.userStore.isLoggedIn && to.fullPath !== "/login") {
      return navigateTo("/login");
    }
  }
);
