<script setup>
import { urls } from "~/urls";
import { useLeftMenu } from "~/apps/menu/useLeftMenu";
import { useUserStore } from "~/apps/auth/useUserStore";

const hooks = {
  menu: useLeftMenu(),
  userStore: useUserStore(),
};
</script>

<template>
  <CFlex
    w="100%"
    h="auto"
    p="6"
    py="4"
    color="blue.100"
    bg="blue.800"
    font-size="lg"
  >
    <CFlex pl="1" gap="4" align="center">
      <NuxtLink :to="urls.portfolios.portfolios">
        <chakra.img src="/momentum-logo.svg" color="white" max-w="185px" />
      </NuxtLink>

      <CTooltip label="Early Access Preview">
        <CBox
          mt="6px"
          px="10px"
          pt="1px"
          pb="2px"
          bg="blue.100"
          color="blue.900"
          border-radius="lg"
          font-size="xs"
          :_hover="{cursor: 'help'}"
        >
          EAP
        </CBox>
      </CTooltip>
    </CFlex>
    <CFlex ml="auto" align="center">
      <CButton
        v-if="hooks.userStore.user?.is_momentum_admin"
        @click="hooks.menu.showAdminBar"
        variant="link"
      >
        Admin settings
      </CButton>
    </CFlex>
    <AdminBar v-if="hooks.userStore.user?.is_momentum_admin && hooks.menu.isAdminBarVisible.value" />
  </CFlex>
</template>

<style lang="scss">
  @import '~/styles/chakra-ui.scss';
  @import '~/styles/formkit.scss';
</style>
