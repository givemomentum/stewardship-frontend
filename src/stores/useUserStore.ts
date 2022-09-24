import { defineStore } from "pinia";
import { useApi } from "~/composables/useApi";
import Cookies from "js-cookie";
import { security } from "~/constants";

interface State {
  user: UseUserStore | null;
  isLoading: boolean;
}

interface UseUserStore {
  firstName: string,
  lastName: string,
  email: string,
}

export default defineStore("user", {
  state: (): State => {
    return {
      user: null,
      isLoading: true,
    }
  },
  getters: {
    isLoggedIn(state: State): boolean {
      return !!state.user;
    }
  },
  actions: {
    async loadUser() {
      this.isLoading = true;
      const api = useApi();

      const userRes = await api.$get("/users/me/");
      if (userRes.status === 200) {
        this.user = {
          email: userRes.data.email,
          firstName: userRes.data.first_name,
          lastName: userRes.data.last_name,
        }

        // Fetch CSRF token after logging user in.
        const csrfRes = await api.$get("/auth/csrf");
        const token = csrfRes.headers[security.xsrfHeader];
        Cookies.set(security.xsrfCookie, token);
      }

      this.isLoading = false;
    },
    async logout() {
      this.isLoading = true;
      const api = useApi();
      await api.$post("/users/logout/")
      this.user = null;
      this.isLoading = false;
    }
  },
});
