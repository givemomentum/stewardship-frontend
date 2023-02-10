<script lang="ts" setup>
  import { Recommendation, Task } from "~/apps/tasks/interfaces";
  import { CrmDonor } from "~/apps/letters/interfaces";
  import { format } from "~/utils";
  import { ref } from "vue";
  import { useApi } from "~/composables/useApi";
  import { useRuntimeConfig } from "#app";

  const props = defineProps<{ task: Task }>();

  const hooks = {
    api: useApi(),
    config: useRuntimeConfig(),
  };

  const state = {
    loggingModalRec: ref(null as Recommendation | null),
    showLoggingModal: ref(false),
    alertMessage: ref<string | null>(null),
  };

  function getCommunicationPreferences(donor?: CrmDonor) {
    if (!donor) {
      return "";
    }

    if (donor.source == "blackbaud") {
      return ""; // Blackbaud doesn't have trustworthy communication preferences at the moment.
    }

    const preferences = [];
    if (donor.do_not_contact) {
      preferences.push("Do Not Contact");
    }
    if (donor.do_not_call) {
      preferences.push("Do Not Call");
    }
    if (donor.do_not_email) {
      preferences.push("Do Not Email");
    }
    if (donor.do_not_mail) {
      preferences.push("Do Not Mail");
    }

    return preferences.join(", ");
  }
</script>

<template>

  <CAlert v-if="state.alertMessage.value" status="success" mt="2">
    <CAlertIcon />
    <CAlertDescription>{{ state.alertMessage.value }}</CAlertDescription>
  </CAlert>

  <TaskDetailRecList :task="props.task" title="Donors" columns-count="7">

    <template v-slot:table-headers>
      <chakra.th>Name</chakra.th>
      <chakra.th>Last gift</chakra.th>
      <chakra.th>Lifetime giving</chakra.th>
      <chakra.th>Giving since</chakra.th>
      <chakra.th>CRM Profile</chakra.th>
    </template>

    <template v-slot:table-columns="slotProps">
      <chakra.td max-w="200px" v-if="slotProps.rec.donor?.name">{{ slotProps.rec.donor?.name }}</chakra.td>
      <chakra.td v-else>No name provided</chakra.td>
      <chakra.td>{{ format.dateMonth(slotProps.rec.donor?.last_gift_date) }}</chakra.td>
      <chakra.td>{{ format.money(slotProps.rec.donor?.donated_total) }}</chakra.td>
      <chakra.td>{{ format.dateMonth(slotProps.rec.donor?.giving_since) }}</chakra.td>
      <chakra.td>
        <CLink
          :href="slotProps.rec.donor?.crm_url"
          h="0"
          is-external
          @click.stop=""
          :opacity="slotProps.rec.state === 'dismissed' ? 0.5 : 1"
        >
          <CButton right-icon="external-link" variant="link">
            <!-- Workaround for Donor Perfect link issue: Show Donor Id, so she can copy it.-->
            {{
              slotProps.rec.donor?.source == "donor_perfect" ? slotProps.rec.donor?.source_id : "View"
            }}
          </CButton>
        </CLink>
      </chakra.td>

    </template>

  </TaskDetailRecList>

</template>
