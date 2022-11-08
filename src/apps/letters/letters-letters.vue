<script setup lang="ts">
  import { formatDistance } from "date-fns";
  import { onBeforeMount, onUnmounted, ref, watch } from "vue";
  import { POSITION, useToast } from "vue-toastification";
  import { PrimaryKey } from "~/apps/auth/interfaces";
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

  watch(state.letterOpen, async (letterNew) => {
    state.letterHtml.value = letterNew.html || (letterNew.html_default ?? "");

    if (!letterNew.is_viewed) {
      await hooks.api.$patch(`/letters/${letterNew.pk}/`, { is_viewed: true });
      letterNew.is_viewed = true;
      const batch = hooks.batchStore.list.value.find((batch) => letterNew.batch === batch.pk);
      batch.letters_new_count -= 1;
    }
  });

  watch(state.batch, async (batchNew) => {
    const letterOpenUpdated = batchNew.letters.find((letter) => letter.pk === state.letterOpen.value?.pk);
    if (letterOpenUpdated) {
      state.letterHtml.value = letterOpenUpdated.html || letterOpenUpdated.html_default;
    }
  });

  function isLetterHtmlChanged(): boolean {
    // todo when we update letterHtml.value in watch() above this does't get recalculated. since the code isn't in <template>?
    const htmlOriginal = state.letterOpen.value.html.valueOf() || state.letterOpen.value.html_default?.valueOf();
    return state.letterHtml.value.valueOf() !== htmlOriginal;
  }

  async function saveLetterHtml() {
    state.isSavingChanges.value = true;
    await hooks.api.$patch(
      `/letters/${state.letterOpen.value.pk}/`,
      { html: state.letterHtml.value },
    );
    state.isSavingChanges.value = false;
    hooks.toast.success("Letter saved", { position: POSITION.TOP_RIGHT });
    state.letterOpen.value.html = state.letterHtml.value;
  }

  async function markAsUnread() {
    await hooks.api.$patch(
      `/letters/${state.letterOpen.value.pk}/`,
      { is_viewed: false },
    );
    state.letterOpen.value.is_viewed = false;
    const batch = hooks.batchStore.list.value.find((batch) => props.batchPk === batch.pk);
    batch.letters_new_count += 1;
  }

  async function triggerBatchDownload() {
    await hooks.api.$get(`/letters/batches/${props.batchPk}/download`);
    await hooks.api.$patch(`/letters/batches/${props.batchPk}/`, { is_downloaded: true });
    const batch = hooks.batchStore.list.value.find((batch) => props.batchPk === batch.pk);
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

  async function loadBatch(args?: { isIncludeHtmlDefault?: boolean }) {
    const res = await hooks.api.$get(`/letters/batches/${props.batchPk}/?expand=letters${args?.isIncludeHtmlDefault ? ".html_default" : ""}`);
    state.batch.value = res.data;
  }

  function getSegmentPk(): PrimaryKey | null {
    return hooks.batchStore.list.value.find((batch) => batch.pk === props.batchPk)?.segment?.pk;
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
              <chakra.th data-is-numeric="true">Donated total</chakra.th>
              <chakra.th data-is-numeric="true">Modified</chakra.th>
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
              <chakra.td v-if="letter.donor.first_name" pr="0 !important" white-space="nowrap">
                {{ letter.donor.first_name }} {{ letter.donor.last_name }}
              </chakra.td>
              <chakra.td v-else pr="0 !important" white-space="nowrap">
                Unknown
              </chakra.td>

              <chakra.td data-is-numeric="true">
                ${{ Number(letter.gift.amount).toLocaleString('en-US', { maximumFractionDigits: 0 }) }}
              </chakra.td>

              <chakra.td white-space="nowrap" data-is-numeric="true">
                ${{ letter.donor.donated_total.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}
              </chakra.td>

              <chakra.td data-is-numeric="true">
                <ChakraCheckbox v-if="letter.html" v-model="state.changedTrue.value" is-disabled />
              </chakra.td>

              <CFlex
                pos="absolute"
                top="46px"
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
                <chakra.table class="donor-table" data-size="none">
                  <chakra.tbody>
                    <chakra.tr border-top="1px solid" border-color="gray.100">
                      <chakra.td>Email</chakra.td>
                      <chakra.td>{{ letter.donor.email }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr v-if="letter.donor.mailing_address.address_line1">
                      <chakra.td>Address</chakra.td>
                      <chakra.td>{{ letter.donor.mailing_address.address_line1.slice(0, 31) }}, {{ letter.donor.mailing_address.city }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr>
                      <chakra.td white-space="nowrap">First donation</chakra.td>
                      <chakra.td>{{ formatDate(letter.donor.giving_since) }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr>
                      <chakra.td>Notes</chakra.td>
                      <chakra.td white-space="nowrap">{{ letter.gift.notes }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr>
                      <chakra.td border-bottom="0" pb="0 !important">Appeal</chakra.td>
                      <chakra.td border-bottom="0" pb="0 !important">{{ letter.gift.appeal?.title }}</chakra.td>
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
        v-if="state.letterOpen.value && state.letterHtml.value"
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

          <TinyMce v-model="state.letterHtml.value" />
        </CFlex>
      </CFlex>
    </CFlex>

    <CBox visibility="hidden">
      <TinyMce />
    </CBox>

  </CFlex>
</template>

<style lang="scss">
  .letter-table {
    .table-row {
      position: relative;
      height: 46px;
      transition: all 0.2s;

      &:hover {
        background: var(--colors-gray-50);
        cursor: pointer;
      }

      &[data-is-selected='true'] {
        background: white;
        height: 244px !important;
      }

      &[data-is-viewed='false'] {
        color: var(--colors-blue-600);
      }

      td {
        vertical-align: top;
      }
    }
  }

  .donor-table {
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
</style>
