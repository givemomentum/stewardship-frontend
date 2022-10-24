<script lang="ts" setup>
  import { CFlex, CHeading, CLink, CButton, CBox, CAlert, CAlertIcon, CAlertDescription } from "@chakra-ui/vue-next";
  import { onMounted, ref, computed } from "vue";
  import { useRuntimeConfig } from "#app";
  import { useApi } from "~/composables/useApi";
  import { Org } from "~/apps/auth/interfaces";
  import { useForm } from "~/composables/useForm";

  const hooks = {
    config: useRuntimeConfig(),
    api: useApi(),
    form: useForm({
      path: () => `auth/impersonate-org`,
      method: "POST",
      onSuccess: async () => window.location.reload(),
    }),
  };

  const state = {
    orgs: ref<Org[]>([]),
  }

  onMounted(async () => {
    const res = await hooks.api.$get("/orgs/admin/impersonation-options");
    state.orgs.value = res.data;
  });

  const comp = {
    orgOptions: computed(() => {
      return state.orgs.value.map(org => {
        return {
          'label': org.name,
          'value': org.pk,
        };
      });
    }),
  };
</script>

<template>
  <CFlex bg="white">
    <CLink
      :href="`${hooks.config.public.accountsBase}/../admin`"
      is-external
    >
      Django Admin
    </CLink>
    <FormKit
      type="form"
      @submit="hooks.form.submit"
      :actions="false"
      display="flex"
    >
      <FormKit type="select"
               label="Org to impersonate"
               placeholder="Select an org"
               name="org_id"
               :options="comp.orgOptions.value"
               validation="required"
               validation-visibility="submit"
      />
      <FormKit
        type="checkbox"
        label="Org admin"
        name="is_org_admin"
      />
      <FormKit type="submit" label="Save" size="md" />
    </FormKit>
  </CFlex>
</template>


<style lang="scss">

</style>