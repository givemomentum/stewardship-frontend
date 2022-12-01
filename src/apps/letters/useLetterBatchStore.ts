import { AxiosResponse } from "axios";
import { onBeforeMount, ref } from "vue";
import { useApi } from "~/composables/useApi";
import { LetterBatch } from "~/apps/letters/interfaces";

const state = {
  list: ref<LetterBatch[]>([]),
  requestPromise: ref<Promise<AxiosResponse>>(null),
};

export function useLetterBatchStore() {
  const hooks = {
    api: useApi(),
  };

  onBeforeMount(async () => {
    if (!state.list.value.length && !state.requestPromise.value) {
      await load();
    }
  });

  async function load() {
    state.requestPromise.value = hooks.api.get(`/letters/batches/`);
    const res = await state.requestPromise.value;
    state.list.value = res.data;
    state.requestPromise.value = null;
  }

  async function markAsDownloaded(batch: LetterBatch) {
    await hooks.api.patch(`/letters/batches/${batch.pk}/`, {
      is_downloaded: true,
    });
    await load();
  }

  return {
    load: load,
    markAsDownloaded: markAsDownloaded,
    list: state.list,
    countUnread: () => state.list.value.filter(batch => !batch.is_downloaded).length,
  };
}
