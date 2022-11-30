<script lang="ts" setup>
  import { useRuntimeConfig } from "#app";
  import { useClipboard } from "@chakra-ui/vue-next";
  import { ref } from "vue";
  import { Recommendation, Task } from "~/apps/tasks/interfaces";
  import { format } from "~/utils";

  const props = defineProps<{ task: Task }>();

  const state = {
    donorCopyData: ref<string>(""),
    copyTooltip: ref("Copy full name & address"),
  };

  const hooks = {
    clipboard: useClipboard({ source: state.donorCopyData }),
    config: useRuntimeConfig(),
  };

  function copyDonorInfo(rec: Recommendation) {
    state.donorCopyData.value = rec.donor.letter_label;
    hooks.clipboard.copy();
    state.copyTooltip.value = "Copied";
    setTimeout(() => {
      state.copyTooltip.value = "Copy full name & address";
    }, 1500);
  }
</script>

<template>
  <TaskDetailRecList :task="props.task" title="Gifts" columns-count="7">

    <template v-slot:top-buttons>
      <CFlex gap="7">
        <VTooltip>
          <div>
            <CLink
              :href="`${hooks.config.public.apiBase}/recs/recommendation-sets/${props.task.recommendation_set?.pk}/donor-csv`"
            >
              <CButton left-icon="download" variant="link">CSV</CButton>
            </CLink>
          </div>

          <template v-slot:popper>
            <CText font-size="xs">Download letter labels</CText>
          </template>
        </VTooltip>
      </CFlex>
    </template>

    <template v-slot:table-headers>
      <chakra.th>Name</chakra.th>
      <chakra.th>Amount</chakra.th>
      <chakra.th>Gift Date</chakra.th>
      <chakra.th>Lifetime Gifts</chakra.th>
      <chakra.th>First gift</chakra.th>
      <chakra.th />
    </template>

    <template v-slot:table-columns="slotProps">
      <chakra.td max-w="200px" v-if="slotProps.rec.donor.name">{{ slotProps.rec.donor.name }}</chakra.td>
      <chakra.td v-else>No name provided</chakra.td>
      <chakra.td>{{ format.money(slotProps.rec.gift.amount) }}</chakra.td>
      <chakra.td>{{ format.dateHuman(slotProps.rec.gift.date) }}</chakra.td>
      <chakra.td>{{ format.money(slotProps.rec.donor.donated_total) }}</chakra.td>
      <chakra.td>{{ format.dateMonth(slotProps.rec.donor.giving_since) }}</chakra.td>

      <chakra.td>
        <VTooltip placement="top" :key="state.copyTooltip.value">
          <div>
            <CIconButton
              @click.stop="() => copyDonorInfo(slotProps.rec)"
              size="sm"
              variant="link"
              icon="copy"
              ariaLabel="copy"
            />
          </div>

          <template v-slot:popper>
            <CText font-size="xs">{{state.copyTooltip.value}}</CText>
          </template>
        </VTooltip>
      </chakra.td>
    </template>

    <template v-slot:rec-unfolded="slotProps">
      <CFlex direction="column">
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

      <CFlex direction="column">
        <CFlex color="gray.400" font-size="xs">Address</CFlex>
        <CFlex
          v-if="slotProps.rec.donor.mailing_address?.one_line"
          font-size="md"
        >
          {{ slotProps.rec.donor.mailing_address?.one_line }}
        </CFlex>
        <CFlex v-else font-size="md">−</CFlex>
      </CFlex>

      <CFlex v-if="slotProps.rec.gift.notes" direction="column">
        <CFlex color="gray.400" font-size="xs">Notes</CFlex>
        <CFlex font-size="md">{{ slotProps.rec.gift.notes }}</CFlex>
      </CFlex>
    </template>

  </TaskDetailRecList>
</template>
