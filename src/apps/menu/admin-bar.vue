<script lang="ts" setup>
  import { CFlex, CLink } from "@chakra-ui/vue-next";
  import { onMounted, ref, computed } from "vue";
  import { useRuntimeConfig } from "#app";
  import { useApi } from "~/composables/useApi";
  import { Org } from "~/apps/auth/interfaces";
  import { useForm } from "~/composables/useForm";
  import useUserStore from "~/stores/useUserStore";

  const hooks = {
    config: useRuntimeConfig(),
    api: useApi(),
    userStore: useUserStore(),
    form: useForm({
      path: () => `auth/impersonate-org`,
      method: "POST",
      onSuccess: async () => window.location.reload(),
    }),
  };

  const state = {
    orgs: ref<Org[]>([]),
  };

  onMounted(async () => {
    const res = await hooks.api.$get("/orgs/admin/impersonation-options");
    state.orgs.value = res.data;
  });

  const comp = {
    orgOptions: computed(() => state.orgs.value.map((org) => ({
      label: org.name,
      value: org.pk,
    }))),
    defaults: computed(() => ({
      org_id: hooks.userStore.org?.pk,
      is_org_admin: hooks.userStore.user?.membership?.is_org_admin,
    })),
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
      :v-if="state.orgs"
      type="form"
      @submit="hooks.form.submit"
      :actions="false"
      display="flex"
      :value="comp.defaults.value"
    >
      <FormKit
        type="select"
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
