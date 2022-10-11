<script setup lang="ts">
  import { CFlex, CHeading, CLink, CButton, CAlert, CAlertIcon, CAlertDescription } from "@chakra-ui/vue-next";
  import { ref, watch } from "vue";
  import { useForm } from "~/composables/useForm";
  import { FiscGift, FiscScan } from "~/interfaces";
  import { urls } from "~/urls";

  const props = defineProps<{
    loadScans: () => Promise<void>;
    scanOpen: FiscScan;
  }>();

  const hooks = {
    form: useForm({
      path: () => `fisc/gifts/${props.scanOpen.gift.pk}/`,
      method: "PATCH",
      onSuccess: props.loadScans,
    }),
  };

  const state = {
    gift: ref<FiscGift>(props.scanOpen?.gift),
  };

  watch(() => props.scanOpen, (scanNew, scanOld) => {
    state.gift.value = null;
    // formkit isn't good at changes detection on :value wo setTimeout
    // and v-model of course writes back to the given object
    //
    // adding v-if="state.gift.value" helps,
    // I bet formkit doesn't correctly read reactivity object
    // hence fails to add itself as a rendering dep
    setTimeout(() => {
      state.gift.value = scanNew?.gift;
    }, 100);
  });
</script>

<template>
  <CFlex direction="column" v-if="props.scanOpen.gift" gap="4">

    <CFlex justify="space-between" align="center" min-w="418px">
      <CHeading font-size="1.5rem" font-weight="normal">Update Gift</CHeading>
      <CLink
        v-if="props.scanOpen.is_existing_donor"
        :href="urls.donorPerfect.donor(props.scanOpen.donor_id)"
        isExternal>
        <CButton
          v-if="props.scanOpen.is_existing_donor"
          right-icon="external-link"
          size="sm"
          variant="outline"
        >
          DP Profile
        </CButton>
      </CLink>
    </CFlex>

    <FormKit
      type="form"
      v-if="state.gift.value"
      :value="state.gift.value"
      @submit="hooks.form.submit"
      :actions="false"
    >
      <CFlex justify="flex-start" direction="column">
        <CFlex gap="4">
          <FormKit name="first_name" label="first_name" />
          <FormKit name="last_name" label="last_name" />
        </CFlex>

        <FormKit name="address" label="address" />

        <CFlex gap="4">
          <FormKit name="address2" label="address2" />
          <FormKit name="zip" label="zip" />
        </CFlex>

        <CFlex gap="4">
          <FormKit name="city" label="city" />
          <FormKit name="state" label="state" />
        </CFlex>

        <FormKit name="ty_letter_no" label="ty_letter_no" />

        <CFlex gap="4">
          <FormKit name="sub_solicit_code" label="sub_solicit_code" />
          <FormKit name="gift_narrative" label="gift_narrative" />
        </CFlex>

        <FormKit name="gift_narrative" label="gift_narrative" />

        <FormKit type="submit" label="Save" size="md" />

        <CAlert v-if="hooks.form.isSuccess.value" status="success" mt="2">
          <CAlertIcon />
          <CAlertDescription>Gift record updated</CAlertDescription>
        </CAlert>

      </CFlex>
    </FormKit>
  </CFlex>
</template>
