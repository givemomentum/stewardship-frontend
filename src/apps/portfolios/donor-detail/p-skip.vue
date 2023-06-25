<script lang="ts" setup>
import { useNotify } from "~/composables/useNotify";
import { urls } from "~/urls";
import { format } from "~/utils";

const props = defineProps<{
  recId: string | number;
}>();

const hooks = {
  api: useApi(),
  notify: useNotify(),
  layout: useLayoutControl(),
};

const state = {
  isSubmitting: ref(false),
  rec: ref(null),
};

onBeforeMount(async () => {
  hooks.layout.activateLeanMode();
  const res = await hooks.api.get(`/portfolios/recs/${props.recId}/`);
  if (res.data) {
    state.rec.value = res.data;
  }
});

async function skipRec(status: string) {
  state.isSubmitting.value = true;
  let skipReason = null;
  if (status === "skipped_as_unqualified") {
    skipReason = prompt("Please enter the reason for unqualifying this donor");
    if (!skipReason) {
      state.isSubmitting.value = false;
      return;
    }
  }
  await hooks.api.patch(`/portfolios/recs/${props.recId}/`, {
    status: status,
    skip_reason: skipReason,
  });
  hooks.notify.send(`Recommendation for ${state.rec.value.donor.name} skipped`);
  state.isSubmitting.value = false;

  // Redirect to donor detail view after skip action.
  const portfolioId = state.rec.value.plan.id;
  const donorId = state.rec.value.donor.pk;
  navigateTo(urls.portfolios.donor(portfolioId, donorId));
}
</script>

<template>
  <CBox w="100%">
    <PNavbar />

    <CFlex
      w="100%"
      p="3"
      bg="gray.50"
      justify="center"
      h="100vh"
      align="center"
      key="4"
    >
      <CFlex key="3" gap="3" direction="column">
        <CHeading size="lg" as="h1">Skip this touch</CHeading>

        <CText maxWidth="40rem"
          >You can skip this recommended touch because you already contacted the
          donor, you want to reach out later, or because they are
          unqualified.</CText
        >

        <CHeading size="md">Select the reason</CHeading>
        <CFlex gap="3">
          <CButton
            @click="skipRec('skipped_as_already_handled')"
            variant="outline"
            color-scheme="gray"
            bg="white"
            left-icon="check-circle"
          >
            Already contacted
          </CButton>

          <CButton
            @click="skipRec('skipped_to_next_month')"
            variant="outline"
            color-scheme="gray"
            bg="white"
            left-icon="bi-clock"
          >
            Reach out next month
          </CButton>
          <CButton
            @click="skipRec('skipped_to_next_quarter')"
            variant="outline"
            color-scheme="gray"
            bg="white"
            left-icon="bi-clock"
          >
            Reach out next quarter
          </CButton>
          <CButton
            @click="skipRec('skipped_as_unqualified')"
            variant="outline"
            color-scheme="gray"
            bg="white"
            left-icon="x"
          >
            Unqualified
          </CButton>
        </CFlex>

        <CHeading v-if="state.rec.value" size="md">Donor information</CHeading>
        <CTable
          v-if="state.rec.value"
          variant="unstyled"
          class="p-skip-donor-info"
        >
          <CTr v-if="state.rec.value.donor.name">
            <CTd>Name</CTd>
            <CTd>{{ state.rec.value.donor.name }}</CTd>
          </CTr>

          <CTr v-if="state.rec.value.donor.expected_gift_date">
            <CTd>Next gift</CTd>
            <CTd>{{
              format.date(state.rec.value.donor.expected_gift_date)
            }}</CTd>
          </CTr>

          <CTr v-if="state.rec.value.donor.last_gift_amount">
            <CTd>Last gift</CTd>
            <CTd>
              {{ format.money(state.rec.value.donor.last_gift_amount) }} on
              {{ format.date(state.rec.value.donor.last_gift_date) }}
            </CTd>
          </CTr>

          <CTr v-if="state.rec.value.donor.donated_total">
            <CTd>Lifetime</CTd>
            <CTd>{{ format.money(state.rec.value.donor.donated_total) }}</CTd>
          </CTr>

          <CTr v-if="state.rec.value.donor.giving_since">
            <CTd>Giving since</CTd>
            <CTd>{{ format.date(state.rec.value.donor.giving_since) }}</CTd>
          </CTr>
        </CTable>
      </CFlex>
    </CFlex>
  </CBox>
</template>

<style lang="scss">
h2 {
  margin-top: 1rem;
}
.p-skip-donor-info {
  td {
    padding: 0.5rem;
    padding-right: 1.2rem;

    &:first-child {
      width: 10rem;
      padding-left: 0;
      font-weight: bold;
      color: var(--chakra-colors-gray-500);
    }
  }
}
</style>
