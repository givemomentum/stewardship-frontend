<script setup lang="ts">
  import { useRuntimeConfig } from "#app";
  import { CIcon, CBox, CLink, CFlex, chakra } from "@chakra-ui/vue-next";
  import { useLeftMenu } from "~/composables/useLeftMenu";
  import useUserStore from "~/stores/useUserStore";

  const hooks = {
    config: useRuntimeConfig(),
    userStore: useUserStore(),
    menu: useLeftMenu(),
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
          <CLink
            as="RouterLink"
            variant="side-menu"
            to="/"
            :bg="$route.path === '/' ? 'whiteAlpha.300' : ''"
            :color="$route.path === '/' ? 'white' : ''"
          >
            <CIcon name="task" font-size="2xl" />
            <chakra.span v-if="hooks.menu.isFullWidth.value">Tasks</chakra.span>
          </CLink>

          <CLink
            as="RouterLink"
            variant="side-menu"
            to="/fisc-exports"
            :bg="$route.path.includes('/fisc-exports') ? 'whiteAlpha.300' : ''"
            :color="$route.path.includes('/fisc-exports') ? 'white' : ''"
          >
            <CIcon
              name="oi-table"
              font-size="2xl"
              :fill="$route.path === '/fisc-exports' ? 'white' : 'blue.100'"
            />
            <chakra.span v-if="hooks.menu.isFullWidth.value">FISC Exports</chakra.span>
          </CLink>

          <!--          <CLink-->
          <!--            variant="side-menu"-->
          <!--          >-->
          <!--            <CIcon name="people" font-size="2xl" />-->
          <!--            <chakra.span v-if="hooks.menu.isFullWidth.value">Donors</chakra.span>-->
          <!--          </CLink>-->

          <CLink
            as="RouterLink"
            variant="side-menu"
            to="/account"
            :bg="$route.path.includes('/account') ? 'whiteAlpha.300' : ''"
            :color="$route.path.includes('/account') ? 'white' : ''"
          >
            <CIcon name="user" font-size="2xl" />
            <chakra.span v-if="hooks.menu.isFullWidth.value">Account</chakra.span>
          </CLink>
        </template>
      </CFlex>

    </CFlex>

  </CFlex>
</template>
