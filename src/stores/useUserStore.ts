import { defineStore } from "pinia";
import useApi from "~/composables/useApi";

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

      const res = await api.$get("/users/me/");
      if (res.status === 200) {
        this.user = {
          email: res.data.email,
          firstName: res.data.first_name,
          lastName: res.data.last_name,
        }
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