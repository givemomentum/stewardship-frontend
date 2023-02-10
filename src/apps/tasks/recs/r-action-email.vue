<script lang="ts" setup>
  import { ref, watch } from "vue";
  import { debounce } from "vue-debounce";
  import { useUserStore } from "~/apps/auth/useUserStore";
  import { Email, PromptOutput } from "~/apps/emails/interfaces";
  import { Recommendation } from "~/apps/tasks/interfaces";
  import RRecSkipBtn from "~/apps/tasks/recs/r-btn-skip.vue";
  import { useRecNav } from "~/apps/tasks/recs/useRecNav";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { useNotify } from "~/composables/useNotify";
  import RRecActionEmailAi from "~/apps/tasks/recs/r-action-email-ai.vue";

  const props = defineProps<{
    rec: Recommendation;
  }>();

  const hooks = {
    userStore: useUserStore(),
    api: useApi(),
    notify: useNotify(),
    taskListStore: useTaskListStore(),
    nav: useRecNav(),
  };

  const state = {
    emailContentHtml: ref(""),
    emailSubject: ref(""),
    emailCcList: ref(""),
    isSavingChanges: ref(false),
    isSendingEmail: ref(false),
    isEmailAiOpen: ref(false),

    emailOpen: ref<Email | null>(null),
    emailOpenIndex: ref<number | null>(null),
    emailEditorKey: ref<any>(null),
  };

  onMounted(async () => {
    const outputsRes = await hooks.api.get(`/ai/prompt-outputs/?email=${props.rec.email.pk}`);
    hooks.taskListStore.recOpened.value.email.prompt_outputs = outputsRes.data;
    
    handleTinyEditorLoadingBug();
  });

  const comp = {
    isEmailSent: computed(() => props.rec.email.status === "sent"),
  };

  watch(() => props.rec, async recNew => {
    state.emailOpen.value = recNew.email;
    state.emailEditorKey.value = recNew.email.pk;
    state.emailContentHtml.value = recNew.email.content_html || (recNew.email.content_html_default ?? "");
    state.emailSubject.value = recNew.email.subject || hooks.taskListStore.taskOpened.value?.rec_set.rule?.email_template?.subject;
    state.emailCcList.value = recNew.email.cc_list;
  }, { immediate: true });

  const debouncedSave = debounce(saveEmailChanges, 1500);
  watch(
    () => ({
      content_html: state.emailContentHtml.value,
      subject: state.emailSubject.value,
      cc_list: state.emailCcList.value,
    }),
    async (email, _, onInvalidate) => {

      const stop = watchEffect(async () => {
        if (isEmailChanged()) {
          await debouncedSave();
        }
      });

      onInvalidate(() => {
        stop();
      });
    },
  );

  async function saveEmailChanges() {
    state.isSavingChanges.value = true;
    await hooks.api.patch(
      `/emails/${state.emailOpen.value.pk}/`,
      {
        content_html: state.emailContentHtml.value,
        subject: state.emailSubject.value,
        cc_list: state.emailCcList.value,
      },
    );
    state.emailOpen.value.content_html = state.emailContentHtml.value;
    state.emailOpen.value.subject = state.emailSubject.value;
    state.emailOpen.value.cc_list = state.emailCcList.value;
    state.isSavingChanges.value = false;
  }

  function isEmailChanged(): boolean {
    // todo when we update emailContentHtml.value in watch() above this doesn't get recalculated. since the code isn't in <template>?
    const htmlOriginal = state.emailOpen.value?.content_html || state.emailOpen.value?.content_html_default;
    const subjectOriginal = state.emailOpen.value?.subject || props.rec.email.template?.subject;
    return (
      state.emailContentHtml.value?.valueOf() !== htmlOriginal?.valueOf()
      || state.emailSubject.value?.valueOf() !== subjectOriginal?.valueOf()
      || state.emailCcList.value?.valueOf() !== state.emailOpen.value?.cc_list.valueOf()
    );
  }

  async function sendTestEmail() {
    await hooks.api.post(`/emails/${state.emailOpen.value.pk}/send-test-email/`);
    hooks.notify.send(`Test emails sent to ${hooks.userStore.user.email}`);
  }

  async function sendEmail() {
    state.isSendingEmail.value = true;
    await hooks.api.post(`/emails/${state.emailOpen.value.pk}/send/`);
    hooks.notify.send(`Email sent`);
    state.emailOpen.value.status = "sent";
    hooks.taskListStore.recOpened.value.state = "completed";
    hooks.taskListStore.recOpened.value.action_description = state.emailContentHtml.value;
    hooks.taskListStore.recOpened.value.action_type = "email";
    state.isSendingEmail.value = false;
    
    hooks.nav.navigateToRecNext();
  }

  function getStatusStyle(email: Email) {
    switch (email.status) {
    case "pending":
      return { color: "gray.800", bg: "gray.100" };
    case "sent":
      return { color: "teal.800", bg: "teal.100" };
    case "excluded":
      return { color: "orange.800", bg: "orange.100" };
    case "opened":
      return { color: "green.800", bg: "green.100" };
    case "bounced":
      return { color: "red.800", bg: "red.100" };
    case "failed":
      return { color: "red.800", bg: "red.100" };
    }
  }

  async function updateEmailPromptOutputs(promptOutput: PromptOutput) {
    state.emailOpen.value.prompt_outputs.push(promptOutput);
  }

  async function updateEmailContentFromAI(promptOutputString: string) {
    state.emailContentHtml.value = promptOutputString;
    await saveEmailChanges();
  }

  async function handleTinyEditorLoadingBug() {
    // wait for Vue to render the editor
    while (true) {
      const tinyContainer = document.querySelector(".tiny-container");
      if (tinyContainer) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 60));
    }

    while (true) {
      const tinyIframe = document.querySelector(".tiny-container iframe");
      if (tinyIframe) {
        break;
      }

      // force rerender the editor until it renders itself
      // otherwise fails. Most likely a bug on the tiny editor side
      state.emailEditorKey.value += Math.random();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
</script>

<template>
  <CFlex
    mt="3"
    pos="relative"
    direction="column"
    w="100%"
    gap="7"
    flex="auto"
    align="flex-end"
  >
    <CHStack w="100%" gap="5">
      <CFlex gap="3px" w="100%" direction="column">
        <CFormLabel font-size="sm" color="gray.500">Subject</CFormLabel>
        <CInput
          v-if="!comp.isEmailSent.value"
          v-model="state.emailSubject.value"
          bg="white"
          name="subject"
          w="100%"
        />
        <CBox
          v-else
          p="2"
          px="4"
          w="100%"
          border="1px solid"
          border-color="gray.200"
          border-radius="lg"
        >
          {{ state.emailSubject.value }}
        </CBox>
      </CFlex>

      <CFlex
        v-if="!comp.isEmailSent.value || state.emailCcList.value"
        gap="3px"
        w="100%"
        direction="column"
      >
        <CFormLabel font-size="sm" color="gray.500">CC</CFormLabel>
        <CInput
          v-model="state.emailCcList.value"
          :is-read-only="comp.isEmailSent.value"
          bg="white"
          name="cc_list"
          :placeholder="comp.isEmailSent.value ? '' : 'john@mail.com, max@mail.com'"
          w="100%"
        />
      </CFlex>
    </CHStack>

    <CBox class="tiny-container" w="100%" z-index="0" pos="relative">
      <TinyMce
        :key="state.emailEditorKey.value"
        v-model="state.emailContentHtml.value"
        padding="1rem"
        :is-show-menu-bar="false"
        :is-read-only="comp.isEmailSent.value"
        :is-show-toolbar="comp.isEmailSent.value"
        min-height="200"
      />

      <CButton
        v-if="!comp.isEmailSent.value"
        @click="state.emailContentHtml.value = state.emailOpen.value.content_html_default; saveEmailChanges()"
        v-tooltip="{
          content: 'Reset to the default template',
          placement: 'top',
        }"
        size="sm"
        variant="outline"
        pos="absolute"
        bottom="5"
        right="18px"
        bg="white"
        z-index="toast" 
        color-scheme="gray"
      >
        Revert
      </CButton>
    </CBox>

    <CFlex gap="4" v-if="comp.isEmailSent.value">
      <CAlert variant="left-accent" status="success" font-size="lg" pr="6" pl="5">
        <CAlertIcon />
        Email sent
      </CAlert>
    </CFlex>

    <CFlex gap="4" v-else>
      <CButton
        :is-loading="state.isSavingChanges.value"
        z-index="toast"
        border-radius="lg"
        :opacity="state.isSavingChanges.value ? 1 : 0"
        transition="opacity 0.1s"
        variant="outline"
      >
        Saved
      </CButton>

      <RRecSkipBtn :rec="props.rec" />

      <VTooltip>
        <div>
          <CButton
            @click="sendTestEmail()"
            variant="outline"
            z-index="toast"
            left-icon="ri-mail-send-line"
            border-radius="lg"
            color-scheme="gray"
          >
            Test
          </CButton>
        </div>

        <template v-slot:popper>
          <CText font-size="xs">Send a test email with this content to {{ hooks.userStore.user.email }}</CText>
        </template>
      </VTooltip>

      <CButton
        @click="sendEmail()"
        :is-loading="state.isSendingEmail.value"
        left-icon="ri-mail-send-line"
        fill="white"
      >
        Send
      </CButton>
    </CFlex>

    <RRecActionEmailAi
      v-if="!comp.isEmailSent.value"
      @email-prompt-output-created="(promptOutput) => updateEmailPromptOutputs(promptOutput)"
      @email-content-updated="(promptOutput) => updateEmailContentFromAI(promptOutput)"
      :email="state.emailOpen.value"
    />

    <!--  for preloading & caching external mce js files, otherwise it takes a while  -->
    <CBox visibility="hidden" style="display: none">
      <TinyMce padding="1rem" />
    </CBox>
  </CFlex>
</template>