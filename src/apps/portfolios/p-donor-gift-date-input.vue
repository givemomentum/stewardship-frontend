a<script lang="ts" setup>
  import { format } from "~/utils";
  import { CrmAction, CrmGift, CrmDonor } from "~/apps/letters/interfaces";

  const props = defineProps<{
    donor?: CrmDonor;
  }>();

  const emit = defineEmits<{
    donorUpdated: (donor: CrmDonor) => void;
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
  };

  const state = {
    expectedGiftDate: ref(""),
    isGiftDateEditMode: ref(false),
    isGiftDateSaving: ref(false),
  };

  async function updateGiftDate() {
    state.isGiftDateSaving.value = true;
    const res = await hooks.api.patch(`/crms/donors/${props.donor.pk}/`, {
      expected_gift_date: state.expectedGiftDate.value,
      is_expected_gift_date_user_set: true,
    });
    state.isGiftDateSaving.value = false;
    hooks.notify.send("Next gift date updated");
    emit("donorUpdated", res.data);
    state.isGiftDateEditMode.value = false;
  }
</script>

<template>
  <CTr>
    <CTd fontWeight="bold">
      Next gift
    </CTd>

    <CTd>
      <CFlex align="center" gap="4">
        <span v-if="!state.isGiftDateEditMode.value">
          {{ format.date(props.donor?.expected_gift_date) }}
        </span>

        <CInput
          v-else
          type="date"
          size="xs"
          w="fit-content"
          v-model="state.expectedGiftDate.value"
        />
        <CButton
          v-if="!state.isGiftDateEditMode.value"
          @click="state.isGiftDateEditMode.value = !state.isGiftDateEditMode.value"
          size="xs"
          left-icon="edit"
          variant="outline"
        >
          Edit
        </CButton>
        <CButton
          v-else
          @click="updateGiftDate()"
          size="xs"
          variant="solid"
          :is-loading="state.isGiftDateSaving.value"
        >
          Save
        </CButton>
      </CFlex>
    </CTd>
  </CTr>
</template>
