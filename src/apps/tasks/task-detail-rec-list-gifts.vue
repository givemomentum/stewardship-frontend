<script lang="ts" setup>
  import { useRuntimeConfig } from "#app";
  import { ref } from "vue";
  import { Rec, Task } from "~/apps/tasks/interfaces";
  import { format, getCommunicationPreferences, getRecurringGiftDescription } from "~/utils";

  const props = defineProps<{ task: Task }>();

  const state = {
    donorCopyData: ref<string>(""),
    copyTooltip: ref("Copy full name & address"),
  };

  const hooks = {
    clipboard: useClipboard({ source: state.donorCopyData }),
    config: useRuntimeConfig(),
  };

  const comp = {
    isRecLetters: props.task.rec_set?.type === "letters",
    isRecGifts: props.task.rec_set?.type === "gifts",
  };

  // todo doesn't appear to be used anywhere, even on YSGN for whom it was built
  function copyDonorInfo(rec: Rec) {
    state.donorCopyData.value = rec.donor.letter_label;
    hooks.clipboard.copy();
    state.copyTooltip.value = "Copied";
    setTimeout(() => {
      state.copyTooltip.value = "Copy full name & address";
    }, 1500);
  }
</script>

<template>
  <TaskDetailRecList
    :task="props.task"
    :title="comp.isRecLetters ? 'Letters' : 'Gifts'"
    columns-count="8"
  >
    <template v-slot:table-headers>
      <chakra.th>Name</chakra.th>
      <chakra.th>Amount</chakra.th>
      <chakra.th>Gift Date</chakra.th>
      <chakra.th>Lifetime Gifts</chakra.th>
      <chakra.th>First gift</chakra.th>
      <chakra.th v-if="comp.isRecLetters" />
    </template>

    <template v-slot:table-columns="slotProps">
      <chakra.td max-w="200px" v-if="slotProps.rec.donor?.name">{{ slotProps.rec.donor?.name }}</chakra.td>
      <chakra.td v-else>No name provided</chakra.td>
      <chakra.td>{{ format.money(slotProps.rec.gift?.amount) }}</chakra.td>
      <chakra.td>{{ format.dateHumanShort(slotProps.rec?.gift?.date) }}</chakra.td>
      <chakra.td>{{ format.money(slotProps.rec.donor?.donated_total) }}</chakra.td>
      <chakra.td>{{ format.dateMonth(slotProps.rec.donor?.giving_since) }}</chakra.td>

      <chakra.td v-if="comp.isRecLetters">
          <div>
            <CIconButton
              @click.stop="() => copyDonorInfo(slotProps.rec)"
              size="sm"
              variant="link"
              icon="copy"
              ariaLabel="copy"
            />
          </div>
      </chakra.td>
    </template>

    <template v-slot:rec-unfolded="slotProps">
      <CFlex direction="column" v-if="slotProps.rec.donor?.donation_biggest">
        <CFlex color="gray.400" font-size="xs">Giving summary</CFlex>
        <CFlex font-size="md">
          Giving since {{ format.dateMonth(slotProps.rec.donor?.giving_since) }}. Largest gift was
          {{ format.money(slotProps.rec.donor?.donation_biggest) }}, and most recent gift was
          {{ format.money(slotProps.rec.donor?.last_gift_amount) }} in
          {{ format.dateMonth(slotProps.rec.donor?.last_gift_date) }}.
          {{ getRecurringGiftDescription(slotProps.rec.donor) }}.
        </CFlex>
      </CFlex>
      <CFlex direction="column" v-if="getCommunicationPreferences(slotProps.rec.donor)">
        <CFlex color="gray.400" font-size="xs">Communication Preferences</CFlex>
        <CFlex font-size="md">
          {{ getCommunicationPreferences(slotProps.rec.donor) }}
        </CFlex>
      </CFlex>
      <CFlex direction="column" v-if="slotProps.rec.donor?.email">
        <CFlex color="gray.400" font-size="xs">Email</CFlex>
        <CFlex font-size="md">{{ slotProps.rec.donor?.email }}</CFlex>
      </CFlex>
      <CFlex direction="column" v-if="slotProps.rec.donor?.phone_number">
        <CFlex color="gray.400" font-size="xs">Phone</CFlex>
        <CFlex font-size="md">{{ slotProps.rec.donor?.phone_number }}</CFlex>
      </CFlex>
      <CFlex direction="column">
        <CFlex color="gray.400" font-size="xs">Address</CFlex>
        <CFlex
          v-if="slotProps.rec.donor?.mailing_address?.one_line"
          font-size="md"
        >
          {{ slotProps.rec.donor?.mailing_address?.one_line }}
        </CFlex>
        <CFlex v-else font-size="md">−</CFlex>
      </CFlex>
      <CFlex direction="column" v-if="slotProps.rec.donor?.spouse_name">
        <CFlex color="gray.400" font-size="xs">Spouse</CFlex>
        <CFlex font-size="md">{{ slotProps.rec.donor.spouse_name }}</CFlex>
      </CFlex>
      <CFlex v-if="slotProps.rec.gift?.notes" direction="column">
        <CFlex color="gray.400" font-size="xs">Notes</CFlex>
        <CFlex font-size="md">{{ slotProps.rec.gift.notes }}</CFlex>
      </CFlex>
    </template>

  </TaskDetailRecList>
</template>
