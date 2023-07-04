<script lang="ts" setup>
  import { NuxtLink } from "#components";
  import { usePlanDonorLoader } from "~/apps/portfolios/usePlanDonorLoader";
  import { urls } from "~/urls";

  const props = defineProps<{
    planId: string | number;
    donorId: string | number;
    recId?: string;
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
    layout: useLayoutControl(),
    loader: usePlanDonorLoader(props.donorId, props.planId),
  };

  onBeforeMount(async () => {
    hooks.layout.activateLeanMode();
  });
</script>

<template>
  <CBox w="100%">
    <PNavbar />

    <CFlex
      direction="column"
      pl="0"
      gap="6"
    >
      <CFlex
        justify="space-between"
        align="center"
        py="5"
        px="8"
        border-bottom="1px solid"
        border-color="gray.200"
        bg="gray.50"
      >
        <CBreadcrumb font-size="xl">
          <CBreadcrumbItem>
            <CBreadcrumbLink
              :as="NuxtLink"
              :href="urls.portfolios.portfolio(props.planId)"
            >
              {{ hooks.loader.plan.value?.name }}
            </CBreadcrumbLink>
          </CBreadcrumbItem>
          <CBreadcrumbItem font-weight="bold">{{ hooks.loader.donor.value?.name }}</CBreadcrumbItem>

          <template v-slot:separator>
            <CIcon name="chevron-right" color="gray.400" h="5" w="5" />
          </template>
        </CBreadcrumb>

        <PDonorCrmLink :donor="hooks.loader.donor.value" />
      </CFlex>

      <CFlex gap="8" w="100%">
        <CFlex
          flex="1"

          direction="column"
          w="100%"
          :max-w="{ base: '43%', '2xl': 900 }"
          :gap="6"
          pt="6"
          :px="{ base: 5, '2xl': 8 }"
          mt="-6"
          bg="white"
          border-right="1px solid"
          border-color="gray.100"
          box-shadow="xl"
        >
          <PForm
            :plan-id="props.planId"
            :donor-id="props.donorId"
          />
        </CFlex>

        <CFlex w="50%" pb="8">
          <PDonorDetail
            :plan-id="props.planId"
            :donor-id="props.donorId"
            p="0"
            :is-show-header="false"
          />
        </CFlex>
      </CFlex>
    </CFlex>
  </CBox>
</template>
