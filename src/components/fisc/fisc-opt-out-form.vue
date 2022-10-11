<script setup lang="ts">
  import { CFlex, CHeading, CButton } from "@chakra-ui/vue-next";
  import { watch } from "vue";
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
      path: () => `fisc/opt-outs/`,
      onSuccess: props.loadScans,
    }),
  };

  watch(() => props.scanOpen, async (scanNew) => {

  });

</script>

<template>
  <CFlex direction="column" gap="4">

    <CFlex justify="space-between" align="center" min-w="418px">
      <CHeading font-size="1.5rem" font-weight="normal">Opt Out</CHeading>
      <CButton
        v-if="props.scanOpen.is_existing_donor"
        right-icon="external-link"
        size="sm"
        variant="outline"
      >
        DP Profile
      </CButton>
    </CFlex>

    <FormKit
      type="form"
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

        <FormKit name="notes" label="notes" type="textarea" rows="2" />

        <FormKit type="submit" label="Submit" size="md" />

      </CFlex>
    </FormKit>
  </CFlex>
</template>
