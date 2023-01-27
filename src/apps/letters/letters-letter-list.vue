<script setup lang="ts">
  import { formatDistance } from "date-fns";
  import { onBeforeMount, onUnmounted, ref, watch } from "vue";
  import { POSITION, useToast } from "vue-toastification";
  import { PrimaryKey } from "~/apps/auth/interfaces";
  import { Email } from "~/apps/emails/interfaces";
  import { Letter, LetterBatch } from "~/apps/letters/interfaces";
  import { useLetterBatchStore } from "~/apps/letters/useLetterBatchStore";
  import { useLeftMenu } from "~/apps/menu/useLeftMenu";
  import { useApi } from "~/composables/useApi";

  const props = defineProps<{
    batchPk: PrimaryKey;
  }>();

  const hooks = {
    api: useApi(),
    menu: useLeftMenu(),
    batchStore: useLetterBatchStore(),
    toast: useToast(),
  };

  const state = {
    letterHtml: ref(""),
    isSavingChanges: ref(false),

    batch: ref<LetterBatch | null>(null),
    letterOpen: ref<Letter | null>(null),
    letterOpenIndex: ref<number | null>(null),

    changedTrue: ref(true),
  };

  const tableRefs = ref([]);

  onBeforeMount(async () => {
    hooks.menu.collapse();
    await loadBatch();
    await loadBatch({ isIncludeHtmlDefault: true });
    document.addEventListener("keydown", handleKeyUp);
  });

  onUnmounted(() => {
    hooks.menu.unfold();
    document.removeEventListener("keydown", handleKeyUp);
  });

  watch(state.letterOpen, async letterNew => {
    state.letterHtml.value = letterNew.html || (letterNew.html_default ?? "");

    if (!letterNew.is_viewed) {
      await hooks.api.patch(`/letters/${letterNew.pk}/`, { is_viewed: true });
      letterNew.is_viewed = true;
      const batch = hooks.batchStore.list.value.find(batch => letterNew.batch === batch.pk);
      batch.letters_new_count -= 1;
    }
  });

  watch(state.batch, async batchNew => {
    state.batch.value.letters = state.batch.value.letters.sort((a, b) => {
      if (a.rec.donor.last_name < b.rec.donor.last_name) return -1;
      if (a.rec.donor.last_name > b.rec.donor.last_name) return 1;
      return 0;
    });
    
    const letterOpenUpdated = batchNew.letters.find(letter => letter.pk === state.letterOpen.value?.pk);
    if (letterOpenUpdated) {
      state.letterHtml.value = letterOpenUpdated.html || letterOpenUpdated.html_default;
    }
  });

  function isLetterHtmlChanged(): boolean {
    // todo when we update letterHtml.value in watch() above this does't get recalculated. since the code isn't in <template>?
    const htmlOriginal = state.letterOpen.value?.html || state.letterOpen.value?.html_default;
    return state.letterHtml.value?.valueOf() !== htmlOriginal?.valueOf();
  }

  async function saveLetterHtml() {
    state.isSavingChanges.value = true;
    await hooks.api.patch(
      `/letters/${state.letterOpen.value.pk}/`,
      { html: state.letterHtml.value },
    );
    state.isSavingChanges.value = false;
    hooks.toast.success("Letter saved", { position: POSITION.TOP_RIGHT });
    state.letterOpen.value.html = state.letterHtml.value;
  }

  async function markAsUnread() {
    await hooks.api.patch(
      `/letters/${state.letterOpen.value.pk}/`,
      { is_viewed: false },
    );
    state.letterOpen.value.is_viewed = false;
    const batch = hooks.batchStore.list.value.find(batch => props.batchPk === batch.pk);
    batch.letters_new_count += 1;
  }

  async function triggerBatchDownload() {
    await hooks.api.get(`/letters/batches/${props.batchPk}/download`);
    await hooks.api.patch(`/letters/batches/${props.batchPk}/`, { is_downloaded: true });
    const batch = hooks.batchStore.list.value.find(batch => props.batchPk === batch.pk);
    batch.is_downloaded = true;
    await hooks.toast.info(
      "You'll receive an email with the archive once it's ready.",
      { position: POSITION.TOP_RIGHT, timeout: 8 * 1000, pauseOnFocusLoss: false },
    );
  }

  function handleKeyUp(event: KeyboardEvent) {
    const isEditingInputTextWithArrows = (event.target as any).tagName === "INPUT";
    if (isEditingInputTextWithArrows) {
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      changeOpenLetterIndex(-1);
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      changeOpenLetterIndex(+1);
    }
  }

  function changeOpenLetterIndex(change: -1 | 1) {
    const letterIndexNew = state.letterOpenIndex.value + change;
    const letterNew = state.batch.value.letters[letterIndexNew];
    if (letterNew) {
      state.letterOpen.value = letterNew;
      state.letterOpenIndex.value = letterIndexNew;
      // doesn't work wo setTimeout, prob a Vue render issue
      setTimeout(() => {
        tableRefs.value[letterIndexNew].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 0);
    }
  }
  
  async function toggleLetterExclusion(letter: Letter) {
    const isExcludedFlipped = !letter.is_excluded;
    await hooks.api.patch(`/letters/${letter.pk}/`, { is_excluded: isExcludedFlipped });
    letter.is_excluded = isExcludedFlipped;
  }

  async function loadBatch(args?: { isIncludeHtmlDefault?: boolean }) {
    const res = await hooks.api.get(`/letters/batches/${props.batchPk}/?expand=letters${args?.isIncludeHtmlDefault ? ".html_default" : ""}`);
    state.batch.value = res.data;
  }

  function isSelected(letter: Letter): boolean {
    return letter.pk === state.letterOpen.value?.pk;
  }

  function formatDate(date: string) {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  }
</script>

<template>
  <CFlex gap="4" pb="8" h="100%" overflow="hidden">

    <CFlex direction="column">
      <CFlex justify="space-between" min-w="510" gap="5" align="center">
        <CHeading variant="page-header">Edit letters</CHeading>

        <CFlex gap="5">
          <CButton
            @click="triggerBatchDownload"
            left-icon="download"
            size="sm"
            variant="outline"
            bg="white"
          >
            Download all
          </CButton>
        </CFlex>
      </CFlex>

      <CFlex h="fit-content">
        <ChakraTable size="sm" min-w="370px" mt="8" class="letter-table" w="100%">
          <chakra.thead>
            <chakra.tr>
              <chakra.th>Donor</chakra.th>
              <chakra.th data-is-numeric="true">Donation</chakra.th>
              <chakra.th data-is-numeric="true" white-space="nowrap">
                Donated total
              </chakra.th>
              <chakra.th data-is-numeric="true">Modified</chakra.th>
              <chakra.th data-is-numeric="true">Excluded</chakra.th>
            </chakra.tr>
          </chakra.thead>

          <chakra.tbody>
            <!-- <tr ref="{}"> must be assigned wo `state.{}` and on a native html elements -->
            <tr
              v-for="(letter, letterIndex) in state.batch.value?.letters"
              ref="tableRefs"
              :key="letter.pk"
              @click="state.letterOpen.value = letter; state.letterOpenIndex.value = letterIndex;"
              :data-is-selected="isSelected(letter)"
              :data-is-viewed="letter.is_viewed"
              class="table-row"
            >
              <chakra.td
                v-if="letter.rec.donor.name"
                pr="0 !important"
                white-space="nowrap"
                max-w="260px"
                overflow="hidden"
              >
                {{ letter.rec.donor.name }}
              </chakra.td>
              <chakra.td v-else pr="0 !important" white-space="nowrap">
                Unknown
              </chakra.td>

              <chakra.td data-is-numeric="true">
                ${{ Number(letter.rec.gift.amount).toLocaleString('en-US', { maximumFractionDigits: 0 }) }}
              </chakra.td>

              <chakra.td white-space="nowrap" data-is-numeric="true">
                ${{ letter.rec.donor.donated_total.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}
              </chakra.td>

              <chakra.td data-is-numeric="true">
                <CIcon v-if="letter.html" name="check-square" mb="1" size="4" color="gray.500" />
              </chakra.td>
              
              <chakra.td data-is-numeric="true">
                <VTooltip placement="right">
                  <div>
                    <ChakraCheckbox
                      :model-value="letter.is_excluded"
                      @click.stop="toggleLetterExclusion(letter)"
                    />
                  </div>
                  <template v-slot:popper>
                    <CText font-size="xs" v-if="letter.is_excluded">Include this letter in the PDF export</CText>
                    <CText font-size="xs" v-else>Exclude this letter from the PDF export</CText>
                  </template>
                </VTooltip>
              </chakra.td>

              <CFlex
                pos="absolute"
                top="34px"
                bottom="0"
                left="0"
                direction="column"
                px="5"
                pb="4"
                w="100%"
                :opacity="isSelected(letter) ? 1 : 0"
                :transition-duration="isSelected(letter) ? '0.1s' : '0.05s'"
                :transition-delay="isSelected(letter) ? '0.1s' : 'initial'"
                transition-timing-function="ease-in"
                gap="3"
                font-size="sm"
              >
                <CFlex pos="relative">
                  <CFlex pos="absolute" top="3" right="0">
                    <CLink
                      v-if="letter.rec.donor.crm_url"
                      :href="letter.rec.donor.crm_url"
                      is-external
                      variant="none"
                    >
                      <CButton
                        v-if="isSelected(letter)"
                        mt="3"
                        size="xs"
                        variant="outline"
                        left-icon="external-link"
                      >
                        CRM profile
                      </CButton>
                    </CLink>
                  </CFlex>
                </CFlex>

                <chakra.table class="donor-table" data-size="none">
                  <chakra.tbody>
                    <chakra.tr border-top="1px solid" border-color="gray.100">
                      <chakra.td>Email</chakra.td>
                      <chakra.td>{{ letter.rec.donor.email }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr v-if="letter.rec.donor.mailing_address.address_line1">
                      <chakra.td>Address</chakra.td>
                      <chakra.td>{{ letter.rec.donor.mailing_address.address_line1.slice(0, 31) }}, {{ letter.rec.donor.mailing_address.city }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr>
                      <chakra.td white-space="nowrap">First donation</chakra.td>
                      <chakra.td>{{ formatDate(letter.rec.donor.giving_since) }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr>
                      <chakra.td>Notes</chakra.td>
                      <chakra.td white-space="nowrap">{{ letter.rec.gift.notes }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr>
                      <chakra.td border-bottom="0" pb="0 !important">Appeal</chakra.td>
                      <chakra.td border-bottom="0" pb="0 !important">{{ letter.rec.gift.appeal?.title }}</chakra.td>
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
        v-if="state.letterOpen.value"
        direction="row"
        pos="fixed"
        top="-2px"
        p="8"
        pl="4"
        gap="8"
        max-h="100vh"
      >
        <CFlex pos="relative">
          <CFlex
            pos="absolute"
            right="3"
            top="3"
            gap="3"
          >
            <CButton
              @click="saveLetterHtml()"
              :is-loading="state.isSavingChanges.value"
              size="sm"
              z-index="toast"
              border-radius="lg"
              :opacity="isLetterHtmlChanged() ? 1 : 0"
              transition="opacity 0.2s"
            >
              Save changes
            </CButton>

            <CLink
              :href="state.letterOpen.value.download_pdf_url"
              is-external
              variant="none"
            >
              <CButton
                size="sm"
                variant="outline"
                left-icon="download"
                z-index="toast"
                border-radius="lg"
                transition="opacity 0.2s"
              >
                PDF
              </CButton>
            </CLink>

            <CButton
              @click="markAsUnread()"
              variant="outline"
              size="sm"
              z-index="toast"
              border-radius="lg"
              opacity="1"
              transition="opacity 0.2s"
            >
              Mark unread
            </CButton>
          </CFlex>

          <TinyMce
            v-model="state.letterHtml.value"
            editor-box-shadow="0 1px 3px 0 rgba(0, 0, 0, 0.1),0 1px 2px 0 rgba(0, 0, 0, 0.06)"
            editor-background="#f4f4f4"
            width="850px"
            min-height="1100px"
            :is-show-menu-bar="true"
            content-css-default="font-family: Calibri; font-size: 11pt;"
          />
        </CFlex>
      </CFlex>
    </CFlex>

    <CBox visibility="hidden">
      <TinyMce />
    </CBox>

  </CFlex>
</template>

<style lang="scss">
  html, body {
    background: var(--chakra-colors-gray-75) !important;
    height: 100%;
  }

  .letter-table {
    .table-row {
      position: relative;
      height: 46px;
      transition: all 0.2s;

      &:hover {
        background: var(--chakra-colors-gray-50);
        cursor: pointer;
      }

      &[data-is-selected='true'] {
        background: white;
        height: 244px !important;
      }

      &[data-is-viewed='false'] {
        color: var(--chakra-colors-blue-600);
      }

      td {
        vertical-align: top;
      }
    }
  }

  .donor-table {
    td {
      padding-left: 0 !important;
      padding-bottom: var(--chakra-space-1) !important;
      border: 0;

      &:first-of-type {
        color: #98a4b4;
      }
    }
    tr {
      &:last-of-type {
        td {
          padding-bottom: var(--chakra-space-3) !important;
        }
      }
    }
  }
</style>
