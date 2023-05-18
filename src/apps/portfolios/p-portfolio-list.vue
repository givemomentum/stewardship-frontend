<script lang="ts" setup>
  import algoliasearch from "algoliasearch";
  import PNavbar from "~/apps/portfolios/p-navbar.vue";
  import { urls } from "~/urls";
  import { format } from "~/utils";

  const hooks = {
    api: useApi(),
    layout: useLayoutControl(),
  };

  const state = {
    portfolioList: ref([]),
  }

  onBeforeMount(async () => {
    hooks.layout.activateLeanMode();
  });
  onBeforeUnmount(hooks.layout.deactivateLeanMode);

  onMounted(async () => {
    const res = await hooks.api.get("/portfolios/portfolios/");
    state.portfolioList.value = res.data;
  });
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
      <CHeading size="lg">Portfolios</CHeading>

      <CTableContainer max-w="800px">
        <CTable>
          <CThead>
            <CTd>Name</CTd>
            <CTd>Assignee</CTd>
            <CTd>Donors</CTd>
            <CTd>Touches before gift</CTd>
            <CTd></CTd>
          </CThead>
          <CTbody>
            <CTr v-for="portfolio in state.portfolioList.value" :key="portfolio.id">
              <CTd>{{portfolio.name}}</CTd>
              <CTd>{{portfolio.assignee.first_name}} {{portfolio.assignee.last_name}}</CTd>
              <CTd>{{portfolio.donor_count}}</CTd>
              <CTd>{{portfolio.touches_before_the_gift}}</CTd>
              <CTd>
                <CLink :to="urls.portfolios.portfolio(portfolio.id)" :href="urls.portfolios.portfolio(portfolio.id)">
                  <CButton>
                    Open
                  </CButton>
                </CLink>
              </CTd>
            </CTr>
          </CTbody>
        </CTable>
      </CTableContainer>

    </CFlex>
  </CBox>
</template>
