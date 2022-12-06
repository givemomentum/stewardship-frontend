<script lang="ts" setup>
  import { Task } from "~/apps/tasks/interfaces";
  import { format } from "~/utils";
  import { urls } from "~/urls";
  import { EmailBatch } from "~/apps/emails/interfaces";

  const props = defineProps<{ task: Task }>();
  
  const hooks = {
    api: useApi(),
  };
  
  const state = {
    emailBatch: ref(null as EmailBatch | null),
  };
  
  onMounted(async () => {
    const res = await hooks.api.get(`/emails/batches/${props.task.email_batch}/`);
    state.emailBatch.value = res.data;
  });
</script>

<template>
  <TaskDetailRecList :task="props.task" title="Donors" columns-count="6">

    <template v-slot:top-buttons v-if="false">
      <NuxtLink :to="urls.emails.batches.edit(props.task.email_batch)">
        <CButton
          size="sm"
          left-icon="mail"
        >
          {{ state.emailBatch.value?.status === 'sent' ? 'Review sent emails' : 'Compose emails' }}
        </CButton>
      </NuxtLink>
    </template>

    <template v-slot:table-headers>
      <chakra.th>Name</chakra.th>
      <chakra.th>Last contacted</chakra.th>
      <chakra.th>First gift</chakra.th>
      <chakra.th>Lifetime</chakra.th>
      <chakra.th>Avg Gift</chakra.th>
    </template>

    <template v-slot:table-columns="slotProps">
      <chakra.td max-w="200px" v-if="slotProps.rec.donor.name">{{ slotProps.rec.donor.name }}</chakra.td>
      <chakra.td v-else>No name provided</chakra.td>

      <chakra.td>{{ format.dateMonth(slotProps.rec.donor.last_contact) }}</chakra.td>
      <chakra.td>{{ format.dateMonth(slotProps.rec.donor.giving_since) }}</chakra.td>
      <chakra.td>{{ format.money(slotProps.rec.donor.donated_total) }}</chakra.td>
      <chakra.td>{{ format.money(slotProps.rec.donor.donation_average) }}</chakra.td>
    </template>

    <template v-slot:rec-unfolded="slotProps">
      <CFlex direction="row" justify="space-between">

        <CFlex direction="column" :gap="slotProps.isCurrentRec ? 3 : 0">
          <CFlex direction="column" v-if="slotProps.rec.donor.donation_biggest">
            <CFlex color="gray.400" font-size="xs">Biggest gift</CFlex>
            <CFlex font-size="md">{{ format.money(slotProps.rec.donor.donation_biggest) }}</CFlex>
          </CFlex>
          <CFlex direction="column" v-if="slotProps.rec.donor.email">
            <CFlex color="gray.400" font-size="xs">Email</CFlex>
            <CFlex font-size="md">{{ slotProps.rec.donor?.email }}</CFlex>
          </CFlex>
          <CFlex direction="column" v-if="slotProps.rec.donor?.phone?.number">
            <CFlex color="gray.400" font-size="xs">Phone</CFlex>
            <CFlex font-size="md">{{ slotProps.rec.donor?.phone?.number }}</CFlex>
          </CFlex>
    
          <CFlex direction="column" v-if="slotProps.rec.donor.mailing_address?.one_line">
            <CFlex color="gray.400" font-size="xs">Address</CFlex>
            <CFlex
              v-if="slotProps.rec.donor.mailing_address?.one_line"
              font-size="md"
            >
              {{ slotProps.rec.donor.mailing_address?.one_line }}
            </CFlex>
          </CFlex>
    
          <CFlex v-if="slotProps.rec.gift?.notes" direction="column">
            <CFlex color="gray.400" font-size="xs">Notes</CFlex>
            <CFlex font-size="md">{{ slotProps.rec.gift.notes }}</CFlex>
          </CFlex>
        </CFlex>

        <CLink
          v-if="slotProps.rec.donor.crm_url"
          :href="slotProps.rec.donor.crm_url"
          h="0"
        >
          <CButton size="xs" right-icon="external-link" variant="outline">
            CRM Profile
          </CButton>
        </CLink>

      </CFlex>
    </template>

  </TaskDetailRecList>
</template>
