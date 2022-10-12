<script setup lang="ts">
  import { CFlex, CHeading, CAlert, CAlertIcon, CAlertDescription, CBox } from "@chakra-ui/vue-next";
  import { ref, watch } from "vue";
  import { useApi } from "~/composables/useApi";
  import { useForm } from "~/composables/useForm";
  import { FiscScan } from "~/interfaces";

  const props = defineProps<{
    loadScans: () => Promise<void>;
    scanOpen: FiscScan;
  }>();

  const hooks = {
    api: useApi(),
    form: useForm({
      path: () => {
        if (props.scanOpen.optout) {
          return `fisc/opt-outs/${props.scanOpen.optout.pk}/`;
        }
        return `fisc/opt-outs/`;
      },
      getExtraData: () => ({
        scan: props.scanOpen.pk,
      }),
      onSuccess: async () => {
        state.alertMessage.value = `Opt-out record ${props.scanOpen.optout ? "updated" : "created"}`;
        await props.loadScans();
        setTimeout(() => {
          state.alertMessage.value = null;
        }, 5000);
      },
      method: () => (props.scanOpen.optout ? "PATCH" : "POST"),
    }),
  };

  const state = {
    alertMessage: ref<string | null>(null),
  };
  
  watch(() => props.scanOpen, (scanNew, scanOld) => {
    if (scanNew.pk !== scanOld.pk) {
      state.alertMessage.value = null;
    }
  });

</script>

<template>
  <CFlex direction="column" gap="4">

    <CFlex justify="space-between" align="center" min-w="418px">
      <CHeading font-size="1.5rem" font-weight="normal">
        Opt-out (add to Nixie list)
      </CHeading>

    </CFlex>

    <FormKit
      type="form"
      @submit="hooks.form.submit"
      :actions="false"
      :value="props.scanOpen?.optout"
      :key="props.scanOpen.pk">
      <CFlex justify="flex-start" direction="column">
        <CFlex gap="4">
          <FormKit name="first_name" label="First Name" />
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

        <FormKit name="notes" label="Notes" />

        <FormKit type="submit" :label="props.scanOpen.optout ? 'Update' : 'Submit'" size="md" />

        <CAlert v-if="state.alertMessage.value" status="success" mt="2">
          <CAlertIcon />
          <CAlertDescription>{{ state.alertMessage.value }}</CAlertDescription>
        </CAlert>
      </CFlex>
    </FormKit>
  </CFlex>
</template>
