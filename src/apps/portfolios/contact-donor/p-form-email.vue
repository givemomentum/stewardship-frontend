<script lang="ts" setup>
  import { captureException } from "@sentry/vue";
  import { AxiosResponse } from "axios";
  import { addDays } from "date-fns";
  import { marked } from "marked";
  import { useUserStore } from "~/apps/auth/useUserStore";
  import { CrmDonor } from "~/apps/letters/interfaces";
  import { TouchRec } from "~/apps/portfolios/interfaces";
  import { useAlgolia } from "~/apps/portfolios/useAlgolia";
  import { usePlanDonorLoader } from "~/apps/portfolios/usePlanDonorLoader";
  import { useNotify } from "~/composables/useNotify";
  import { urls } from "~/urls";

  const props = defineProps<{
    donor: CrmDonor;
    rec?: TouchRec;
  }>();

  const hooks = {
    userStore: useUserStore(),
    api: useApi(),
    notify: useNotify(),
    loader: usePlanDonorLoader(props.donor.id),
    algolia: useAlgolia(),
  };

  const state = {
    emailContentHtml: ref(""),
    emailSubject: ref(""),
    // emailCcList: ref(""),
    isScheduleNextRec: ref(false),
    scheduleForDate: ref(addDays(new Date(), 7).toISOString().slice(0, 10)),
    scheduleForReason: ref(""),
    isFollowUp: ref(false),
    isSendingEmail: ref(false),
  };

  watch(() => props.rec, () => {
    if (props.rec) {
      state.emailContentHtml.value = marked.parse(props.rec.email_content_md);
      state.emailSubject.value = props.rec.email_subject;
    }
  }, { immediate: true });

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

    let res: AxiosResponse<TouchRec | null>;
    try {
      res = await hooks.api.post(
        `/portfolios/${hooks.loader.plan.value.id}/donors/${props.donor.id}/send-email`,
        {
          subject: state.emailSubject.value,
          content_html: state.emailContentHtml.value,
          // cc_list: state.emailCcList.value.replace(/\s/g, "").split(","),
          rec_id: props.rec?.id,
          next_rec_scheduled_for: state.isScheduleNextRec.value ? state.scheduleForDate.value : null,
          next_rec_scheduled_for_reason: state.isScheduleNextRec.value ? state.scheduleForReason.value : null,
          is_follow_up_needed: state.isFollowUp.value,
        }
      );
    } catch (error) {
      captureException(error);
      console.log(error);
      hooks.notify.error("Email sending failed, our team has been notified");
      return;
    } finally {
      state.isSendingEmail.value = false;
    }

    if (state.isScheduleNextRec.value && state.isFollowUp.value) {
      hooks.notify.send(`Email sent and next touch scheduled for ${state.scheduleForDate.value}, and a follow up in a week enabled`);
    } else if (state.isScheduleNextRec.value) {
      hooks.notify.send(`Email sent and next touch scheduled for ${state.scheduleForDate.value}`);
    } else {
      hooks.notify.send(`Email sent`);
    }

    const isNextRecExists = Boolean(res.data);

    hooks.algolia.reloadPortfolio();
    if (isNextRecExists) {
      const recNext: TouchRec = res.data;
      navigateTo(urls.portfolios.contactDonor(
        hooks.loader.plan.value.id,
        recNext.donor.id,
        recNext.id,
      ));
    } else {
      navigateTo(urls.portfolios.portfolio(hooks.loader.plan.value.id));
    }
  }
</script>

<template>
  <CFlex
    pos="relative"
    direction="column"
    w="100%"
    mt="3"
    gap="5"
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

<!--      <CFlex-->
<!--        gap="3px"-->
<!--        w="100%"-->
<!--        direction="column"-->
<!--      >-->
<!--        <CFormLabel font-size="sm" color="gray.500">CC</CFormLabel>-->
<!--        <CInput-->
<!--          v-model="state.emailCcList.value"-->
<!--          bg="white"-->
<!--          name="cc_list"-->
<!--          placeholder="john@mail.com, max@mail.com"-->
<!--          w="100%"-->
<!--        />-->
<!--      </CFlex>-->
    </CHStack>

    <CBox w="100%">
      <CFormLabel font-size="sm" color="gray.500">Body</CFormLabel>

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

    <CVStack w="100%">

      <CCheckbox v-model="state.isScheduleNextRec.value" alignItems="center" display="flex">
        Schedule next touch
      </CCheckbox>

      <CVStack v-if="state.isScheduleNextRec.value">
        <CText color="gray.500" font-size="sm">We won't recommend this donor until this date</CText>
        <CInput type="date" v-model="state.scheduleForDate.value" w="fit-content" />
      </CVStack>

      <CCheckbox v-model="state.isFollowUp.value" alignItems="center" display="flex">
        Follow up in a week if no response
        <CTooltip label="You'll receive a reminder with a pre-drafted friendly follow-up email" text-align="center">
          <CIcon name="help" />
        </CTooltip>
      </CCheckbox>
    </CVStack>

    <CFlex :gap="{ base: 4, '2xl': 5 }">
      <CButton
        @click="sendEmail()"
        :is-loading="state.isSendingEmail.value"
        size="lg"
        left-icon="ri-mail-send-line"
        fill="white"
      >
        Send email
      </CButton>

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
    </CFlex>
  </CFlex>
</template>
