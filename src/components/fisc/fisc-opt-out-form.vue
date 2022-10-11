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
        if (props.scanOpen.optout) {
          return `fisc/opt-outs/${props.scanOpen.optout.pk}/`;
        }
        return `fisc/opt-outs/`;
      },
      getExtraData: () => ({
        scan: props.scanOpen.pk,
      }),
      onSuccess: props.loadScans,
      method: () => (props.scanOpen.optout ? "PATCH" : "POST"),
    }),
  };

  const state = {
    optOut: ref(props.scanOpen.optout),
  };

  watch(() => props.scanOpen, async (scanNew) => {
    state.optOut.value = null;
    // see ./fisc-gift-form.vue watch() for details
    setTimeout(() => {
      state.optOut.value = scanNew?.optout ?? null;
      hooks.form.isSuccess.value = false;
    }, 100);
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
      v-if="state.optOut.value"
      @submit="hooks.form.submit"
      :actions="false"
      :value="state.optOut.value"
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

        <FormKit name="notes" label="notes" />

        <FormKit type="submit" label="Update" size="md" />

        <CAlert v-if="hooks.form.isSuccess.value" status="success" mt="2">
          <CAlertIcon />
          <CAlertDescription>Opt out record updated</CAlertDescription>
        </CAlert>

      </CFlex>
    </FormKit>

    <FormKit
      type="form"
      v-else
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

        <FormKit name="notes" label="notes" />

        <FormKit type="submit" label="Submit" size="md" />

        <CAlert v-if="hooks.form.isSuccess.value" status="success" mt="2">
          <CAlertIcon />
          <CAlertDescription>Opt out record created</CAlertDescription>
        </CAlert>

      </CFlex>
    </FormKit>

  </CFlex>
</template>
