<script setup lang="ts">
  import { ref } from "vue";
  import { EmailBatch, EmailTemplate } from "~/apps/emails/interfaces";
  import { LetterTemplate } from "~/apps/letters/interfaces";
  import { urls } from "~/urls";
  import { format } from "~/utils";
  import { Mails } from "lucide-vue-next";

  const hooks = {
    api: useApi(),
  };

  const state = {
    batchList: ref([] as EmailBatch[]),
    templateList: ref([] as EmailTemplate[]),
    templateOpen: ref<LetterTemplate | null>(null),
  };

  onMounted(async () => {
    const resBatches = await hooks.api.get("/emails/batches/");
    state.batchList.value = resBatches.data;

    const resTemplates = await hooks.api.get("/emails/templates/");
    state.templateList.value = resTemplates.data;
    
    const resBatchesWithRecSetes = await hooks.api.get("/emails/batches/?expand=rec_set");
    state.batchList.value = resBatchesWithRecSetes.data;
  });

  function getStatusStyle(batch: EmailBatch) {
    switch (batch.status) {
    case "prepopulated":
      return { color: "gray.800", bg: "gray.100" };
    case "pending":
      return { color: "gray.800", bg: "gray.100" };
    case "sent":
      return { color: "teal.800", bg: "teal.100" };
    }
  }

  function isBatchSent(batch: EmailBatch) {
    return batch.status === "sent";
  }

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
          <chakra.th>Status</chakra.th>
          <chakra.th data-is-numeric="true">Emails</chakra.th>
          <chakra.th data-is-numeric="true">Open rate</chakra.th>
          <chakra.th data-is-numeric="true">Bounce rate</chakra.th>
          <chakra.th v-if="state.batchList.value?.find(batch => batch.rec_set?.rule?.emails_to_donors_cc)">CC</chakra.th>
          <chakra.th>Template</chakra.th>
          <chakra.th />
        </chakra.thead>

        <chakra.tbody>
          <chakra.tr
            v-for="batch in state.batchList.value"
            :key="batch.pk"
          >
            <chakra.td>{{ batch.title }}</chakra.td>

            <chakra.td>
              {{ format.dateHumanShort(batch.created_at) }}
            </chakra.td>

            <chakra.td data-is-numeric="true">
              <CBox
                py="2px"
                px="2"
                w="fit-content"
                border-radius="lg"
                text-transform="capitalize"
                font-size="xs"
                :bg="getStatusStyle(batch).bg"
                :color="getStatusStyle(batch).color"
              >
                {{ batch.status }}
              </CBox>

            </chakra.td>

            <chakra.td data-is-numeric="true">
              {{ batch.emails_count }}
            </chakra.td>

            <chakra.td data-is-numeric="true">
              {{ isBatchSent(batch) ? format.percentage((batch.open_count / batch.emails_count) * 100) : '' }}
            </chakra.td>

            <chakra.td data-is-numeric="true">
              {{ isBatchSent(batch) ? format.percentage((batch.bounce_count / batch.emails_count) * 100) : '' }}
            </chakra.td>

            <chakra.td v-if="state.batchList.value?.find(batchItem => batchItem.rec_set?.rule?.emails_to_donors_cc)">
              {{ batch.rec_set?.rule?.emails_to_donors_cc }}
            </chakra.td>

            <chakra.td>
              {{ batch.template.title }}
            </chakra.td>

            <chakra.td>
              <NuxtLink :to="urls.emails.batches.edit(batch.pk)">
                <CButton size="sm" variant="link" gap="2" pt="2px">
                  <Mails size="16" />
                  <chakra.span v-if="batch.emails_unviewed_count">Review ({{
                    batch.emails_unviewed_count
                  }})
                  </chakra.span>
                  <chakra.span v-else>Review</chakra.span>
                </CButton>
              </NuxtLink>
            </chakra.td>

          </chakra.tr>
        </chakra.tbody>
      </ChakraTable>

      <!--      <CLink :to="urls.letters.archive" variant="none">-->
      <!--        <CButton size="sm" variant="outline" mt="4">Archive</CButton>-->
      <!--      </CLink>-->
    </CFlex>

    <CFlex direction="column" gap="2" max-w="sm">
      <CHeading variant="page-header" font-size="2xl">Templates</CHeading>

      <ChakraTable size="sm">
        <chakra.thead>
          <chakra.th>Name</chakra.th>
          <chakra.th />
        </chakra.thead>

        <chakra.tbody>
          <chakra.tr
            v-for="template in state.templateList.value"
            :key="template.pk"
          >
            <chakra.td>{{ template.title }}</chakra.td>

            <chakra.td w="fit-content">
              <CButton
                @click="state.templateOpen.value = template"
                size="sm"
                variant="link"
                gap="px"
                left-icon="edit"
              >
                Edit
              </CButton>
            </chakra.td>

          </chakra.tr>
        </chakra.tbody>
      </ChakraTable>
    </CFlex>

    <ChakraDrawer v-model="state.templateOpen.value" w="calc(850px + var(--spaces-6) * 2)">
      <EmailsBatchTemplateEdit :template="state.templateOpen.value" />
    </ChakraDrawer>

  </CFlex>
</template>

<style lang="scss">
  html, body {
    background: white;
    height: 100%;
  }
</style>
