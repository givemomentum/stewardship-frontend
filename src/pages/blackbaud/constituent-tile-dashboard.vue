<script setup lang="ts">
import * as BBSkyAddinClient from "@blackbaud/sky-addin-client";

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
</script>

<template>
  Hello Tile!
</template>
