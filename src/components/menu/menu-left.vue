<script setup lang="ts">
  import { useRuntimeConfig } from "#app";
  import { CBox, CFlex, chakra } from "@chakra-ui/vue-next";
  import { useLeftMenu } from "~/composables/useLeftMenu";
  import { useLetterBatchStore } from "~/composables/useLetterBatchStore";
  import { urls } from "~/urls";
  import useUserStore from "~/stores/useUserStore";

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
            url="/"
            label="Tasks"
            icon-name="task"
          />
          <MenuLeftItem
            v-if="hooks.userStore.isOrgHor || hooks.userStore.user.is_staff"
            :url="urls.fiscExport.list"
            label="FISC Exports"
            icon-name="oi-table"
            icon-color-prop="fill"
          />
          <MenuLeftItem
            v-if="hooks.userStore.isOrgYsgn || hooks.userStore.user.is_staff"
            :url="urls.lettersBatches.list"
            label="Letter Batches"
            icon-name="mail"
            :unread-items="hooks.batchStore.countUnread()"
          />
          <MenuLeftItem
            v-if="hooks.userStore.isOrgYsgn || hooks.userStore.user.is_staff"
            :url="urls.letterSegments.list"
            label="Letter Segments"
            icon-name="oi-table"
            icon-color-prop="fill"
          />
          <MenuLeftItem
            v-if="hooks.userStore.isOrgAdmin"
            :url="urls.organization"
            label="Organization"
            icon-name="md-settings-outlined"
            icon-color-prop="fill"
          />
          <MenuLeftItem
            :url="urls.account"
            label="Account"
            icon-name="user"
          />
          <MenuLeftItem
            v-if="hooks.userStore.user.is_staff"
            :url="`${hooks.config.public.accountsBase}/../admin`"
            label="Django Admin"
            icon-name="bi-tools"
            icon-color-prop="fill"
            is-exeternal
          />

        </template>
      </CFlex>

    </CFlex>

  </CFlex>
</template>
