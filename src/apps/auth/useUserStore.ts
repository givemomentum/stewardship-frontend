import { defineStore } from "pinia";
import { useApi } from "~/composables/useApi";
import { Org, User } from "~/apps/auth/interfaces";
import Cookies from "js-cookie";
import { security } from "~/constants";
import { useRuntimeConfig } from "#app";

interface State {
  user: User | null;
  isLoading: boolean;
}

export const useUserStore = defineStore("user", {
  state: (): State => ({
    user: null,
    isLoading: true,
  }),
  getters: {
    isLoggedIn(state: State): boolean {
      return !!state.user;
    },
    isOrgAdmin(state: State): boolean {
      return !!(state.user?.membership?.is_org_admin);
    },
    org(state: State): Org | null {
      return state.user?.membership?.org || null;
    },
    isOrgHor(state: State): boolean {
      return state.user?.membership?.org.name === "House of Ruth";
    },
    isOrgYsgn(state: State): boolean {
      return state.user?.membership?.org.name === "YSGN";
    },
  },
  actions: {
    async loadUser() {
      this.isLoading = true;
      const api = useApi();

      const userRes = await api.get("/users/me/");
      if (userRes.status === 200) {
        this.user = userRes.data;

        // Fetch CSRF token after logging user in.
        const csrfRes = await api.get("/auth/csrf");
        const token = csrfRes.headers[security.xsrfHeader];
        Cookies.set(security.xsrfCookie, token);
      }

      this.isLoading = false;
    },
    async logout() {
      this.isLoading = true;
      const api = useApi();
      await api.post("/users/logout/");
      this.user = null;
      this.isLoading = false;

      const config = useRuntimeConfig();
      // todo redirect to nylas
      window.location.href = `${config.public.backendUrl}/accounts/login`;
    },
  },
});
