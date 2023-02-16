<script lang="ts" setup>
  import { onMounted, ref, computed } from "vue";
  import { useRuntimeConfig } from "#app";
  import { useApi } from "~/composables/useApi";
  import { Org } from "~/apps/auth/interfaces";
  import { useForm } from "~/composables/useForm";
  import { useUserStore } from "~/apps/auth/useUserStore";
  import { useLeftMenu } from "~/apps/menu/useLeftMenu";

  const hooks = {
    config: useRuntimeConfig(),
    api: useApi(),
    userStore: useUserStore(),
    menu: useLeftMenu(),
    form: useForm({
      path: () => `orgs/admin/impersonate`,
      method: "POST",
      onSuccess: async () => window.location.reload(),
    }),
  };

  const state = {
    orgs: ref<Org[]>([]),
  };

  onMounted(async () => {
    const res = await hooks.api.get("/orgs/admin/impersonation-options/");
    state.orgs.value = res.data;
  });

  const comp = {
    orgOptions: computed(() => state.orgs.value.map(org => ({
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
  <div class="menu-admin">
    <div class="hide-link-container">
      <CLink @click="hooks.menu.hideAdminBar" mt="auto" variant="link">
        Hide
      </CLink>
    </div>
    <div class="admin-link-container">
      <CLink
        :href="`${hooks.config.public.accountsBase}/../admin`"
        is-external
      >
        Django Admin Panel
      </CLink>
    </div>
    <FormKit
      :v-if="state.orgs"
      type="form"
      @submit="hooks.form.submit"
      :actions="false"
      :value="comp.defaults.value"
    >
      <FormKit
        type="select"
        label="Org:"
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
        label-class="checkbox-label"
      />
      <FormKit type="submit" label="Save" size="sm" />
    </FormKit>
  </div>
</template>

<style lang="scss">
  .menu-admin {
    background: var(--chakra-colors-blue-800);
    color: var(--chakra-colors-blue-100);
    position: fixed;
    width: 100%;
    bottom: 0;
    display: flex;
    align-items: center;
    gap: 2em;
    padding: 1em;

    .hide-link-container {
      display: flex;
      align-items: center;
      padding: 0 7.5em;
    }

    .admin-link-container {
      margin-left: auto;
    }

    form {
      display: flex;
      gap: 2em;
      align-items: center;
      margin-right: 7em; // So it's not covered by hubspot chat
    }

    .checkbox-label {
      margin-left: .375em;
    }

    .formkit-form .formkit-outer {
      width: auto;
      margin-bottom: 0 !important; // Overriding !important declaration in formkit styles
    }

    .formkit-wrapper {
      display: flex;
      align-items: center;
    }

    .formkit-label {
      margin-bottom: 0 !important;
    }

    .formkit-form .formkit-outer .formkit-inner {
      height: 2em;
    }

    .formkit-form .formkit-outer .formkit-inner .formkit-input {
      height: 2em;
    }
  }
</style>
