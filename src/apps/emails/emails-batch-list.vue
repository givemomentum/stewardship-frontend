<script setup lang="ts">
  import { EmailBatch } from "~/apps/emails/interfaces";
  import { urls } from "~/urls";
  import { format } from "~/utils";
  import { Mails } from "lucide-vue-next";

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
  <CFlex direction="column" gap="10" pb="8">
    <CFlex
      direction="column"
      gap="2"
      align="flex-start"
      w="fit-content"
    >
      <CFlex justify="space-between" align="center" w="100%" pr="6">
        <CHeading variant="page-header" font-size="2xl">Emails</CHeading>
      </CFlex>

      <ChakraTable size="sm">
        <chakra.thead>
          <chakra.th>Task</chakra.th>
          <chakra.th>Created at</chakra.th>
          <chakra.th>Satus</chakra.th>
          <chakra.th data-is-numeric="true">Emails</chakra.th>
          <chakra.th data-is-numeric="true">Open rate</chakra.th>
          <chakra.th data-is-numeric="true">Bounce rate</chakra.th>
          <chakra.th>Template</chakra.th>
          <chakra.th />
        </chakra.thead>

        <chakra.tbody>
          <chakra.tr
            v-for="batch in state.batchList.value"
            :key="batch.pk"
          >
            <chakra.td>{{ batch.task.title }}</chakra.td>

            <chakra.td>
              {{ format.dateHumanShort(batch.created_at) }}
            </chakra.td>

            <chakra.td data-is-numeric="true">
              {{ batch.status }}
            </chakra.td>

            <chakra.td data-is-numeric="true">
              {{ batch.emails_count }}
            </chakra.td>

            <chakra.td data-is-numeric="true">
              {{ format.percentage(batch.open_count / batch.emails_count) }}
            </chakra.td>

            <chakra.td data-is-numeric="true">
              {{ format.percentage(batch.bounce_count / batch.emails_count) }}
            </chakra.td>

            <chakra.td>
              {{ batch.template.name }}
            </chakra.td>

            <chakra.td>
              <NuxtLink :to="urls.emails.batches.edit(batch.pk)">
                <CButton size="sm" variant="link" gap="2">
                  <Mails size="16" />
                  <chakra.span v-if="batch.emails_unviewed_count">Review ({{ batch.emails_unviewed_count }})</chakra.span>
                  <chakra.span v-else>Review</chakra.span>
                </CButton>
              </NuxtLink>
            </chakra.td>

          </chakra.tr>
        </chakra.tbody>
      </ChakraTable>

      <CLink :to="urls.letters.archive" variant="none">
        <CButton size="sm" variant="outline" mt="4">Archive</CButton>
      </CLink>
    </CFlex>
  </CFlex>
</template>

<style lang="scss">
  html, body {
    background: white;
    height: 100%;
  }
</style>
