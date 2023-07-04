<script lang="ts" setup>
  import { TouchRec } from "~/apps/portfolios/interfaces";
  import { usePlanDonorLoader } from "~/apps/portfolios/usePlanDonorLoader";

  const props = defineProps<{
    planId: string | number;
    donorId: string | number;
    recId?: string;
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
    loader: usePlanDonorLoader(props.donorId, props.planId),
  };

  const state = {
    typeSelected: ref<typeof comp.types[number]>("email"),
    rec: ref(null as TouchRec | null),
  };

  const comp =  {
    types: ["email", "call"],
  };

  onMounted(async () => {
    if (props.recId) {
      state.rec.value = await hooks.api.getJson(`/portfolios/recs/${props.recId}/`);
    }
  });
</script>

<template>
  <CBox w="100%">

    <CFlex pos="relative" w="100%" direction="column" gap="6">

      <CTabs
        v-model="state.typeSelected.value"
        size="lg"
      >
        <CTabList>
          <CTab
            v-for="type in comp.types"
            :value="type"
            text-transform="capitalize"
          >
            {{ type }}
          </CTab>
        </CTabList>

        <CTabPanels>
          <CTabPanel
            v-for="type in comp.types"
            :value="type"
            px="0"
          >
            <PFormEmail
              v-if="type === 'email' && hooks.loader.donor.value"
              :donor="hooks.loader.donor.value"
              :rec="state.rec.value"
            />
<!--            <RRecActionLog-->
<!--              v-if="false"-->
<!--              type="call"-->
<!--            />-->
          </CTabPanel>
        </CTabPanels>
      </CTabs>
    </CFlex>

  </CBox>
</template>
