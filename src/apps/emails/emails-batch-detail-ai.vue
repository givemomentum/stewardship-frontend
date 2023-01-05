<script setup lang="ts">
  import { onBeforeMount, onUnmounted, ref, watch } from "vue";
  import { POSITION, useToast } from "vue-toastification";
  import { useUserStore } from "~/apps/auth/useUserStore";
  import { EmailBatch, Email, PromptOutput } from "~/apps/emails/interfaces";
  import { useEmailBatchStore } from "~/apps/emails/useEmailBatchStore";
  import { format } from "~/utils";

  const props = defineProps<{ email: Email; }>();
  

  const hooks = {
    userStore: useUserStore(),
    api: useApi(),
    toast: useToast(),
    batchStore: useEmailBatchStore(),
  };

  const state = {
    prompt: ref(""),
    isLoading: ref(false),
  };
  
  const drawerScrollableEl = ref<HTMLElement | null>(null);

  const emit = defineEmits<{
    (event: 'drawerClosed');
    (event: 'emailPromptOutputCreated', promptOutput: PromptOutput);
    (event: 'emailContentUpdated', promptOutput: PromptOutput);
  }>();

  const comp = {
    promptExamples: [
      `Make it friendlier`,
      `Ask to share with their network`,
      `Ask about meeting for a cup of coffee or online chat`,
    ]
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
  <ChakraDrawer
    :model-value="true"
    @update:modelValue="emit('drawerClosed')"
    ref="drawerScrollableEl"
  >
    <CVStack p="5" spacing="4">

      <CVStack spacing="3">
        <CVStack
          v-for="promptOutput in props.email.prompt_outputs"
          :key="promptOutput.pk +1"
          spacing="3"
        >
          <CBox v-if="promptOutput.prompt">
            <CBox bg="white" border-radius="md" p="3" py="2" spacing="0">
              <CFlex align="center" justify="space-between">
                <CText color="gray.500">{{ hooks.userStore.user.first_name }}</CText>
                <CText mt="1" color="gray.400" font-size="xs" text-align="right">
                  {{ format.dateAgo(promptOutput.created_at) }}
                </CText>
              </CFlex>
              <CText v-html="promptOutput.prompt" />
            </CBox>
            
          </CBox>
          
          <CBox bg="white" border-radius="lg" p="4" spacing="0">
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
                  :key="promptOutput.pk + isPromptOutputSelected(promptOutput)"
                >
                  {{ isPromptOutputSelected(promptOutput) ? 'Current' : 'Accept' }}
                </CButton>
                <CButton
                  @click="emit('emailContentUpdated', promptOutput.output); emit('drawerClosed')"
                  variant="outline"
                  size="sm"
                  height="6"
                  color-scheme="gray"
                  color="gray.400"
                  key="1"
                >
                  Accept & close
                </CButton>
              </CFlex>
            </CFlex>
            <CText v-html="promptOutput.output" />
          </CBox>
        </CVStack>
      </CVStack>

      <CFlex gap="4">
        <CButton
          v-for="prompt in comp.promptExamples"
          :key="prompt"
          @click="state.prompt.value = prompt; submitPrompt()"
          variant="outline"
          size="sm"
          bg="white"
          border-color="gray.300"
        >
          {{ prompt  }}
        </CButton>
      </CFlex>

      <CFlex
        w="100%"
        direction="column"
        gap="4"
        align="flex-end"
        key="3"
      >
        <NuxtCkeditor v-model="state.prompt.value" />
        <CButton
          :is-loading="state.isLoading.value"
          @click="submitPrompt()"
          w="fit-content"
        >
          Submit
        </CButton>
      </CFlex>

    </CVStack>
  </ChakraDrawer>
</template>

<style lang="scss" scoped>
  :deep(blockquote) {
    background: white;
    padding: var(--space-5);
    border-radius: var(--radii-md);
    border: 1px solid;
    border-color: var(--colors-gray-100);
  }
  
    
  :deep(p:not(:first-child)) {
    margin-top: 1em;
  }
</style>
