<script setup lang="ts">
  import { onBeforeMount, onUnmounted, ref, watch } from "vue";
  import { POSITION, useToast } from "vue-toastification";
  import { useUserStore } from "~/apps/auth/useUserStore";
  import { EmailBatch, Email, PromptOutput } from "~/apps/emails/interfaces";
  import { useEmailBatchStore } from "~/apps/emails/useEmailBatchStore";
  import { useLeftMenu } from "~/apps/menu/useLeftMenu";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { format } from "~/utils";
  import { urls } from "~/urls";

  const props = defineProps<{ batchPk: number; isViewOnly?: boolean; }>();

  const hooks = {
    userStore: useUserStore(),
    api: useApi(),
    menu: useLeftMenu(),
    toast: useToast(),
    batchStore: useEmailBatchStore(),
    taskStore: useTaskListStore(),
  };

  const state = {
    batch: ref<EmailBatch>(null),
    emails: ref<Email[]>([]),
    emailContentHtml: ref(""),
    emailSubject: ref(""),
    emailCcList: ref(""),
    isSavingChanges: ref(false),

    emailOpen: ref<Email | null>(null),
    emailOpenIndex: ref<number | null>(null),
    isEmailAiOpen: ref(false),
  };

  onBeforeMount(async () => {
    hooks.menu.collapse();
    document.addEventListener("keydown", handleKeyUp);
  });

  onMounted(async () => {
    const resEmails = await hooks.api.get(`/emails/?batch=${props.batchPk}`);
    state.emails.value = resEmails.data;

    const res = await hooks.api.get(`/emails/batches/${props.batchPk}/`);
    state.batch.value = res.data;

    if (state.emails.value.length > 0 && state.emailOpen.value === null) {
      // state.batch.value contains donor info, let it render the data first
      // so that `scrollHeight` is accurate. onUpdated doesn't quite work.
      setTimeout(() => {
        state.emailOpen.value = state.emails.value[0];
        state.emailOpenIndex.value = 0;
      }, 200);
    }
    
    const outputsRes = await hooks.api.get(`/ai/prompt-outputs/`);
    for (const email of state.emails.value) {
      email.prompt_outputs = outputsRes.data.filter(
        (output: PromptOutput) => output.email === email.pk
      );
    }
  });

  async function updateEmailPromptOutputs(promptOutput: PromptOutput) {
    state.emailOpen.value.prompt_outputs.push(promptOutput);
  }

  async function updateEmailContentFromAI(promptOutputString: string) {
    state.emailContentHtml.value = promptOutputString;
    await saveEmailChanges();
  }

  onUnmounted(() => {
    hooks.menu.unfold();
    document.removeEventListener("keydown", handleKeyUp);
  });

  const comp = {
    isPending: computed(() => state.batch.value?.status !== "sent"),
    batchGlobal: computed(() => hooks.batchStore.list.value.find(batch => props.batchPk === batch.pk)),
    rowHeight: 46,
  };

  // outside of state as referred as a string
  const tableRowRefs = ref([]);

  watch(state.emailOpen, async emailNew => {
    state.emailContentHtml.value = emailNew.content_html || (emailNew.content_html_default ?? "");
    state.emailSubject.value = emailNew.subject || state.batch.value.template.subject;
    state.emailCcList.value = emailNew.cc_list;

    if (!emailNew.is_viewed) {
      await toggleViewedStatus(emailNew);
    }

    updateDonorInfoRowHeight();
  });

  function updateDonorInfoRowHeight() {
    tableRowRefs.value.forEach(ref => ref.style.height = "0");
    const tableRowOpen = tableRowRefs.value[state.emailOpenIndex.value];
    const container: HTMLDivElement = tableRowOpen.querySelector(".email-table-inner-donor-table-container");
    tableRowOpen.style.height = `${container.scrollHeight + comp.rowHeight}px`;
  }

  function isBatchSent(): boolean {
    return state.batch.value?.status === "sent";
  }

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
    state.isSavingChanges.value = false;
    hooks.toast.success(
      "Email saved",
      { position: POSITION.TOP_RIGHT, timeout: 1500, pauseOnFocusLoss: false, hideProgressBar: true }
    );
    state.emailOpen.value.content_html = state.emailContentHtml.value;
    state.emailOpen.value.subject = state.emailSubject.value;
    state.emailOpen.value.cc_list = state.emailCcList.value;
  }

  async function toggleViewedStatus(email: Email) {
    const isViewed = !email.is_viewed;
    await hooks.api.patch(`/emails/${email.pk}/`, { is_viewed: isViewed });
    email.is_viewed = isViewed;
    comp.batchGlobal.value.emails_unviewed_count += isViewed ? -1 : +1;
  }

  async function toggleEmailExclusion(email: Email) {
    const isExcludedFlipped = !email.is_excluded;
    await hooks.api.patch(`/emails/${email.pk}/`, { is_excluded: isExcludedFlipped });
    email.is_excluded = isExcludedFlipped;
  }

  async function sendTestEmail(email: Email) {
    await hooks.api.post(`/emails/${email.pk}/send-test-email/`);
    await hooks.toast.success(
      `Test emails sent to ${hooks.userStore.user.email}`,
    );
  }

  async function sendEmailBatch() {
    await hooks.api.post(`/emails/batches/${props.batchPk}/send/`);
    state.batch.value.status = "sent";
    hooks.toast.success("Email batch sent", { position: POSITION.TOP_RIGHT });
    hooks.taskStore.loadTaskRecs();
    navigateTo(urls.emails.batches.list);
  }

  function handleKeyUp(event: KeyboardEvent) {
    const isEditingInputTextWithArrows = (event.target as any).tagName === "INPUT";
    if (isEditingInputTextWithArrows) {
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      changeOpenItemIndex(-1);
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      changeOpenItemIndex(+1);
    }
  }

  function changeOpenItemIndex(change: -1 | 1) {
    const emailIndexNew = state.emailOpenIndex.value + change;
    const emailNew = state.emails.value[emailIndexNew];
    if (emailNew) {
      state.emailOpen.value = emailNew;
      state.emailOpenIndex.value = emailIndexNew;
      // doesn't work wo setTimeout, prob a Vue render issue
      setTimeout(() => {
        tableRowRefs.value[emailIndexNew].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 0);
    }
  }

  function isSelected(email: Email): boolean {
    return email.pk === state.emailOpen.value?.pk;
  }

  function isEmailChanged(): boolean {
    // todo when we update emailContentHtml.value in watch() above this doesn't get recalculated. since the code isn't in <template>?
    const htmlOriginal = state.emailOpen.value.content_html || state.emailOpen.value.content_html_default;
    const subjectOriginal = state.emailOpen.value.subject || state.batch.value?.template?.subject;
    return (
      state.emailContentHtml.value.valueOf() !== htmlOriginal.valueOf()
      || state.emailSubject.value?.valueOf() !== subjectOriginal?.valueOf()
      || state.emailCcList.value?.valueOf() !== state.emailOpen.value.cc_list.valueOf()
    );
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

</script>

<template>
  <CFlex gap="5" pb="8" h="100%" overflow="hidden">

    <CFlex direction="column" gap="7">
      <CFlex justify="space-between" :min-w="isBatchSent() ? '600' : 510" align="center">
        <CHeading variant="page-header">Review</CHeading>

        <CButton
          v-if="comp.isPending.value"
          @click="sendEmailBatch"
          left-icon="ri-mail-send-line"
          size="sm"
          key="2"
          fill="white"
          variant="solid"
        >
          Send batch
        </CButton>
      </CFlex>

      <CFlex h="fit-content">
        <ChakraTable size="sm" :min-w="isBatchSent() ? '500px' : '370px'" class="email-table" w="100%">
          <chakra.thead>
            <chakra.tr>
              <chakra.th>Donor</chakra.th>
              <chakra.th v-if="isBatchSent()">Status</chakra.th>
              <chakra.th v-if="isBatchSent()">Open count</chakra.th>
              <chakra.th v-if="isBatchSent()">Opened at</chakra.th>
              <chakra.th v-if="!isBatchSent()" data-is-numeric="true">Donated total</chakra.th>
              <chakra.th data-is-numeric="true">Modified</chakra.th>
              <chakra.th v-if="!isBatchSent()" data-is-numeric="true">Excluded</chakra.th>
            </chakra.tr>
          </chakra.thead>

          <chakra.tbody>
            <!-- <tr ref="{}"> must be assigned wo `state.{}` and on a native html elements -->
            <tr
              v-for="(email, emailIndex) in state.emails.value"
              ref="tableRowRefs"
              :key="email.pk"
              @click="state.emailOpen.value = email; state.emailOpenIndex.value = emailIndex;"
              :data-key="email.pk"
              :data-is-selected="isSelected(email)"
              :data-is-viewed="email.is_viewed"
              class="table-row"
            >
              <chakra.td v-if="email.rec.donor.name" pr="0 !important" white-space="nowrap">
                {{ email.rec.donor.name }}
              </chakra.td>
              <chakra.td v-else pr="0 !important" white-space="nowrap">
                Unknown
              </chakra.td>

              <chakra.td v-if="isBatchSent()">
                <CBox
                  py="2px"
                  px="2"
                  w="fit-content"
                  border-radius="lg"
                  text-transform="capitalize"
                  font-size="xs"
                  :bg="getStatusStyle(email).bg"
                  :color="getStatusStyle(email).color"
                >
                  {{ email.status }}
                </CBox>
              </chakra.td>

              <chakra.td v-if="isBatchSent()">
                {{ email.open_count || "" }}
              </chakra.td>

              <chakra.td v-if="isBatchSent()">
                {{ format.datetimeHumanShort(email.opened_first_at) }}
              </chakra.td>

              <chakra.td v-if="!isBatchSent()" data-is-numeric="true">
                {{ format.money(email.rec.donor.donated_total) }}
              </chakra.td>

              <chakra.td data-is-numeric="true">
                <CIcon v-if="email.content_html" name="check-square" mb="1" size="4" color="gray.500" />
              </chakra.td>

              <chakra.td v-if="!isBatchSent()" data-is-numeric="true">
                <VTooltip placement="right">
                  <div>
                    <ChakraCheckbox
                      :model-value="email.is_excluded"
                      @click.stop="toggleEmailExclusion(email)"
                    />
                  </div>
                  <template v-slot:popper>
                    <CText font-size="xs" v-if="email.is_excluded">Include this email in the sending batch</CText>
                    <CText font-size="xs" v-else>Exclude this email from sending</CText>
                  </template>
                </VTooltip>
              </chakra.td>

              <CFlex
                class="email-table-inner-donor-table-container"
                pos="absolute"
                :top="comp.rowHeight"
                bottom="0"
                left="0"
                direction="column"
                px="5"
                pb="5"
                w="100%"
                :opacity="isSelected(email) ? 1 : 0"
                :transition-duration="isSelected(email) ? '0.1s' : '0.05s'"
                :transition-delay="isSelected(email) ? '0.1s' : 'initial'"
                transition-timing-function="ease-in"
                font-size="sm"
              >
                <CFlex pos="relative">
                  <CFlex pos="absolute" right="0">
                    <CLink
                      v-if="email.rec.donor.crm_url"
                      :href="email.rec.donor.crm_url"
                      is-external
                      variant="none"
                    >
                      <CButton
                        mt="3"
                        size="xs"
                        variant="outline"
                        left-icon="external-link"
                        bg="white"
                      >
                        CRM profile
                      </CButton>
                    </CLink>
                  </CFlex>
                </CFlex>

                <chakra.table class="email-table-inner-donor-table" data-size="none">
                  <chakra.tbody>

                    <chakra.tr border-top="1px solid" border-color="gray.100">
                      <chakra.td>Email</chakra.td>
                      <chakra.td>{{ email.rec.donor.email }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr v-if="email.rec.donor.mailing_address.address_line1">
                      <chakra.td>Address</chakra.td>
                      <chakra.td white-space="break-spaces !important">
                        {{ email.rec.donor.mailing_address.address_line1.slice(0, 31) }},
                        {{ email.rec.donor.mailing_address.city }}
                      </chakra.td>
                    </chakra.tr>

                    <chakra.tr>
                      <chakra.td>First gift</chakra.td>
                      <chakra.td>{{ format.date(email.rec.donor.giving_since) || "-" }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr>
                      <chakra.td>Last gift</chakra.td>
                      <chakra.td>{{ format.money(email.rec.donor.last_gift_amount, 2) || "-" }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr>
                      <chakra.td>Last gift date</chakra.td>
                      <chakra.td>{{ format.date(email.rec.donor.last_gift_date) || "-" }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr>
                      <chakra.td>Last action</chakra.td>
                      <chakra.td>{{ format.date(email.rec.donor.last_contact) || "-" }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr
                      v-if="email.rec?.donor"
                      v-for="(data, fieldName) in email.rec.donor.custom_data"
                      :key="fieldName"
                    >
                      <chakra.td>{{ data["label"] }}</chakra.td>
                      <chakra.td white-space="break-spaces !important">{{ data["value"] }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr
                      v-if="email.rec?.gift"
                      v-for="(data, fieldName) in email.rec.gift.custom_data"
                      :key="fieldName"
                    >
                      <chakra.td>{{ data["label"] }}</chakra.td>
                      <chakra.td white-space="break-spaces !important">{{ data["value"] }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr v-if="email.rec?.explanation">
                      <chakra.td>Reason</chakra.td>
                      <chakra.td white-space="break-spaces !important">{{ email.rec?.explanation }}
                      </chakra.td>
                    </chakra.tr>
                  </chakra.tbody>
                </chakra.table>
              </CFlex>

            </tr>
          </chakra.tbody>
        </ChakraTable>
      </CFlex>

    </CFlex>

    <CFlex pos="relative" w="100%" h="100%">
      <CFlex
        v-if="state.emailOpen.value && state.emailContentHtml.value"
        direction="row"
        pos="fixed"
        top="-2px"
        p="8"
        pl="4"
        gap="8"
        max-h="100vh"
      >
        <CFlex
          pos="relative"
          direction="column"
          w="100%"
          gap="8"
          flex="auto"
          align="flex-end"
          key="3"
        >
          <CFlex gap="3" v-if="!isBatchSent()">
            <CButton
              @click="saveEmailChanges()"
              :is-loading="state.isSavingChanges.value"
              size="sm"
              z-index="toast"
              border-radius="lg"
              :opacity="isEmailChanged() ? 1 : 0"
              transition="opacity 0.2s"
            >
              Save changes
            </CButton>

            <CButton
              v-if="state.emailOpen.value?.prompt_outputs?.length"
              @click="state.isEmailAiOpen.value = true"
              variant="outline"
              size="sm"
              z-index="toast"
              left-icon="bi-magic"
              border-radius="lg"
              opacity="1"
              transition="opacity 0.2s"
              fill="blue.500"
            >
              AI Writer
            </CButton>

            <VTooltip>
              <div>
                <CButton
                  @click="sendTestEmail(state.emailOpen.value)"
                  variant="outline"
                  size="sm"
                  z-index="toast"
                  left-icon="ri-mail-send-line"
                  border-radius="lg"
                  opacity="1"
                  transition="opacity 0.2s"
                  fill="blue.500"
                >
                  Send test email
                </CButton>
              </div>

              <template v-slot:popper>
                <CText font-size="xs">Send this email to {{ hooks.userStore.user.email }}</CText>
              </template>
            </VTooltip>

            <CButton
              @click="toggleViewedStatus(state.emailOpen.value)"
              variant="outline"
              size="sm"
              z-index="toast"
              left-icon="md-markemailunread-outlined"
              fill="blue.500"
              border-radius="lg"
              opacity="1"
              transition="opacity 0.2s"
            >
              Mark unread
            </CButton>
          </CFlex>

          <CHStack w="100%" gap="5">
            <CFlex gap="3px" w="100%" direction="column">
              <CFormLabel font-size="sm" color="gray.500">Subject</CFormLabel>
              <CInput
                v-model="state.emailSubject.value"
                :is-read-only="isBatchSent()"
                bg="white"
                name="subject"
                w="100%"
              />
            </CFlex>
  
            <CFlex gap="3px" w="100%" direction="column">
              <CFormLabel font-size="sm" color="gray.500">CC</CFormLabel>
              <CInput
                v-model="state.emailCcList.value"
                :is-read-only="isBatchSent()"
                bg="white"
                name="cc_list"
                :placeholder="isBatchSent() ? '' : 'john@mail.com, max@mail.com'"
                w="100%"
              />
            </CFlex>
          </CHStack>

          <CBox pos="relative">
            <TinyMce
              v-model="state.emailContentHtml.value"
              padding="1rem"
              :is-show-menu-bar="false"
              :is-read-only="isBatchSent()"
              :is-show-toolbar="isBatchSent()"
            />
            
            <CButton
              @click="state.emailContentHtml.value = state.emailOpen.value.content_html_default; saveEmailChanges()"
              v-tooltip="{
                content: 'Reset to the default template',
                placement: 'top',
                trigger: 'hover'
              }"
              size="sm"
              variant="outline"
              pos="absolute"
              bottom="5"
              right="18px"
              bg="white"
              z-index="toast"
            >
              Revert
            </CButton>
          </CBox>

        </CFlex>
      </CFlex>

      <CFlex
        w="100"
        border-top="1px solid rgba(0,0,0,0)"
      />

    </CFlex>

    <!--  for preloading & caching external mce js files, otherwise it takes a while  -->
    <CBox visibility="hidden" style="display: none">
      <TinyMce padding="1rem" />
    </CBox>

    <EmailsBatchDetailAi
      v-if="state.isEmailAiOpen.value"
      @drawer-closed="state.isEmailAiOpen.value = false"
      @email-prompt-output-created="(promptOutput) => updateEmailPromptOutputs(promptOutput)"
      @email-content-updated="(promptOutput) => updateEmailContentFromAI(promptOutput)"
      :email="state.emailOpen.value"
    />

  </CFlex>

</template>

<style lang="scss">
  html, body {
    background: var(--colors-gray-75) !important;
    height: 100%;
  }

  .email-table {
    th {
      white-space: nowrap;
    }

    .table-row {
      position: relative;
      transition: all 0.2s;

      &:hover {
        background: var(--colors-gray-50);
        cursor: pointer;
      }

      &[data-is-selected='true'] {
        background: white;
      }

      &[data-is-viewed='false'] {
        color: var(--colors-blue-600);
      }

      td {
        vertical-align: top;
        white-space: nowrap;
      }

      .email-table-inner-donor-table {
        td {
          padding-left: 0 !important;
          padding-bottom: var(--space-1) !important;
          border: 0;

          &:first-of-type {
            color: #98a4b4;
          }
        }

        tr {
          &:last-of-type {
            td {
              padding-bottom: var(--space-3) !important;
            }
          }
        }
      }

    }
  }

</style>
