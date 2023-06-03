<script lang="ts" setup>
  import algoliasearch from "algoliasearch";
  import { urls } from "~/urls";
  import { format } from "~/utils";

  const props = defineProps<{
    portfolioId: string;
    donorId?: string;
    isSkipAction?: boolean;
  }>();

  const state = {
    portfolioName: ref(""),
    searchClient: ref(null),
    searchIndexName: ref(""),
    donorIdOpened: ref(null),
  };

  const hooks = {
    api: useApi(),
    layout: useLayoutControl(),
  };

  onBeforeMount(async () => {
    hooks.layout.activateLeanMode();
    await initAlgolia();
  });

  watch(() => props.donorId, () => {
    if (props.donorId) {
      state.donorIdOpened.value = props.donorId;
    }
  }, { immediate: true });

  watch(state.donorIdOpened, (donorId) => {
    let urlNew: string;
    if (donorId) {
      urlNew = urls.portfolios.donor(props.portfolioId, donorId);
    } else {
      urlNew = urls.portfolios.portfolio(props.portfolioId);
    }
    history.pushState({}, null, urlNew);
  });

  async function initAlgolia() {
    const res = await hooks.api.get(`/portfolios/portfolios/${props.portfolioId}/`);
    state.searchIndexName.value = res.data.algolia_creds.index_name;
    state.searchClient.value = algoliasearch(
      res.data.algolia_creds.app_id,
      res.data.algolia_creds.api_key,
    );
    state.portfolioName.value = res.data.name;
  }
</script>

<template>
  <CBox w="100%">
    <PNavbar/>

    <CFlex
      direction="column"
      p="6"
      bg="white"
      gap="6"
    >
      <CHeading size="lg">Portfolio {{state.portfolioName.value}}</CHeading>

      <AisInstantSearch
        v-if="state.searchClient.value"
        show-loading-indicator
        :search-client="state.searchClient.value"
        :index-name="state.searchIndexName.value"
      >
        <AisConfigure
          :filters="`portfolio_plan_id:${props.portfolioId}`"
        />

        <CFlex
          justify-space="space-between"
          w="100%"
          direction="row"
          gap="6"
        >

          <ais-search-box show-loading-indicator />

          <VDropdown :distance="6">
            <CButton
              right-icon="chevron-down"
              variant="outline"
              color-scheme="gray"
            >
              City
            </CButton>
            <template #popper>
              <ARefinmentList
                attribute="city"
                searchable
                :limit="10"
                :showMoreLimit="10"
              />
            </template>
          </VDropdown>

          <VDropdown :distance="6">
            <CButton
              right-icon="chevron-down"
              variant="outline"
              color-scheme="gray"
            >
              Upcoming events
            </CButton>
            <template #popper>
              <ARefinmentList
                attribute="upcoming_events"
                searchable
                :limit="10"
                :showMoreLimit="10"
              />
            </template>
          </VDropdown>

          <ais-clear-refinements v-if="false">
            <template
              v-slot="{
                canRefine,
                refine,
              }"
            >
              <CButton
                v-if="canRefine"
                variant="ghost"
                @click.prevent="refine"
                left-icon="x"
              >
                Clear filters
              </CButton>
              <span v-else />
            </template>
          </ais-clear-refinements>
        </CFlex>

        <CTableContainer mt="6">
          <CTable>

            <CTbody>
              <ais-infinite-hits>

                <template
                  v-slot="{
                    items,
                    refineNext,
                    isLastPage,
                  }"
                >
                  <CThead>
                    <CTr>
                      <CTh>Name</CTh>
                      <CTh>Lifetime giving</CTh>
                      <CTh>Last gift</CTh>
                      <CTh>Upcoming gift</CTh>
                      <CTh>Touches progress</CTh>
                      <CTh>Last touch</CTh>
                      <CTh>Upcoming</CTh>
                      <CTh />
                      <CTh />
                    </CTr>
                  </CThead>

                  <CTr
                    v-for="item in items"
                    @click="state.donorIdOpened.value = item.objectID"
                    :key="item.objectID"
                    pos="relative"
                    :height="item._highlightResult.action_list_searchable?.matchedWords.length ? '90px' : 'auto'"
                    :_hover="{ bg: 'gray.50', cursor: 'pointer' }"
                  >
                    <CTd>
                      <ais-highlight attribute="name" :hit="item" />
                    </CTd>
                    <CTd text-align="right">{{ format.money(item.donated_total) }}</CTd>
                    <CTd>{{ format.dateFromUnixV2(item.last_gift_date) }}</CTd>
                    <CTd>{{ format.dateHumanShort(item.expected_gift_date) }}</CTd>
                    <CTd>
                      <CBox pos="relative">
                        <ChakraProgress :value="item.season_progress * 100" h="5" />
                        <CBox
                          pos="absolute"
                          left="2"
                          top="0"
                          :color="item.season_progress < 0.2 ? 'black' : 'white'"
                          font-size="2xs"
                        >
                          {{item.season_touches_completed_count}} / {{item.season_touches_planed_count}}
                        </CBox>
                      </CBox>
                    </CTd>
                    <CTd>{{ format.dateFromUnixV2(item.last_contact_date, false) }}</CTd>
                    <CTd>
                      <CTag
                        v-for="event in item.upcoming_events"
                        v-tooltip="{
                          content: `In ${item.upcoming_events_countdown.find((ev) => ev.label === event).days} days`,
                          placement: 'top',
                        }"
                        :_hover="{ cursor: 'context-menu', bg: 'gray.200' }"
                        mr="2"
                      >
                        {{event.replace('_', ' ')}}
                      </CTag>
                    </CTd>
                    <CTd>
                      <CLink is-external :href="item.crm_url">
                        <CButton
                          left-icon="external-link"
                          size="xs"
                          variant="ghost"
                          color-scheme="gray"
                        >
                          CRM
                        </CButton>
                      </CLink>
                    </CTd>
                    <CTd>
                      <CButton
                        right-icon="arrow-forward"
                        size="sm"
                        color-scheme="gray"
                      >
                        View
                      </CButton>

                    </CTd>
<!--                    <CTd>-->
<!--                      <CButton-->
<!--                        size="xs"-->
<!--                        color-scheme="gray"-->
<!--                      >-->
<!--                        Schedule touch-->
<!--                      </CButton>-->
<!--                    </CTd>-->
                    <CBox
                      v-if="item._highlightResult.action_list_searchable?.matchedWords.length"
                      pos="absolute"
                      left="6"
                      top="55px"
                      font-size="sm"
                      color="gray.500"
                    >
                      <ais-snippet
                        attribute="action_list_searchable"
                        :hit="item"
                      />
                    </CBox>
                  </CTr>
                </template>
              </ais-infinite-hits>
            </CTbody>

          </CTable>
        </CTableContainer>

      </AisInstantSearch>
    </CFlex>

    <ChakraDrawer v-model="state.donorIdOpened.value">
      <PDonorDetail
        :plan-id="props.portfolioId"
        :donor-id="state.donorIdOpened.value"
        :is-skip-action="props.isSkipAction"
      />
    </ChakraDrawer>
  </CBox>
</template>

<style lang="scss" scope>
  .ais-InfiniteHits {
    display: table;
  }
  .ais-SearchBox {
    .ais-SearchBox-input {
      padding: var(--chakra-space-2) var(--chakra-space-4);
      font-size: var(--chakra-fontSizes-md);
      border: 1px solid;
      border-color: var(--chakra-colors-gray-200);
      border-radius: var(--chakra-radii-md);
      height: 40px;
      &:hover {
        border: 1px solid;
        border-color: var(--chakra-colors-gray-300);
      }
      &:focus {
        border-color: var(--chakra-colors-gray-500);
        box-shadow: 0;
        outline: 0;
      }
    }
    .ais-SearchBox-submit, .ais-SearchBox-reset {
      display: none;
    }
  }
</style>
