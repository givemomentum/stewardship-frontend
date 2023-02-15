import { AxiosResponse } from "axios";
import { onBeforeMount, ref } from "vue";
import { EmailBatch } from "~/apps/emails/interfaces";
import { useApi } from "~/composables/useApi";

const state = {
  list: ref<EmailBatch[]>([]),
  requestPromise: ref<Promise<AxiosResponse>>(null),
};

export function useEmailBatchStore() {
  const hooks = {
    api: useApi(),
  };

  onBeforeMount(async () => {
    if (!state.list.value.length && !state.requestPromise.value) {
      await load();
    }
  });

  async function load() {
    state.requestPromise.value = hooks.api.get(`/emails-new/batches/`);
    const res = await state.requestPromise.value;
    state.list.value = res.data;
    state.requestPromise.value = null;
  }

  async function markAsDownloaded(batch: EmailBatch) {
    await hooks.api.patch(`/emails-new/batches/${batch.pk}/`, {
      is_downloaded: true,
    });
    await load();
  }

  return {
    load: load,
    markAsDownloaded: markAsDownloaded,
    list: state.list,
    countUnread: () => state.list.value.filter(batch => batch.status !== "sent").length,
  };
}
