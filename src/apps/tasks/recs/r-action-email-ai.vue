<script setup lang="ts">
  import { ref } from "vue";
  import { useToast } from "vue-toastification";
  import { useUserStore } from "~/apps/auth/useUserStore";
  import { Email, PromptOutput } from "~/apps/emails/interfaces";
  import { useEmailBatchStore } from "~/apps/emails/useEmailBatchStore";
  import { format } from "~/utils";

  const props = defineProps<{ email: Email; }>();

  const hooks = {
    userStore: useUserStore(),
    api: useApi(),
    toast: useToast(),
  };

  const state = {
    prompt: ref(""),
    isLoading: ref(false),
  };

  const emit = defineEmits<{
    (event: "emailPromptOutputCreated", promptOutput: PromptOutput);
    (event: "emailContentUpdated", promptOutput: PromptOutput);
  }>();

  const comp = {
    promptExamples: [
      `Make it friendlier`,
      `Ask to share with their network`,
      `Ask about meeting for a cup of coffee`,
    ],
  };

  async function submitPrompt() {
    if (state.prompt.value === "") {
      return;
    }

    state.isLoading.value = true;
    if (comp.promptExamples.find(eg => eg.valueOf() === state.prompt.value.valueOf())) {
      state.prompt.value += ".";
    }
    const res = await hooks.api.post("/ai/prompt-outputs/", {
      email: props.email.pk,
      prompt: state.prompt.value,
    });
    state.prompt.value = "";

    emit("emailPromptOutputCreated", res.data);

    state.isLoading.value = false;
  }

  function isPromptOutputSelected(po: PromptOutput): boolean {
    return props.email.content_html.valueOf() === po.output.valueOf();
  }
</script>

<template>
  <CVStack spacing="6" w="100%">

    <CFlex align="center" key="2" gap="2">
      <CIcon name="bi-magic" size="7" fill="teal.500" />
      <chakra.span font-size="1.75rem" mt="0">AI Assistant</chakra.span>
    </CFlex>

    <CVStack spacing="6" v-if="props.email.prompt_outputs?.length">
      <CVStack
        v-for="promptOutput in props.email.prompt_outputs ?? []"
        :key="promptOutput.pk + 1"
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
            <CText color="gray.500">Momentum AI</CText>
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

    <CFlex gap="4" v-if="!props.email.prompt_outputs?.length">
      <CButton
        v-for="prompt in comp.promptExamples"
        :key="prompt"
        @click="state.prompt.value = prompt; submitPrompt()"
        variant="outline"
        size="sm"
        bg="gray.100"
        border-color="gray.100"
        :_hover="{ bg: 'gray.200', border: 'gray.200' }"
        color-scheme="gray"
        border-radius="2xl"
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
