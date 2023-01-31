<script setup lang="ts">
  import { useRuntimeConfig } from "#app";
  import { useLeftMenu } from "~/apps/menu/useLeftMenu";
  import { useLetterBatchStore } from "~/apps/letters/useLetterBatchStore";
  import { urls } from "~/urls";
  import { useUserStore } from "~/apps/auth/useUserStore";

  const hooks = {
    config: useRuntimeConfig(),
    userStore: useUserStore(),
    menu: useLeftMenu(),
    batchStore: useLetterBatchStore(),
  };
</script>

<template>
  <CFlex display="unset">
    <CFlex
      direction="column"
      pos="sticky"
      top="0"
      p="6"
      :pr="hooks.menu.isFullWidth.value ? 7 : 6"
      h="auto"
      min-h="100vh"
      color="blue.100"
      bg="blue.800"
      font-size="lg"
    >

      <CFlex pl="1" gap="4" align="center">
        <chakra.img v-if="hooks.menu.isFullWidth.value" src="/momentum-logo.svg" color="white" max-w="185px" />
        <chakra.img v-else src="/momentum-logo-only.svg" max-w="50px" />
        <CBox
          v-if="hooks.menu.isFullWidth.value"
          mt="6px"
          px="10px"
          pt="1px"
          pb="2px"
          bg="blue.100"
          color="blue.900"
          border-radius="lg"
          font-size="xs"
        >
          ALPHA
        </CBox>
      </CFlex>

      <CFlex direction="column" mt="6" gap="1" :w="hooks.menu.isFullWidth.value ? '100%' : 'fit-content'">
        <template v-if="hooks.userStore.isLoggedIn">

          <MenuLeftItem
            :path="urls.tasks.list"
            label="Tasks"
            icon-name="task"
          />
          <MenuLeftItem
            v-if="hooks.userStore.isOrgHor"
            :path="urls.fiscExport.list"
            label="FISC Exports"
            icon-name="oi-table"
            icon-color-prop="fill"
          />
          <MenuLeftItem
            v-if="hooks.userStore.isOrgHor"
            :path="urls.partners.hor.donationList"
            label="Online Donations"
            icon-name="database"
            icon-color-prop="color"
          />
          <MenuLeftItem
            v-if="hooks.userStore.user?.membership?.org?.is_enable_app_letters"
            :path="urls.letters.segmentList"
            path-base="/letters/"
            label="Letters"
            icon-name="letter"
            icon-color-prop="fill"
          />
          <MenuLeftItem
            v-if="hooks.userStore.user?.membership?.org?.is_enable_app_emails"
            :path="urls.emails.batches.list"
            :path-base="urls.emails.base"
            label="Emails"
            icon-name="mail"
          />
          <MenuLeftItem
            v-if="hooks.userStore.isOrgAdmin"
            :path="urls.organization"
            label="Organization"
            icon-name="md-settings-outlined"
            icon-color-prop="fill"
          />
          <MenuLeftItem
            :path="urls.account"
            label="Account"
            icon-name="user"
          />
        </template>
      </CFlex>

      <CButton
        v-if="hooks.userStore.user?.is_momentum_admin && hooks.menu.isFullWidth.value"
        @click="hooks.menu.showAdminBar"
        mt="auto"
        variant="link"
      >
        Admin settings
      </CButton>
    </CFlex>

    <AdminBar v-if="hooks.userStore.user?.is_momentum_admin && hooks.menu.isAdminBarVisible.value" />
  </CFlex>
</template>
