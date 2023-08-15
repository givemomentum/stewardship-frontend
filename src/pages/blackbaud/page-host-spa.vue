<script setup lang="ts">
import * as BBSkyAddinClient from "@blackbaud/sky-addin-client";
import axios from "axios";

import { blackbaud } from "~/constants";

import { useApi } from "~/composables/useApi";
import { useRoute } from "#app";
import { useUserStore } from "~/apps/auth/useUserStore";

const state = {
  userId: ref(""),
  error: ref(""),
};

const hooks = {
  api: useApi(),
  layout: useLayoutControl(),
  route: useRoute(),
  userStore: useUserStore(),
};

onBeforeMount(async () => {
  hooks.layout.activateLeanMode();
});

async function getUserId () {
  try {
    const token = await client.getUserIdentityToken();
    const res = await hooks.api.post("/crms/blackbaud/get-user-id", {
      token: token
    });
    if (res.status === 200) {
      return res.data.user_id;
    }
  } catch (error) {
    state.error.value = error.response.data.message;
  }
};

const client = new BBSkyAddinClient.AddinClient({
  callbacks: {
    init: async function (args) {
      args.ready({
        showUI: true,
        title: 'Momentum'
      });

      const userId = await getUserId();
      state.userId.value = userId;

      // Store user ID in local storage so it's attached to any other API requests.
      localStorage.setItem(blackbaud.authStorageKey, userId);
    }
  }
});
</script>

<template>
  <PPortfolioList v-if="!state.error.value && state.userId.value" />
  <p v-if="state.error.value">Error: {{ state.error.value }}</p>
</template>
