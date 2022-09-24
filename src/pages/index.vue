<script setup lang="ts">
import { CFlex, CBox, CLink, CText, CBadge, CIcon, CHeading } from "@chakra-ui/vue-next";
import {
  CDrawer,
  CDrawerOverlay,
  CDrawerContent,
  CDrawerCloseButton,
  CDrawerHeader,
  CDrawerBody
} from "@chakra-ui/vue-next";
import { useRuntimeConfig } from "#app";
import { Md5 } from "ts-md5";
import { onMounted, ref, watch } from "vue";
import { useApi } from "~/composables/useApi";
import { Task, PrimaryKey, TaskStatus } from "~/interfaces";
import useUserStore from "~/stores/useUserStore";
import { formatDistance, format } from "date-fns";

const hooks = {
  config: useRuntimeConfig(),
  api: useApi(),
  user: useUserStore(),
};

const state = {
  tasks: ref<Task[]>([]),
  taskOpened: ref<Task | null>(null),
  isDrawlerOpened: ref(false),
};

watch(state.taskOpened, (taskOpenedNew) => {
  state.isDrawlerOpened.value = Boolean(taskOpenedNew);
});

onMounted(async () => {
  const res = await hooks.api.$get("/tasks/");
  state.tasks.value = res.data;
});
</script>

<template>
  <CFlex v-if="hooks.user.isLoggedIn" direction="column" gap="3">

    <CHeading
        size="lg"
        mt="3"
        mb="1"
        font-weight="normal"
    >
      Tasks
    </CHeading>

    <CFlex
        v-for="task in state.tasks.value"
        :key="task.pk"
        @click="state.taskOpened.value = task"
        direction="column"
        gap="3"
        mt="4"
        p="4"
        max-w="700px"
        bg="white"
        border-radius="lg"
        border="1px solid white"
        :_hover="{ cursor: 'pointer', borderColor: 'gray.200' }"
    >
      <TaskHead :task="task"/>

      <CFlex
          justify="space-between"
          align="center"
          font-size="xs"
          color="gray.500"
      >

        <CFlex
            align="center"
            color="gray.500"
            gap="1"
        >
          <CIcon name="message-square"/>
          <CText>5</CText>
        </CFlex>

        <CFlex>
          {{
            formatDistance(new Date(task.created_at), new Date(), {
              addSuffix: true,
            })
          }}
        </CFlex>

      </CFlex>
    </CFlex>

    <CDrawer
        v-model="state.isDrawlerOpened.value"
        placement="right"
        size="xl"
        @keyup.esc="state.isDrawlerOpened.value = false"
        tabindex="0"
    >
      <CDrawerOverlay/>
      <CDrawerContent bg="white">
        <CDrawerBody v-if="state.taskOpened.value" pt="4">
          <TaskHead :task="state.taskOpened.value"/>
        </CDrawerBody>
      </CDrawerContent>
    </CDrawer>

    <CBox
        v-if="state.isDrawlerOpened.value"
        @click="state.isDrawlerOpened.value = false"
        pos="fixed"
        w="100vw"
        h="100vh"
        left="0"
        top="0"
        z-index="1399"
    />
  </CFlex>

  <CHeading v-else size="md">
    Welcome!
  </CHeading>
</template>

<style lang="scss">
html, body {
  background: #f4f8fb;
}

// chakra drawer is broken, revisit one they fix it
.chakra-modal__content-container {
  width: 0;
  height: 0;

  section {
    z-index: 1400;
  }
}

.chakra-modal__overlay {
}
</style>
