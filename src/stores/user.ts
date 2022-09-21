import { defineStore } from "pinia";
import Cookies from "js-cookie";

interface State {
  user: User | null;
  isLoading: boolean;
}

interface User {
  firstName: string,
  lastName: string,
  email: string,
}

export const useUserStore = defineStore("user", {
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
      const config = useRuntimeConfig();
      const res = await fetch(`${config.public.apiBase}/api/users/me`, {
        credentials: "include",

      });
      if (res.status == 200) {
        const payload = await res.json();
        this.user = {
          email: payload.email,
          firstName: payload.first_name,
          lastName: payload.last_name,
        }
      }
      this.isLoading = false;
    },
    async logout() {
      this.isLoading = true;

      // TODO(torin): Abstract fetch logic into a library.
      const config = useRuntimeConfig();
      const csrftoken = Cookies.get('csrftoken');
      await fetch(`${config.public.apiBase}/api/users/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {"X-CSRFToken": csrftoken},
      });
      this.user = null;
      this.isLoading = false;
    }
  },
});