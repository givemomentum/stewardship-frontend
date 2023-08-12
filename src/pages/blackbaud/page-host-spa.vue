<script setup lang="ts">
import * as BBSkyAddinClient from "@blackbaud/sky-addin-client";

import { useApi } from "~/composables/useApi";
import { useRoute } from "#app";
import { useUserStore } from "~/apps/auth/useUserStore";

const state = {
  userId: ref(""),
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

async function authenticate () {
  try {
    const token = await client.getUserIdentityToken();
    const res = await hooks.api.post("/crms/blackbaud/get-user-id", {
      token: token
    });
    if (res.status === 200) {
      state.userId.value = res.data.user_id;
    }
  } catch (error) {
    if (error.response?.status !== 403) {
      throw error;
    }
  }
};

const client = new BBSkyAddinClient.AddinClient({
  callbacks: {
    init: async function (args) {
      args.ready({
        showUI: true,
        title: 'Momentum'
      });

      authenticate();
    }
  }
});
</script>

<template>
  <span v-if="!state.userId.value">Authenticating…</span>
  <span v-if="state.userId.value">Blackbaud User ID: {{ state.userId.value }}</span>
</template>
