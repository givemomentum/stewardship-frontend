<script setup lang="ts">
  import { ref } from "vue";
  import { useToast } from "vue-toastification";
  import { useUserStore } from "~/apps/auth/useUserStore";
  import { Email, PromptOutput } from "~/apps/tasks/recs/interfaces";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { format } from "~/utils";

  const props = defineProps<{
    email: Email;
    emailContentHtml: string;
  }>();

  const hooks = {
    userStore: useUserStore(),
    api: useApi(),
    toast: useToast(),
    tasks: useTaskListStore(),
  };

  const state = {
    prompt: ref(""),
    isLoading: ref(false),
    chatSocket: ref(null),
    promptOutputs: ref([] as PromptOutput[]),
  };

  const emit = defineEmits<{
    (event: "emailPromptOutputCreated", promptOutput: PromptOutput[]);
    (event: "emailContentUpdated", promptOutput: PromptOutput);
  }>();

  const comp = {
    promptExamples: [
      `Make it friendlier`,
      `Ask to share with their network`,
      `Ask about meeting for a cup of coffee`,
    ],
  };

  watch(() => props.email, async () => {
    const outputsRes = await hooks.api.get(`/ai/prompt-outputs/?email=${props.email.pk}`);
    state.promptOutputs.value = outputsRes.data;
    hooks.tasks.recOpened.value.email.prompt_outputs = outputsRes.data;

    state.chatSocket.value = new WebSocket("wss://stewardship-prod-web-ai.onrender.com/ai-ws");

    state.chatSocket.value.addEventListener("message", function (event) {
      const word = event.data;
      const lastPromptOutput = state.promptOutputs.value[state.promptOutputs.value.length - 1];
      if (word === "[[END]]") {
        state.isLoading.value = false;
        emit("emailPromptOutputCreated", state.promptOutputs.value);
        hooks.api.patch(`/ai/prompt-outputs/${lastPromptOutput.pk}/`, {
          output: lastPromptOutput.output,
        });
      } else {
        lastPromptOutput.output += word;
      }
    });
  }, { immediate: true });

  async function submitPrompt() {
    if (state.prompt.value === "") {
      return;
    }

    state.isLoading.value = true;

    const res = await hooks.api.post(`/ai/prompt-outputs/`, {
      email: props.email.pk,
      prompt: state.prompt.value,
    });
    state.promptOutputs.value = res.data.history;

    state.chatSocket.value.send(res.data.history_raw);
    state.prompt.value = "";
  }

  function isPromptOutputSelected(po: PromptOutput): boolean {
    return props.email.content_html.length && props.email.content_html.valueOf() === po.output.valueOf();
  }
</script>

<template>
  <CVStack spacing="6" w="100%">

    <CFlex align="center" key="2" gap="2">
      <CIcon name="bi-magic" size="7" fill="teal.500" />
      <chakra.span font-size="1.75rem" mt="0">AI Assistant</chakra.span>
    </CFlex>

    <CVStack spacing="6" v-if="state.promptOutputs.value?.length">
      <CVStack
        v-for="promptOutput in state.promptOutputs.value ?? []"
        :key="promptOutput.pk"
        spacing="6"
      >
        <CFlex
          direction="column"
          v-if="promptOutput.prompt"
          p="3"
          px="4"
          bg="gray.50"
          border-radius="lg"
          gap="3"
        >
          <CFlex justify="space-between" align="center">
            <CText color="gray.500">{{ hooks.userStore.user.first_name }}</CText>
            <CText color="gray.400" font-size="xs" text-align="right">
              {{ format.dateAgo(promptOutput.created_at) }}
            </CText>
          </CFlex>
          <CBox
            class="chat-response"
            v-html="promptOutput.prompt"
          />
        </CFlex>

        <CFlex
          direction="column"
          p="3"
          px="4"
          bg="gray.50"
          border-radius="lg"
          gap="3"
        >
          <CFlex justify="space-between" align="center">
            <CText color="gray.500">Ask Stewart</CText>
            <CFlex gap="2">
              <CButton
                @click="emit('emailContentUpdated', promptOutput.output)"
                :variant="isPromptOutputSelected(promptOutput) ? 'solid' : 'outline'"
                size="sm"
                height="6"
                :color-scheme="isPromptOutputSelected(promptOutput) ? 'teal' : 'gray'"
                :color="isPromptOutputSelected(promptOutput) ? 'white' : 'gray.400'"
                :bg="isPromptOutputSelected(promptOutput) ? 'teal.500' : 'white'"
                :key="promptOutput.pk + isPromptOutputSelected(promptOutput)"
              >
                {{ isPromptOutputSelected(promptOutput) ? 'Current' : 'Accept' }}
              </CButton>
            </CFlex>
          </CFlex>
          <CBox
            class="chat-response"
            v-html="promptOutput.output"
          />
        </CFlex>
      </CVStack>
    </CVStack>

    <CFlex
      v-if="!props.email.prompt_outputs?.length"
      gap="4"
      wrap="wrap"
      key="3"
    >
      <CButton
        v-for="prompt in comp.promptExamples"
        :key="prompt"
        @click="state.prompt.value = prompt + '.'; submitPrompt()"
        variant="outline"
        size="sm"
        bg="gray.100"
        border-color="gray.100"
        :_hover="{ bg: 'gray.200', border: 'gray.200' }"
        color-scheme="gray"
        border-radius="2xl"
        :font-size="{ base: 'xs', fullhd: 'md' }"
      >
        {{ prompt }}
      </CButton>
    </CFlex>

    <CFlex
      w="100%"
      direction="column"
      pb="24"
      gap="4"
      align="flex-end"
    >
      <NuxtCkeditor v-model="state.prompt.value" />
      <CButton
        :is-loading="state.isLoading.value"
        @click="submitPrompt()"
        w="fit-content"
        color-scheme="gray"
        variant="outline"
      >
        Submit
      </CButton>
    </CFlex>

  </CVStack>
</template>

<style lang="scss" scoped>
  :deep(blockquote) {
    background: white;
    padding: var(--chakra-space-5);
    border-radius: var(--chakra-radii-md);
    border: 1px solid;
    border-color: var(--chakra-colors-gray-100);
  }

  .chat-response {
    :deep(p:not(:first-child)) {
      margin-top: 1em;
    }
  }
</style>
