<script lang="ts" setup>
  import { Recommendation, Task } from "~/apps/tasks/interfaces";
  import { format } from "~/utils";
  import { urls } from "~/urls";
  import { EmailBatch } from "~/apps/emails/interfaces";
  import { ref, onMounted } from "vue";
  import { useApi } from "~/composables/useApi";

  const props = defineProps<{ task: Task }>();

  const hooks = {
    api: useApi(),
  };

  const state = {
    emailBatch: ref(null as EmailBatch | null),
    loggingModalRec: ref(null as Recommendation | null),
    showLoggingModal: ref(false),
    alertMessage: ref<string | null>(null),
  };

  onMounted(async () => {
    if (props.task.email_batch) {
      const res = await hooks.api.get(`/emails/batches/${props.task.email_batch}/`);
      state.emailBatch.value = res.data;
    }
  });

  function openLoggingModal(rec: Recommendation) {
    state.loggingModalRec.value = rec;
    state.showLoggingModal.value = true;
  }

  function closeLoggingModal() {
    state.loggingModalRec.value = null;
    state.showLoggingModal.value = false;
  }

  async function onLoggingSuccess(data: any) {
    state.alertMessage.value = `Successfully logged action for ${state.loggingModalRec.value.donor?.name}`;
    state.loggingModalRec.value.action_state = data.action_state;
    state.loggingModalRec.value.action_type = data.action_type;
    state.loggingModalRec.value.action_description = data.action_description;
    state.loggingModalRec.value.is_completed = true;
    state.loggingModalRec.value.state = "completed";

    setTimeout(() => {
      state.alertMessage.value = null;
    }, 5000);
    closeLoggingModal();
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
  <TaskDetailRecList :task="props.task" title="Donors" columns-count="6">

    <template v-slot:top-buttons v-if="props.task.email_batch" v-if="false">
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
      <chakra.th>Last gift</chakra.th>
      <chakra.th>Lifetime giving</chakra.th>
      <chakra.th>CRM Profile</chakra.th>
      <chakra.th />
    </template>

    <template v-slot:table-columns="slotProps">
      <chakra.td max-w="200px" v-if="slotProps.rec.donor.name">{{ slotProps.rec.donor.name }}</chakra.td>
      <chakra.td v-else>No name provided</chakra.td>
      <chakra.td>{{ format.dateMonth(slotProps.rec.donor.last_gift_date) }}</chakra.td>
      <chakra.td>{{ format.money(slotProps.rec.donor.donated_total) }}</chakra.td>
      <chakra.td>
        <CLink
          v-if="slotProps.rec.donor.crm_url"
          :href="slotProps.rec.donor.crm_url"
          h="0"
          is-external
        >
          <CButton right-icon="external-link" variant="link">
            {{ slotProps.rec.donor.source_id }}
          </CButton>
        </CLink>
        <chakra.span v-else>
          {{ slotProps.rec.donor.source_id }}
        </chakra.span>
      </chakra.td>
      <chakra.td>
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
          <CFlex direction="column" v-if="slotProps.rec.donor.email">
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
