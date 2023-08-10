<script setup lang="ts">
console.log("setting up component");

import * as BBSkyAddinClient from "@blackbaud/sky-addin-client";

const client = new BBSkyAddinClient.AddinClient({
  callbacks: {
    init: function (args) {
      console.log(args);
      args.ready({
        showUI: true,
        title: 'Momentum'
      });
    }
  }
});

console.log("got client:", client);
</script>

<template>
  Hello World!
</template>
