<script lang="ts" setup>
  import { useRuntimeConfig } from "#app";
  import { FormKitNode } from "@formkit/core";
  import { captureEvent } from "@sentry/hub";
  import { ref } from "vue";
  import NuxtCkeditor from "~/apps/tasks/nuxt-ckeditor.vue";
  import { useApi } from "~/composables/useApi";
  import { strings } from "~/constants";
  import { useUserStore } from "~/apps/auth/useUserStore";

  const props = defineProps<{
    taskPk: number | string;
    commentParentPk?: number;
    isCancelBtnVisible?: boolean;
  }>();

  const emit = defineEmits<{
    (event: "commentPosted"): void;
    (event: "cancelClicked"): void;
  }>();

  const hooks = {
    config: useRuntimeConfig(),
    userStore: useUserStore(),
    api: useApi(),
  };

  const state = {
    replyContent: ref(""),
  };

  async function submitComment(data: { email: string; first_name: string }, node: FormKitNode) {
    node.setErrors([]);

    if (state.replyContent.value === "") {
      node.setErrors(["Please input the comment"]);
      return;
    }

    try {
      await hooks.api.post(`${hooks.config.public.apiBase}/comments/`, {
        author_pk: hooks.userStore.user.pk,
        content: state.replyContent.value,
        task: props.taskPk,
        parent: props.commentParentPk ?? null,
      });
      node.reset();
      state.replyContent.value = "";
      emit("commentPosted");
    } catch (error) {
      node.setErrors([strings.error]);
      captureEvent(error);
    }
  }
</script>

<template>
  <CBox class="comment comment-form">
    <FormKit type="form" :actions="false" @submit="submitComment">
      <NuxtCkeditor v-model="state.replyContent.value" />

      <CFlex justify="flex-start" mt="4" gap="4">
        <FormKit
          type="submit"
          label="Send"
          size="sm"
        />
        <CButton
          v-if="props.isCancelBtnVisible"
          @click="emit('cancelClicked')"
          variant="outline"
          size="sm"
        >
          Cancel
        </CButton>
      </CFlex>
    </FormKit>

  </CBox>
</template>

<style lang="scss">
  .comment {

    .formkit-outer {
      width: fit-content;
      margin-bottom: 0;

      &[data-type='submit'] {
        margin-bottom: 0 !important;
      }

      .formkit-input[type='submit'] {
        display: flex;
        margin-right: auto;
        margin-left: 0;
        margin-bottom: 0;
        background: white !important;
        border: 1px solid var(--chakra-colors-gray-500);
        color: var(--chakra-colors-gray-500) !important;
        &:hover {
          background: var(--chakra-colors-gray-50) !important;
        }
      }
    }
  }
</style>
