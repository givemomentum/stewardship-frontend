<script setup lang="ts">
import * as BBSkyAddinClient from "@blackbaud/sky-addin-client";

import { useApi } from "~/composables/useApi";
import { useRoute } from "#app";
import { useUserStore } from "~/apps/auth/useUserStore";

const state = {
  userId: ref(""),
  donorId: ref(""),
  error: ref(""),
  recommendations: ref([]),
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

async function getRecommendations (userId, donorId) {
  try {
    const res = await hooks.api.post("/crms/blackbaud/get-recommendations", {
      user_id: userId,
      donor_id: donorId,
    });
    if (res.status === 200) {
      return res.data;
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

      const donorId = args.context.recordId;
      state.donorId.value = donorId;

      const recommendations = await getRecommendations(userId, donorId);
      state.recommendations.value = recommendations;
    }
  }
});
</script>

<template>
  <CFlex direction="column">
    <div v-if="!state.userId.value">Authenticating…</div>
    <div v-if="state.userId.value">Blackbaud User ID: {{ state.userId.value }}</div>
    <div v-if="state.userId.value && state.donorId.value">Blackbaud Donor ID: {{ state.donorId.value }}</div>
    <div style="color: red;" v-if="state.error.value">Error: {{ state.error.value }}</div>
    <ul v-if="state.recommendations.value">
      <li v-for="rec in state.recommendations.value">{{ rec }}</li>
    </ul>
  </CFlex>
</template>
