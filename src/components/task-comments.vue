<script lang="ts" setup>
import { useRuntimeConfig, useState } from "#app";
import { CHeading, CFlex, CBox, CButton, CLink, CText, chakra } from "@chakra-ui/vue-next";
import { captureEvent } from "@sentry/hub";
import axios from "axios";
import { onMounted, onUpdated, ref } from "vue";
import JobCommentChild from "~/components/task-comment-child.vue";
import JobCommentForm from "~/components/task-comment-form.vue";
import { Comment, PrimaryKey } from "~/interfaces";

const props = defineProps<{ taskPk: number | string; isShouldLoad: boolean }>();

const hooks = {
  config: useRuntimeConfig(),
}

const state = {
  comments: ref(null),
  isNoComments: ref(true),
}

onMounted(loadComments);

onUpdated(loadComments);

async function loadComments(args?: {isReload?: boolean}) {
  if ((props.isShouldLoad && !state.comments.value) || args?.isReload) {
    try {
      const res = await axios.get(`${hooks.config.public.apiBase}/comments/?task=${props.taskPk}`);
      const commentsRaw: Comment[] = res.data;
      state.comments.value = commentsRaw.filter(comment => comment.parent === null);
    } catch (err) {
      captureEvent(err);
    }
  }
}

</script>

<template>
  <div>
    <CBox
      v-for="comment in state.comments.value"
      v-if="state.comments.value?.length"
      :key="comment.pk"
    >

      <JobCommentChild
        :task-pk="props.taskPk"
        :comment="comment"
        @comment-posted="loadComments({ isReload: true })"
      />

      <CBox
        v-if="comment.children"
        v-for="commentChild1 in comment.children"
        :key="commentChild1.pk"
        ml="12"
      >

        <JobCommentChild
          :task-pk="props.taskPk"
          :comment="commentChild1"
          @comment-posted="loadComments({ isReload: true })"
        />
        
        <CBox
          v-if="commentChild1.children"
          v-for="commentChild2 in commentChild1.children"
          :key="commentChild2.pk"
          ml="12"
        >
          <JobCommentChild
            :task-pk="props.taskPk"
            :comment="commentChild2"
            :is-last-thread-level="true"
            @comment-posted="loadComments({ isReload: true })"
          />
        </CBox>

      </CBox>

    </CBox>

    <CFlex gap="4" direction="column">
      <CText
        :mt="state.comments.value?.length ? 6 : 0"
        font-size="lg"
        line-height="1"
      >
        Leave a comment
      </CText>
      <JobCommentForm
        :task-pk="props.taskPk"
        @comment-posted="loadComments({ isReload: true })"
      /> 
    </CFlex>
    
  </div>
</template>
