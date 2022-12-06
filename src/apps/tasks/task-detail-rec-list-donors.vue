<script lang="ts" setup>
  import { Task } from "~/apps/tasks/interfaces";
  import { format } from "~/utils";
  import { urls } from "~/urls";

  const props = defineProps<{ task: Task }>();
</script>

<template>
  <TaskDetailRecList :task="props.task" title="Donors" columns-count="6">

    <template v-slot:top-buttons v-if="false">
      <NuxtLink :to="urls.emails.batches.edit(props.task.email_batch)">
        <CButton
          size="sm"
          left-icon="mail"
        >
          Compose emails
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

        <CFlex
          direction="column"
          v-if="slotProps.rec.donor.crm_url"
        >
          <CLink
            :href="slotProps.rec.donor.crm_url"
            is-external
            variant="none"
          >
            <CButton size="xs" right-icon="external-link" variant="outline" key="2">
              CRM Profile
            </CButton>
          </CLink>
        </CFlex>

      </CFlex>
    </template>

  </TaskDetailRecList>
</template>
