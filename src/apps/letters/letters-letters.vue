<script setup lang="ts">
  import { formatDistance } from "date-fns";
  import { onBeforeMount, onMounted, onUnmounted, ref, watch } from "vue";
  import { useToast } from "vue-toastification";
  import { PrimaryKey } from "~/apps/auth/interfaces";
  import { CrmGift, Letter, LetterBatch } from "~/apps/letters/interfaces";
  import { useLetterBatchStore } from "~/apps/letters/useLetterBatchStore";
  import { useLeftMenu } from "~/apps/menu/useLeftMenu";
  import { useApi } from "~/composables/useApi";
  import { urls } from "~/urls";

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
    letterHtmlCustom: ref(""),
    isLetterHtmlChanged: ref(false),
    isSavingChanges: ref(false),
    
    batch: ref<LetterBatch | null>(null),
    letterOpen: ref<Letter | null>(null),
    letterOpenIndex: ref<number | null>(null),
  };

  const tableRefs = ref([]);

  onBeforeMount(async () => {
    hooks.menu.collapse();
    await loadBatch();
    document.addEventListener("keydown", handleKeyUp);
  });
  
  onUnmounted(() => {
    hooks.menu.unfold();
    document.removeEventListener("keydown", handleKeyUp);
  });

  watch(state.letterOpen, async (letterNew) => {
    state.letterHtmlCustom.value = letterNew.html || letterNew.html_default;

    if (!letterNew.is_viewed) {
      await hooks.api.$patch(`/letters/${letterNew.pk}/`, { is_viewed: true });
      letterNew.is_viewed = true;
    }
  });

  watch(state.letterHtmlCustom, async (letterHtmlNew: string) => {
    if (letterHtmlNew !== (state.letterOpen.value.html || state.letterOpen.value.html_default)) {
      state.isLetterHtmlChanged.value = true;
    } else {
      state.isLetterHtmlChanged.value = false;
    }
  });
  
  async function saveLetterHtml() {
    state.isSavingChanges.value = true;
    await hooks.api.$patch(
      `/letters/${state.letterOpen.value.pk}/`,
      { html: state.letterHtmlCustom.value }
    );
    state.isSavingChanges.value = false;
    hooks.toast.success("Letter saved");
    state.letterOpen.value.html = state.letterHtmlCustom.value;
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

  async function loadBatch() {
    const res = await hooks.api.$get(`/letters/batches/${props.batchPk}/`);
    state.batch.value = res.data;
  }
  
  function getSegmentPk(): PrimaryKey | null {
    return hooks.batchStore.list.value.find(batch => batch.pk === props.batchPk)?.segment?.pk;
  }
  
  function isSelected(letter: Letter): boolean {
    return letter.pk === state.letterOpen.value?.pk;
  }
  
  function formatDate(date: string) {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  }
</script>

<template>
  <CFlex gap="4" pb="8" h="100%">

    <CFlex direction="column">
      <CFlex justify="space-between" v-if="true" min-w="510" gap="5">
        <MenuBreadcrumbs
          :items="[
            { label: 'Segments', url: urls.letters.segmentList },
            { label: 'Batches', url: urls.letters.segmentBatchList(getSegmentPk()) },
            { label: 'Letters', isCurrentPage: true },
          ]"
          min-w="255"
        />
        
        <CFlex gap="5">
          <VTooltip>
            <CButton
              mt="2"
              left-icon="share-2"
              size="sm"
              variant="outline"
              bg="white"
              @click="hooks.toast.success('Link copied to your clipboard')"
            >
              Share
            </CButton>
          
            <template #popper>
              <CBox font-size="xs">
                Share the instant login link with your colleges
              </CBox>
            </template>
          </VTooltip>

          <CLink :href="state.batch.value?.zip_file" is-external :_hover="{textDecoration: 'none'}">
            <CButton
              mt="2"
              left-icon="download"
              size="sm"
              variant="outline"
              bg="white"
            >
              Download all
            </CButton>
          </CLink>
        </CFlex>
      </CFlex>
    
      <CFlex h="fit-content">
        <ChakraTable size="sm" min-w="370px" mt="8">
          <chakra.thead>
            <chakra.tr>
              <chakra.th>Donor</chakra.th>
              <chakra.th>Donation</chakra.th>
              <chakra.th>Location</chakra.th>
              <chakra.th>Modified</chakra.th>
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
              :data-is-doanted-total-a-lot="letter.donor.donated_total > letter.gift.amount"
              class="table-row"
            >
              <chakra.td v-if="letter.donor.first_name" pr="0 !important" white-space="nowrap">
                {{ letter.donor.first_name }} {{ letter.donor.last_name }}
              </chakra.td>
              <chakra.td v-else pr="0 !important" white-space="nowrap">
                Unknown
              </chakra.td>

              <chakra.td data-is-numeric="true">
                ${{ letter.gift.amount }}
              </chakra.td>

              <chakra.td white-space="nowrap">
                <span v-if="letter.donor.mailing_address.city">
                  {{ letter.donor.mailing_address.state }}, {{ letter.donor.mailing_address.city }}
                </span>
              </chakra.td>

              <chakra.td>
                {{ Boolean(letter.html) ? 'Yes' : '' }}
              </chakra.td>

              <CFlex
                pos="absolute"
                top="46px"
                bottom="0"
                left="0"
                direction="column"
                v-if="true"
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
                <chakra.table className="donor-table" data-size="none">
                  <chakra.tbody>
                    <chakra.tr border-top="1px solid" border-color="gray.100">
                      <chakra.td>Email</chakra.td>
                      <chakra.td>{{ letter.donor.email }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr v-if="letter.donor.donated_total > letter.gift.amount">
                      <chakra.td>Total</chakra.td>
                      <chakra.td>${{ letter.donor.donated_total.toLocaleString() }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr>
                      <chakra.td white-space="nowrap">First donation</chakra.td>
                      <chakra.td>{{ formatDate(letter.donor.giving_since) }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr>
                      <chakra.td >Notes</chakra.td>
                      <chakra.td white-space="nowrap">{{ letter.gift.notes }}</chakra.td>
                    </chakra.tr>

                    <chakra.tr>
                      <chakra.td border-bottom="0" pb="0 !important">Appeal</chakra.td>
                      <chakra.td border-bottom="0" pb="0 !important">{{ letter.gift.appeal }}</chakra.td>
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
          <CButton
            @click="saveLetterHtml()"
            :is-loading="state.isSavingChanges.value"
            pos="absolute"
            right="3"
            top="3"
            size="sm"
            z-index="modal"
            border-radius="lg"
            :opacity="state.isLetterHtmlChanged.value ? 1 : 0"
          >
            Save changes
          </CButton>
          <TinyMce v-model="state.letterHtmlCustom.value" />
        </CFlex>
      </CFlex>
    </CFlex>

  </CFlex>
</template>

<style lang="scss">
  .donor-table {
    td {
      padding-left: 0 !important;
      &:first-of-type {
        color: var(--colors-gray-400)
      }
    }
  }
  
  .table-row {
    position: relative;
    height: 46px;
    transition: all 0.2s;

    &:hover {
      background: var(--colors-gray-50);
      cursor: pointer;
    }

    &[data-is-selected="true"] {
      background: white;
      height: 235px;
      &[data-is-doanted-total-a-lot="true"] {
        height: 280px !important;
      }
    }

    &[data-is-viewed="false"] {
      color: var(--colors-blue-600);
    }
    
    td {
      vertical-align: top;
    }
  }
</style>
