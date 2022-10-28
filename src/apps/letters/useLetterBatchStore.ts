import { onBeforeMount, ref } from "vue";
import { useApi } from "~/composables/useApi";
import { LetterBatch } from "~/apps/letters/interfaces";

const state = {
  list: ref<LetterBatch[]>([]),
};

export function useLetterBatchStore() {
  const hooks = {
    api: useApi(),
  };

  onBeforeMount(async () => {
    if (!state.list.value.length) {
      await load();
    }
  });

  async function load() {
    const res = await hooks.api.$get(`/letters/batches/`);
    state.list.value = res.data;
  }

  async function markAsDownloaded(batch: LetterBatch) {
    await hooks.api.$patch(`/letters/batches/${batch.pk}/`, {
      is_downloaded: true,
    });
    await load();
  }

  return {
    load: load,
    markAsDownloaded: markAsDownloaded,
    list: state.list,
    countUnread: () => state.list.value.filter((batch) => !batch.is_downloaded).length,
  };
}
