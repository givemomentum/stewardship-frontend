<script lang="ts" setup>
  import { useRuntimeConfig } from "#app";
  import { captureEvent } from "@sentry/hub";
  import { ref } from "vue";
  import JobCommentChild from "~/apps/tasks/task-comment-child.vue";
  import JobCommentForm from "~/apps/tasks/task-comment-form.vue";
  import { useApi } from "~/composables/useApi";
  import { Comment, Task } from "~/apps/tasks/interfaces";

  const props = defineProps<{ task: Task }>();

  const hooks = {
    config: useRuntimeConfig(),
    api: useApi(),
  };

  const state = {
    comments: ref(props.task.comments.filter(comment => comment.parent === null)),
    isNoComments: ref(true),
  };

  async function loadComments() {
    try {
      const res = await hooks.api.get(`${hooks.config.public.apiBase}/comments/?task=${props.task.pk}`);
      const commentsRaw: Comment[] = res.data;
      state.comments.value = commentsRaw.filter(comment => comment.parent === null);
    } catch (err) {
      captureEvent(err);
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
        :task-pk="props.task.pk"
        :comment="comment"
        @comment-posted="loadComments()"
      />

      <CBox
        v-if="comment.children"
        v-for="commentChild1 in comment.children"
        :key="commentChild1.pk"
        ml="12"
      >

        <JobCommentChild
          :task-pk="props.task.pk"
          :comment="commentChild1"
          @comment-posted="loadComments()"
        />

        <CBox
          v-if="commentChild1.children"
          v-for="commentChild2 in commentChild1.children"
          :key="commentChild2.pk"
          ml="12"
        >
          <JobCommentChild
            :task-pk="props.task.pk"
            :comment="commentChild2"
            :is-last-thread-level="true"
            @comment-posted="loadComments()"
          />
        </CBox>

      </CBox>

    </CBox>

    <CFlex gap="4" direction="column">
      <CText
        :mt="state.comments.value?.length ? 6 : 1"
        font-size="lg"
        line-height="1"
      >
        Leave a comment
      </CText>
      <JobCommentForm
        :task-pk="props.task.pk"
        @comment-posted="loadComments()"
      />
    </CFlex>

  </div>
</template>
