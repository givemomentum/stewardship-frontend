<script setup lang="ts">
import * as BBSkyAddinClient from "@blackbaud/sky-addin-client";

import { blackbaud } from "~/constants";

import { useApi } from "~/composables/useApi";
import { useRoute } from "#app";
import { useUserStore } from "~/apps/auth/useUserStore";

// Always clear user ID from local storage on setup.
localStorage.removeItem(blackbaud.authStorageKey);

const state = {
  userId: ref(""),
  ready: ref(false),
  statusText: ref(""),
  showAuthButton: ref(false),
  authButtonDisabled: ref(false),
  authButtonText: ref("Connect your Blackbaud account with Momentum"),
};

const hooks = {
  api: useApi(),
  route: useRoute(),
  userStore: useUserStore(),
};

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
    state.statusText.value = error.response.data.message;
  }
};

async function checkAuth () {
  await hooks.userStore.loadUser();

  if (hooks.userStore.isLoggedIn) {
    state.showAuthButton.value = false;
    state.ready.value = true;
  } else {
    setTimeout(checkAuth, 5000);
  }
}

async function authenticate () {
  state.authButtonText.value = "Waiting for authentication…";
  state.authButtonDisabled.value = true;

  setTimeout(checkAuth, 5000);

  await navigateTo(`/login?uid=${state.userId.value}`, {
    open: {
      target: '_blank',
    }
  });
}

const client = new BBSkyAddinClient.AddinClient({
  callbacks: {
    init: async function (args) {
      args.ready({
        showUI: true,
        title: 'Momentum'
      });

      const userId = await getUserId();

      // Store user ID in local storage so it's attached to any other API requests.
      localStorage.setItem(blackbaud.authStorageKey, userId);

      state.userId.value = userId;

      // Check if the user is authenticated, or if they need to be sent to our auth for
      // mapping the Blackbaud User ID to their backend user.
      await hooks.userStore.loadUser();

      if (hooks.userStore.isLoggedIn) {
        state.showAuthButton.value = false;
        state.ready.value = true;
      } else {
        state.showAuthButton.value = true;
      }
    }
  }
});
</script>

<template>
  <PPortfolioList v-if="state.ready.value" />
  <p v-if="state.statusText.value">{{ state.statusText.value }}</p>
  <CLink v-if="state.showAuthButton.value && !state.statusText.value" @click="authenticate">
    <CButton
      :disabled="state.authButtonDisabled.value"
      variant="outline"
      size="lg"
      color-scheme="gray"
      color="gray.600"
      p="10px"
      h="fit-content"
    >
      {{ state.authButtonText.value }}
    </CButton>
  </CLink>
</template>
