<script lang="ts" setup>
  import algoliasearch from "algoliasearch";
  import { urls } from "~/urls";
  import { format } from "~/utils";

  const state = {
    searchClient: ref(null),
    searchIndexName: ref(""),
  };

  const hooks = {
    api: useApi(),
    layout: useLayoutControl(),
  };

  onBeforeMount(async () => {
    hooks.layout.activateLeanMode();
  });
  onBeforeUnmount(hooks.layout.deactivateLeanMode);


  onMounted(async () => {
    const res = await hooks.api.get("/orgs/algolia");
    state.searchIndexName.value = res.data.index_name;
    state.searchClient.value = algoliasearch(
      res.data.app_id,
      res.data.api_key,
    );
  });
</script>

<template>
  <CBox w="100%">
    <CFlex
      w="100%"
      h="auto"
      p="6"
      py="4"
      color="blue.100"
      bg="blue.800"
      font-size="lg"
    >
      <CFlex pl="1" gap="4" align="center">
        <NuxtLink :to="urls.tasks.list">
          <chakra.img src="/momentum-logo.svg" color="white" max-w="185px" />
        </NuxtLink>

        <VTooltip>
          <div>
            <CBox
              mt="6px"
              px="10px"
              pt="1px"
              pb="2px"
              bg="blue.100"
              color="blue.900"
              border-radius="lg"
              font-size="xs"
              :_hover="{cursor: 'help'}"
            >
              EAP
            </CBox>
          </div>

          <template v-slot:popper>
            <CText font-size="xs">Early Access Preview</CText>
          </template>
        </VTooltip>
      </CFlex>
    </CFlex>

    <CFlex
      direction="column"
      p="6"
      bg="white"
      gap="6"
    >
      <CHeading size="lg">Portfolio</CHeading>

      <AisInstantSearch
        v-if="state.searchClient.value"
        show-loading-indicator
        :search-client="state.searchClient.value"
        :index-name="state.searchIndexName.value"
      >

        <CFlex
          justify-space="space-between"
          w="100%"
          direction="row"
          gap="6"
        >

          <ais-search-box show-loading-indicator/>

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
            <template v-slot="{
              canRefine,
              refine,
            }">
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
                      <CTh></CTh>
<!--                      <CTh></CTh>-->
                    </CTr>
                  </CThead>

                  <CTr
                    v-for="item in items"
                    :key="item.objectID"
                    pos="relative"
                    :height="item._highlightResult.action_list_searchable?.matchedWords.length ? '90px' : 'auto'"
                    :_hover="{bg: 'gray.50'}"
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
                        :_hover="{cursor: 'context-menu', bg: 'gray.200'}"
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
