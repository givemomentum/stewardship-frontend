<script setup lang="ts">
  import { CFlex, CHeading, CLink, CButton, CBox, CAlert, CAlertIcon, CAlertDescription } from "@chakra-ui/vue-next";
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
    state.gift.value = scanNew?.gift;
  });
</script>

<template>
  <CFlex direction="column" v-if="props.scanOpen.gift" gap="4">

    <CFlex justify="space-between" align="center" min-w="418px">
      <CHeading font-size="1.5rem" font-weight="normal">
        Update Gift - {{props.scanOpen.is_existing_donor ? "Existing Donor" : "New Donor"}}
      </CHeading>
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
      :value="state.gift.value"
      :key="state.gift.value.pk"
      @submit="hooks.form.submit"
      :actions="false"
    >
      <CFlex justify="flex-start" direction="column">
        <CFlex gap="4">
          <FormKit color="red" name="first_name" label="First Name" />
          <FormKit name="last_name" label="Last Name" />
        </CFlex>

        <FormKit name="address" label="Address" />

        <CFlex gap="4">
          <CBox flex="2">
            <FormKit name="city" label="City" />
          </CBox>
          <CBox flex="1">
            <FormKit name="state" label="State" />
          </CBox>
          <CBox flex="2">
            <FormKit name="zip" label="Zip" />
          </CBox>
        </CFlex>

        <CFlex gap="4">
          <CBox flex="1">
            <FormKit name="sub_solicit_code" label="Sub-Solicit Code" />
          </CBox>
          <CBox flex="2">
            <FormKit name="gift_narrative" label="Gift Narrative" />
          </CBox>
        </CFlex>

        <CFlex gap="4">
          <FormKit name="ty_letter_no" label="TY Letter No" />
          <FormKit name="campaign" label="Campaign" />
          <FormKit name="solicit_code" label="Solicit Code" />
        </CFlex>

        <CFlex gap="4">
          <CBox flex="1">
            <FormKit name="memory_honory" label="Memory/Honor" />
          </CBox>
          <CBox flex="2">
            <FormKit name="gfname" label="Honoree First Name" />
          </CBox>
          <CBox flex="2">
            <FormKit name="glname" label="Honoree Last Name" />
          </CBox>
        </CFlex>

        <FormKit type="submit" label="Save" size="md" />

        <CAlert v-if="hooks.form.isSuccess.value" status="success" mt="2">
          <CAlertIcon />
          <CAlertDescription>Gift record updated</CAlertDescription>
        </CAlert>

      </CFlex>
    </FormKit>
  </CFlex>
</template>
