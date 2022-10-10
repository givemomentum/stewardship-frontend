<script setup lang="ts">
  import { useRoute } from "#app";
  import { CFlex, CText, CHeading, chakra } from "@chakra-ui/vue-next";
  import { onBeforeMount, onMounted, onUnmounted, ref, watch } from "vue";
  import MenuBreadcrumbs from "~/components/menu/menu-breadcrumbs.vue";
  import { useApi } from "~/composables/useApi";
  import { useForm } from "~/composables/useForm";
  import { useLeftMenu } from "~/composables/useLeftMenu";
  import { FiscGift, FiscOptOut, PrimaryKey } from "~/interfaces";

  const hooks = {
    route: useRoute(),
    api: useApi(),
    menu: useLeftMenu(),
    form: useForm({
      path: (giftPk: PrimaryKey) => `fisc/gifts/${giftPk}/`,
      getPathArg: () => state.scanOpen.value.gift.pk,
      method: "PATCH",
      onSuccess: loadScans,
    }),
  };

  const state = {
    scans: ref<FiscScan[]>([]),
    scanOpenIndex: ref<number>(null),
    scanOpen: ref<FiscScan>(null),
    gift: ref<FiscGift>(null),
  };

  watch(state.scanOpen, (scanNew: FiscScan) => {
    state.gift.value = scanNew.gift;
  });

  async function loadScans() {
    const res = await hooks.api.$get(`/fisc/scans/?date=${hooks.route.params.date}`);
    state.scans.value = res.data;
  }

  interface FiscScan {
    pk: PrimaryKey;
    image_front: URL;
    image_back: URL;
    account: number;
    donor_id: number;
    date?: string;
    amount: string;
    gift?: FiscGift;
    optout?: FiscOptOut;
    is_viewed: boolean;
    is_duplicated: boolean;
  }
</script>

<template>
  <CFlex direction="column" v-if="state.gift.value" gap="4">
    <CHeading font-size="2xl">Update Gift</CHeading>
    
    <FormKit
      type="form"
      @submit="hooks.form.submit"
      :actions="false"
      :value="state.gift.value"
    >
      <CFlex justify="flex-start" direction="column">
        <CFlex gap="4">
          <FormKit name="first_name" label="first_name" />
          <FormKit name="last_name" label="last_name" />
        </CFlex>
        
        <FormKit name="address" label="address" />
        
        <CFlex gap="4">
          <FormKit name="address2" label="address2" />
          <FormKit name="zip" label="zip" />
        </CFlex>

        <CFlex gap="4">
          <FormKit name="city" label="city" />
          <FormKit name="state" label="state" />
        </CFlex>
        
        <FormKit name="ty_letter_no" label="ty_letter_no" />

        <CFlex gap="4">
          <FormKit name="sub_solicit_code" label="sub_solicit_code" />
          <FormKit name="gift_narrative" label="gift_narrative" />
        </CFlex>
        
        <FormKit name="gift_narrative" label="gift_narrative" />

        <FormKit type="submit" label="Save" size="md" />
      </CFlex>
    </FormKit>
  </CFlex>
</template>
