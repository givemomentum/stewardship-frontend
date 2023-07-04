<script lang="ts" setup>
  import { addDays } from "date-fns";
  import { marked } from "marked";
  import { useUserStore } from "~/apps/auth/useUserStore";
  import { CrmDonor } from "~/apps/letters/interfaces";
  import { TouchRec } from "~/apps/portfolios/interfaces";
  import { useNotify } from "~/composables/useNotify";

  const props = defineProps<{
    donor: CrmDonor;
    rec?: TouchRec;
  }>();

  const hooks = {
    userStore: useUserStore(),
    api: useApi(),
    notify: useNotify(),
  };

  const state = {
    emailContentHtml: ref(""),
    emailSubject: ref(""),
    emailCcList: ref(""),
    isFollowUp: ref(false),
    followUpDate: ref(addDays(new Date(), 7).toISOString().slice(0, 10)),
    followUpReason: ref(""),
    isSendingEmail: ref(false),
  };

  onMounted(() => {
    if (props.rec) {
      state.emailContentHtml.value = marked.parse(props.rec.email_content_md);
      state.emailSubject.value = props.rec.email_subject;
    }
  });

  // async function sendTestEmail() {
  //   if (!state.emailContentHtml.value) {
  //     hooks.notify.error("Email content is empty");
  //     return;
  //   }
  //   await hooks.api.post(`/emails-new/${state.emailOpen.value.pk}/send-test-email/`);
  //   hooks.notify.send(`Test emails sent to ${hooks.userStore.user.email}`);
  // }

  async function sendEmail() {
    state.isSendingEmail.value = true;

    await hooks.api.post(`/emails-new/${1}/send/`);
    hooks.notify.send(`Email sent`);

    // todo return to donor list and load the sent action

    state.isSendingEmail.value = false;
  }
</script>

<template>
  <CFlex
    pos="relative"
    direction="column"
    w="100%"
    mt="3"
    gap="6"
    flex="auto"
    align="flex-start"
  >
    <CHStack w="100%" gap="5">
      <CFlex gap="3px" w="100%" direction="column">
        <CFormLabel font-size="sm" color="gray.500">Subject</CFormLabel>
        <CInput
          v-model="state.emailSubject.value"
          :placeholder="`Hi ${props.donor.first_name}`"
          bg="white"
          name="subject"
          w="100%"
        />
      </CFlex>

      <CFlex
        gap="3px"
        w="100%"
        direction="column"
      >
        <CFormLabel font-size="sm" color="gray.500">CC</CFormLabel>
        <CInput
          v-model="state.emailCcList.value"
          bg="white"
          name="cc_list"
          placeholder="john@mail.com, max@mail.com"
          w="100%"
        />
      </CFlex>
    </CHStack>

    <CBox w="100%">
      <NuxtCkeditor
        v-model="state.emailContentHtml.value"
        :placeholder="`Hi ${props.donor.first_name}, how are you?`"
        height="lg"
      />
<!--      <CButton-->
<!--        @click="state.emailContentHtml.value = state.emailOpen.value.content_html_default"-->
<!--        v-tooltip="{-->
<!--          content: 'Reset to the default template',-->
<!--          placement: 'top',-->
<!--        }"-->
<!--        size="sm"-->
<!--        variant="outline"-->
<!--        pos="absolute"-->
<!--        bottom="5"-->
<!--        right="18px"-->
<!--        bg="white"-->
<!--        z-index="toast"-->
<!--        color-scheme="gray"-->
<!--      >-->
<!--        Revert-->
<!--      </CButton>-->
    </CBox>

    <CVStack gap="1" w="100%">

      <CCheckbox v-model="state.isFollowUp.value" alignItems="center" display="flex">
        Follow up reminder
      </CCheckbox>

      <CBox v-if="state.isFollowUp.value">
        <CInput type="date" v-model="state.followUpDate.value" w="fit-content" />
      </CBox>

      <CBox v-if="state.isFollowUp.value">
        <NuxtCkeditor
          v-model="state.followUpReason.value"
          placeholder="Notes for the follow up (optional)"
        />
      </CBox>
    </CVStack>

    <CFlex :gap="{ base: 4, '2xl': 5 }">
      <PFormSkip
        v-if="props.rec"
        :rec="props.rec"
      />

<!--      <CTooltip-->
<!--        :label="`Send a test email with this content to ${hooks.userStore.user.email}`"-->
<!--      >-->
<!--        <CButton-->
<!--          @click="sendTestEmail()"-->
<!--          variant="outline"-->
<!--          left-icon="ri-mail-send-line"-->
<!--          size="lg"-->
<!--          border-radius="lg"-->
<!--          color-scheme="gray"-->
<!--        >-->
<!--          Test-->
<!--        </CButton>-->
<!--      </CTooltip>-->

      <CButton
        @click="sendEmail()"
        :is-loading="state.isSendingEmail.value"
        size="lg"
        left-icon="ri-mail-send-line"
        fill="white"
      >
        Send email
      </CButton>
    </CFlex>
  </CFlex>
</template>
