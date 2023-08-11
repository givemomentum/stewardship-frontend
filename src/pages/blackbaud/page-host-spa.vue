<script setup lang="ts">
import * as BBSkyAddinClient from "@blackbaud/sky-addin-client";
import { useRoute } from "#app";
import { useUserStore } from "~/apps/auth/useUserStore";

const hooks = {
  userStore: useUserStore(),
  route: useRoute(),
};

const client = new BBSkyAddinClient.AddinClient({
  callbacks: {
    init: async function (args) {
      args.ready({
        showUI: true,
        title: 'Momentum'
      });
    }
  }
});

await hooks.userStore.loadUser();

if (!hooks.userStore.isLoggedIn && hooks.route.path !== "/login") {
  navigateTo("/login");
}
</script>

<template>
  <PPortfolioList v-if="hooks.userStore.isLoggedIn" />
</template>
