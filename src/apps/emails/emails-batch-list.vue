<script setup lang="ts">
  import { EmailBatch } from "~/apps/emails/interfaces";
  import { urls } from "~/urls";

  const hooks = {
    api: useApi(),
  };
  
  const state = {
    batchList: ref([] as EmailBatch[]),
  };
  
  onMounted(async () => {
    const res = await hooks.api.get("/emails/batches/");
    state.batchList.value = res.data;
  });
  
</script>


<template>
  <div>
    <CHeading>Batches</CHeading>
    <ul>
      <li v-for="batch in state.batchList.value" :key="batch.id">
        <NuxtLink :to="urls.emails.batches.edit(batch.pk)">
          Batch #{{ batch.pk }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
