<script lang="ts" setup>
  import { useRuntimeConfig, useState } from "#app";
  import { CHeading, CFlex, CBox, CButton, CLink, CInput, CText, chakra } from "@chakra-ui/vue-next";
  import { FormKitNode } from "@formkit/core";
  import { captureEvent } from "@sentry/hub";
  import axios from "axios";
  import { onMounted, onUpdated, ref } from "vue";
  import NuxtCkeditor from "~/components/nuxt-ckeditor.vue";
  import { PrimaryKey } from "~/interfaces";
  import { strings } from "~/constants";
  import useUserStore from "~/stores/useUserStore";

  const props = defineProps<{
    taskPk: PrimaryKey | string;
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
      const res = await axios.post(`${hooks.config.public.apiBase}/comments/`, {
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
      }
    }
  }
</style>
