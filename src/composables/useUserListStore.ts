import { Md5 } from "ts-md5";
import { onMounted, ref } from "vue";
import { useApi } from "~/composables/useApi";
import { User } from "~/interfaces";

const state = {
  userList: ref<User[]>([]),
};

export function useUserListStore() {
  const hooks = {
    api: useApi(),
  };

  onMounted(async () => {
    if (!state.userList.value.length) {
      await loadUserList();
    }
  });

  async function loadUserList() {
    const res = await hooks.api.$get(`/users/`);
    const usersRaw: User[] = res.data;
    const usersUsable = usersRaw.filter((user) => user.first_name && user.last_name);
    const usersWithAvatars = usersUsable.map((user) =>
      // if (!user.avatar) {
      //   user.avatar = getGravatarURL(user.email);
      // }
       user);
    state.userList.value = usersWithAvatars;
  }

  function getGravatarURL(email: string): string {
    const emailNormalized = String(email).trim().toLowerCase();
    return `https://www.gravatar.com/avatar/${Md5.hashStr(emailNormalized)}`;
  }

  return {
    load: loadUserList,
    userList: state.userList,
  };
}
