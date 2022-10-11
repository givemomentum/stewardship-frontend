<script setup lang="ts">
  import { CFlex, CHeading, CAlert, CAlertIcon, CAlertDescription } from "@chakra-ui/vue-next";
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
        if (state.optOut.value) {
          return `fisc/opt-outs/${state.optOut.value.pk}/`;
        }
        return `fisc/opt-outs/`;
      },
      getExtraData: () => ({
        scan: props.scanOpen.pk,
      }),
      onSuccess: async () => {
        state.alertMessage.value = `Opt-out record ${state.optOut.value ? "updated" : "created"}`;
        await props.loadScans();
        setTimeout(() => {
          state.alertMessage.value = null;
        }, 5000);
      },
      method: () => (state.optOut.value ? "PATCH" : "POST"),
    }),
  };

  const state = {
    optOut: ref(props.scanOpen.optout),
    alertMessage: ref<string | null>(null),
  };

  watch(() => props.scanOpen, (scanNew) => {
    state.optOut.value = scanNew?.optout ?? null;
  });

</script>

<template>
  <CFlex direction="column" gap="4">

    <CFlex justify="space-between" align="center" min-w="418px">
      <CHeading font-size="1.5rem" font-weight="normal">
        Opt out (add to Nixie list)
      </CHeading>

    </CFlex>

    <FormKit
      type="form"
      @submit="hooks.form.submit"
      :actions="false"
      :value="state.optOut.value"
      :config="{ validationVisibility: 'submit' }"
    >
      <CFlex justify="flex-start" direction="column">
        <CFlex gap="4">
          <FormKit name="first_name" label="First Name" validation="required" />
          <FormKit name="last_name" label="Last Name" validation="required" />
        </CFlex>

        <FormKit name="address" label="Address" validation="required" />
        <FormKit name="city" label="City" validation="required" />

        <CFlex gap="4">
          <FormKit name="state" label="State" validation="required" />
          <FormKit name="zip" label="Zip" validation="required" />
        </CFlex>

        <FormKit name="notes" label="Notes" />

        <FormKit type="submit" :label="state.optOut.value ? 'Update' : 'Submit'" size="md" />

        <CAlert v-if="state.alertMessage.value" status="success" mt="2">
          <CAlertIcon />
          <CAlertDescription>{{ state.alertMessage.value }}</CAlertDescription>
        </CAlert>
      </CFlex>
    </FormKit>
  </CFlex>
</template>
