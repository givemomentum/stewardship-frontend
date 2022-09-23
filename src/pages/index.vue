<script setup lang="ts">
  import { CFlex, CBox, CLink, CText, CBadge, CHeading } from "@chakra-ui/vue-next";
  import { useRuntimeConfig } from "#app";
  import { User } from "@sentry/vue";
  import axios from "axios";
  import { onMounted, ref } from "vue";
  import { useApi } from "~/composables/useApi";
  import { PrimaryKey } from "~/interfaces";
  import useUserStore from "~/stores/useUserStore";

  const hooks = {
    config: useRuntimeConfig(),
    api: useApi(),
    user: useUserStore(),
  };
  
  const state = {
    tasks: ref<Task[]>([]),
  };
  
  onMounted(async () => {
    const res = await hooks.api.$get(`${hooks.config.public.apiBase}/tasks/`);
    state.tasks.value = res.data;
  });
  
  interface Task {
    pk: PrimaryKey;
    title: string;
    description: string;
    description_short: string;
    donors: any[];
    status: string;
    author: User;
    assignees: User[];
    assignees_pks: PrimaryKey[];
    org: PrimaryKey;
  }
</script>

<template>
  <CFlex direction="column" v-if="hooks.user.isLoggedIn">
    <CHeading size="md">Your tasks</CHeading>
    <CBox
      v-for="task in state.tasks.value"
      :key="task.pk"
      mt="3"
    >
      {{task.title}} <CBadge>{{task.status}}</CBadge>
    </CBox>
  </CFlex>
  
  <CHeading v-else size="md">
    Welcome!
  </CHeading>
</template>
