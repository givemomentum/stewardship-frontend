import { onMounted, ref } from "vue";
import { useApi } from "~/composables/useApi";
import { Letter } from "~/apps/letters/interfaces";

const state = {
  batchList: ref<Letter[]>([]),
};

export function useLetterListStore() {
  const hooks = {
    api: useApi(),
  };

  onMounted(async () => {
    if (!state.batchList.value.length) {
      await load();
    }
  });

  async function load() {
    const res = await hooks.api.$get(`/letters/`);
    state.batchList.value = res.data;
  }

  async function markAsDownloaded(letter: Letter) {
    await hooks.api.$patch(`/letters/${letter.pk}/`, {
      is_downloaded: true,
    });
    await load();
  }

  return {
    load: load,
    markAsDownloaded: markAsDownloaded,
    batchList: state.batchList,
  };
}
