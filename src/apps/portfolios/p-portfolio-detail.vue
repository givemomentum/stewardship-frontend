<script lang="ts" setup>
  import { differenceInDays } from "date-fns";
  import { PortfolioPlan } from "~/apps/portfolios/interfaces";
  import { useAlgolia } from "~/apps/portfolios/useAlgolia";
  import { urls } from "~/urls";
  import { format } from "~/utils";

  const props = defineProps<{
    portfolioId: string;
    donorId?: string;
    isSkipAction?: boolean;
  }>();

  const state = {
    portfolio: ref(null as PortfolioPlan | null),
    donorIdOpened: ref(null),
    algoliaFilter: ref(`portfolio_plan_id:${props.portfolioId}`),
  };

  const hooks = {
    api: useApi(),
    layout: useLayoutControl(),
    algolia: useAlgolia(),
  };

  onBeforeMount(async () => {
    hooks.layout.activateLeanMode();
    await loadPortfolio();
    hooks.algolia.init(state.portfolio.value);
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

  async function loadPortfolio() {
    const res = await hooks.api.get(`/portfolios/portfolios/${props.portfolioId}/`);
    state.portfolio.value = res.data;
  }

  function getEventDateLabel(algoliaItem: any, event: string) {
    const eventObj = algoliaItem.upcoming_events_dates?.find((ev) => ev.label === event);
    if (!eventObj) {
      return "";
    }
    const diffInDays = differenceInDays(new Date(eventObj.date), new Date()) + 1;
    if (diffInDays === 0) {
      return `Today`;
    }
    if (diffInDays === 1) {
      return `Tomorrow`;
    }
    if (diffInDays === -1) {
      return `Yesterday`;
    }
    if (diffInDays < -1) {
      return `Passed`;
    }
    return `${diffInDays} days until`;
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
      w="fit-content"
    >
      <CHeading size="lg">Portfolio {{state.portfolio.value?.name}}</CHeading>

      <AisInstantSearch
        v-if="hooks.algolia.searchClient.value && state.portfolio.value"
        :key="hooks.algolia.refreshKey.value"
        :search-client="hooks.algolia.searchClient.value"
        :index-name="state.portfolio.value.algolia_creds.index_name"
        show-loading-indicator
      >
        <AisConfigure
          :filters="state.algoliaFilter.value"
        />

        <CFlex
          justify="space-between"
          w="100%"
          gap="6"
        >
          <CFlex gap="6">
            <ais-search-box show-loading-indicator />

            <CPopover>
              <CPopoverTrigger>
                <CButton
                  right-icon="chevron-down"
                  variant="outline"
                  color-scheme="gray"
                >
                  City
                </CButton>
              </CPopoverTrigger>
              <CPortal>
                <CPopoverContent>
                  <CPopoverArrow />
                  <CPopoverBody>
                    <ARefinmentList
                      attribute="city"
                      searchable
                      :limit="10"
                      :showMoreLimit="10"
                    />
                  </CPopoverBody>
                </CPopoverContent>
              </CPortal>
            </CPopover>

            <CPopover>
              <CPopoverTrigger>
                <CButton
                  right-icon="chevron-down"
                  variant="outline"
                  color-scheme="gray"
                >
                  Upcoming events
                </CButton>
              </CPopoverTrigger>
              <CPortal>
                <CPopoverContent>
                  <CPopoverArrow />
                  <CPopoverBody>
                    <ARefinmentList
                      attribute="upcoming_events"
                      searchable
                      :limit="10"
                      :showMoreLimit="10"
                    />
                  </CPopoverBody>
                </CPopoverContent>
              </CPortal>
            </CPopover>

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

          <CFlex>
            <PPortfolioAdd
              v-if="state.portfolio.value"
              :plan="state.portfolio.value"
              @portfolio-updated="hooks.algolia.reloadPortfolio()"
            />
          </CFlex>
        </CFlex>

        <CTableContainer mt="6">
          <CTable>

            <CTbody>
              <ais-infinite-hits :transform-items="hooks.algolia.transformItems">

                <template
                  v-slot="{
                    items,
                  }"
                >
                  <CThead>
                    <CTr>
                      <PPortfolioTableHead attribute="name" label="Name" />
                      <PPortfolioTableHead attribute="donated_total" label="Lifetime giving" />
                      <PPortfolioTableHead attribute="last_gift_date" label="Last gift" />
                      <PPortfolioTableHead attribute="expected_gift_date" label="Upcoming gift" />
                      <PPortfolioTableHead attribute="season_progress" label="Touches progress" />
                      <PPortfolioTableHead attribute="last_contact_date" label="Last touch" />
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
                      <CTooltip
                        v-for="event in item.upcoming_events"
                        v-tooltip="{
                          content: `In ${item.upcoming_events_countdown?.find((ev) => ev.label === event).days} days`,
                          placement: 'top',
                        }"
                        :_hover="{ cursor: 'context-menu', bg: 'gray.200' }"
                        mr="2"
                        :key="event"
                        :label="getEventDateLabel(item, event)"
                      >
                        <CTag mr="2">
                          {{event.replace('_', ' ')}}
                        </CTag>
                      </CTooltip>
                    </CTd>
                    <CTd>
                      <CLink v-if="item.crm_url" is-external :href="item.crm_url">
                        <CButton
                          left-icon="external-link"
                          size="xs"
                          variant="ghost"
                          color-scheme="gray"
                        >
                          CRM
                        </CButton>
                      </CLink>
                      <span v-else />
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
