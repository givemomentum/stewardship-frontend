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

  function openLoggingModal(rec: Recommendation) {
    state.loggingModalRec.value = rec;
    state.showLoggingModal.value = true;
  }

  function closeLoggingModal() {
    state.loggingModalRec.value = null;
    state.showLoggingModal.value = false;
  }

  async function onLoggingSuccess(_, responseData: any) {
    state.alertMessage.value = `Successfully logged action for ${state.loggingModalRec.value.donor?.name}`;
    state.loggingModalRec.value.action_state = responseData.action_state;
    state.loggingModalRec.value.action_type = responseData.action_type;
    state.loggingModalRec.value.action_description = responseData.action_description;
    state.loggingModalRec.value.state = responseData.state;

    setTimeout(() => {
      state.alertMessage.value = null;
    }, 5000);
    closeLoggingModal();
  }

  function getCommunicationPreferences(donor: CrmDonor) {
    if (donor.source == "blackbaud") {
      return ""; // Blackbaud doesn't have trustworthy communication preferences at the moment.
    }

    const preferences = [];
    if (donor.do_not_contact) {
      preferences.push("Do Not Contact");
    }
    if (donor.do_not_call) {
      preferences.push("Do Not Callt");
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
  <!-- TODO: Factor this out into a component -->
  <vue-final-modal
    v-model="state.showLoggingModal.value"
    name="Log to CRM"
    classes="modal-container"
    content-class="modal-content">
    <button class="modal__close" @click="closeLoggingModal">
      <CIcon
        name="md-close-outlined"
        font-size="2xl"
        fill="gray.600"
      />
    </button>
    <span class="modal__title">Log to CRM</span>
    <div class="modal__content">
      <LogAction v-if="state.loggingModalRec.value" :rec="state.loggingModalRec.value" :on-success="onLoggingSuccess" />
    </div>
  </vue-final-modal>

  <CAlert v-if="state.alertMessage.value" status="success" mt="2">
    <CAlertIcon />
    <CAlertDescription>{{ state.alertMessage.value }}</CAlertDescription>
  </CAlert>
  <TaskDetailRecList :task="props.task" title="Donors" columns-count="7">

    <template v-slot:table-headers>
      <chakra.th>Name</chakra.th>
      <chakra.th>Last gift</chakra.th>
      <chakra.th>Lifetime giving</chakra.th>
      <chakra.th>CRM Profile</chakra.th>
      <chakra.th v-if="props.task.rec_set.rule.is_show_log_button_on_task" />
    </template>

    <template v-slot:table-columns="slotProps">
      <chakra.td max-w="200px" v-if="slotProps.rec.donor.name">{{ slotProps.rec.donor.name }}</chakra.td>
      <chakra.td v-else>No name provided</chakra.td>
      <chakra.td>{{ format.dateMonth(slotProps.rec.donor.last_gift_date) }}</chakra.td>
      <chakra.td>{{ format.money(slotProps.rec.donor.donated_total) }}</chakra.td>
      <chakra.td>
        <CLink
          :href="slotProps.rec.donor.crm_url"
          h="0"
          is-external
          @click.stop=""
        >
          <CButton right-icon="external-link" variant="link">
            <!-- Workaround for Donor Perfect link issue: Show Donor Id, so she can copy it.-->
            {{
              slotProps.rec.donor.source == "donor_perfect" ? slotProps.rec.donor.source_id : "View"
            }}
          </CButton>
        </CLink>
      </chakra.td>
      <chakra.td v-if="props.task.rec_set.rule.is_show_log_button_on_task">
        <CButton
          v-if="slotProps.rec.action_state === 'none'"
          @click.stop="openLoggingModal(slotProps.rec)"
          size="sm"
          variant="outline"
        >
          Log
        </CButton>
        <VTooltip v-else>
          <CText>
            Logged to CRM
          </CText>
          <template v-slot:popper>
            <CText font-size="xs">
              <chakra.span text-transform="capitalize">{{ slotProps.rec.action_type }}</chakra.span>
              :
              {{ slotProps.rec.action_description }}
            </CText>
          </template>
        </VTooltip>
      </chakra.td>
    </template>

    <template v-slot:rec-unfolded="slotProps">
      <CFlex direction="row" justify="space-between">

        <CFlex direction="column" :gap="slotProps.isCurrentRec ? 3 : 0">
          <CFlex direction="column" v-if="slotProps.rec.donor.donation_biggest">
            <CFlex color="gray.400" font-size="xs">Giving summary</CFlex>
            <CFlex font-size="md">
              Giving since {{ format.dateMonth(slotProps.rec.donor.giving_since) }}. Largest gift was
              {{ format.money(slotProps.rec.donor.donation_biggest) }}, and most recent gift was
              {{ format.money(slotProps.rec.donor.last_gift_amount) }} in
              {{ format.dateMonth(slotProps.rec.donor.last_gift_date) }}
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
          <CFlex direction="column" v-if="slotProps.rec.donor.phone_number">
            <CFlex color="gray.400" font-size="xs">Phone</CFlex>
            <CFlex font-size="md">{{ slotProps.rec.donor?.phone_number }}</CFlex>
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
      </CFlex>
    </template>

  </TaskDetailRecList>
</template>

<style scoped>
  ::v-deep .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::v-deep .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
    width: 600px;
  }

  .modal__title {
    margin: 0 2rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .modal__close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
</style>
