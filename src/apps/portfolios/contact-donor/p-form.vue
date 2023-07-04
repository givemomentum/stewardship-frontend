<script lang="ts" setup>
  import { format } from "~/utils";
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
        <CTabList v-if="state.rec.value">
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
            :py="state.rec.value ? 4 : 0"
            px="0"
          >
            <CFlex v-if="state.rec.value?.scheduled_for_reason" w="100%" direction="column" mb="4">
              <CFormLabel
                font-size="sm"
                color="gray.500"
              >
                This recommendation was scheduled for {{ format.dateHumanShort(state.rec.value?.scheduled_for) }}
                with the note:
              </CFormLabel>
              <CText
                p="3"
                v-html="state.rec.value?.scheduled_for_reason"
                bg="gray.50"
                border-radius="md"
                border="1px solid"
                border-color="gray.200"
                key="5"
                font-style="italic"
                color="gray.700"
              />
            </CFlex>

            <PFormEmail
              v-if="type === 'email' && hooks.loader.donor.value"
              :donor="hooks.loader.donor.value"
              :rec="state.rec.value"
            />
            <PFormLog
              v-if="type === 'call' && hooks.loader.donor.value"
              :donor="hooks.loader.donor.value"
              :rec="state.rec.value"
            />
          </CTabPanel>
        </CTabPanels>
      </CTabs>
    </CFlex>

  </CBox>
</template>
