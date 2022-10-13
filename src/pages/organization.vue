<script setup lang="ts">
  import { CBox, CLink, CText, CFlex, CHeading } from "@chakra-ui/vue-next";
  import useUserStore from "~/stores/useUserStore";
  import { AdminOrg } from "~/interfaces";
  import { onMounted, ref, computed } from "vue";
  import { useApi } from "~/composables/useApi";

  const hooks = {
    userStore: useUserStore(),
    api: useApi(),
  };

  const state = {
    adminOrg: ref<AdminOrg | null>(null),
  };

  const comp = {
    blackbaudLink: computed(() => hooks.api.$url(`/crms/blackbaud/oauth_redirect/${state.adminOrg.value.pk}`)),
  };

  onMounted(async () => {
    const res = await hooks.api.$get(`/orgs/admin/${hooks.userStore.org.pk}`);
    state.adminOrg.value = res.data;
  });

</script>
<template>
  <CFlex direction="column" gap="2">
    <CHeading variant="page-header">
      Organization Settings
    </CHeading>
    <CText font-size="xl">{{ hooks.userStore.org.name }}</CText>
    <template v-if="state.adminOrg.value">
      <CFlex mt="2" direction="column">
        <CHeading font-size="xl">Blackbaud Connection</CHeading>
        <CBox>
          <CText
            v-if="state.adminOrg.value.blackbaud_connection && state.adminOrg.value.blackbaud_connection.connection_successful">
            Your Blackbaud account is linked ({{
              state.adminOrg.value.blackbaud_connection.authenticated_user_email
            }})
          </CText>
          <CText
            v-else-if="state.adminOrg.value.blackbaud_connection && !state.adminOrg.value.blackbaud_connection.connection_successful">
            Linking your account ({{ state.adminOrg.value.blackbaud_connection.authenticated_user_email }}) was
            not
            successful.
            <CLink textDecoration="underline" :href="comp.blackbaudLink.value">Click here</CLink>
            to retry.
          </CText>
          <CText v-else>
            <CLink textDecoration="underline" :href="comp.blackbaudLink.value">Click here</CLink>
            to link your Blackbaud account.
          </CText>
        </CBox>
      </CFlex>
    </template>

  </CFlex>
</template>

<style>
  a {
    text-decoration: underline;
  }
</style>
