<script setup lang="ts">
  import { watch } from "vue";
  import { useForm } from "~/composables/useForm";
  import { FiscScan } from "~/apps/fisc/interfaces";
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

  watch(() => props.scanOpen, (scanNew, scanOld) => {
    if (scanNew.pk !== scanOld.pk) {
      hooks.form.isSuccess.value = false;
    }
  });
</script>

<template>
  <CFlex direction="column" v-if="props.scanOpen.gift" gap="4">
    <CFlex justify="space-between" align="center" min-w="418px">
      <CHeading font-size="1.5rem" font-weight="normal">
        Update Gift - {{ props.scanOpen.is_existing_donor ? "Existing Donor" : "New Donor" }}
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
      :value="props.scanOpen?.gift"
      :key="props.scanOpen?.gift.pk"
      @submit="hooks.form.submit"
      :actions="false"
    >
      <CFlex justify="flex-start" direction="column">
        <CFlex gap="4">
          <FormKit name="first_name" label="First Name" />
          <FormKit name="last_name" label="Last Name" />
        </CFlex>
        <template v-if="!props.scanOpen.is_existing_donor">
          <CFlex gap="4">
            <FormKit name="salutation" label="Salutation" />
            <FormKit name="opt_line" label="Opt Line" />
          </CFlex>
          <CFlex gap="4">
            <FormKit name="home_phone" label="Home Phone" />
            <FormKit name="email" label="Email" />
          </CFlex>
          <CFlex gap="4">
            <FormKit name="org_rec" label="Org Rec" />
            <FormKit name="donor_type" label="Donor Type" />
          </CFlex>
        </template>

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
            <FormKit name="memory_honor" label="Memory/Honor" />
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
