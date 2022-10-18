import { onMounted, ref } from "vue";
import { useApi } from "~/composables/useApi";
import { LetterBatch } from "~/interfaces";

const state = {
  batchList: ref<LetterBatch[]>([]),
};

export function useLetterBatchStore() {
  const hooks = {
    api: useApi(),
  };

  onMounted(async () => {
    if (!state.batchList.value.length) {
      await load();
    }
  });

  async function load() {
    const res = await hooks.api.$get(`/ysgn/letter-batches/`);
    state.batchList.value = res.data;
  }

  async function markAsDownloaded(batch: LetterBatch) {
    await hooks.api.$patch(`/ysgn/letter-batches/${batch.pk}/`, {
      is_downloaded: true,
    });
    await load();
  }

  return {
    load: load,
    markAsDownloaded: markAsDownloaded,
    batchList: state.batchList,
    countUnread: () => state.batchList.value.filter((batch) => !batch.is_downloaded).length,
  };
}
