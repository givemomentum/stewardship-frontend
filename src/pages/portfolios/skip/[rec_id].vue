<script setup lang="ts">
  import { TouchRec } from "~/apps/portfolios/interfaces";
  import { urls } from "~/urls";

  const hooks = {
    api: useApi(),
    route: useRoute(),
  };

  onBeforeMount(async () => {
    const rec: TouchRec = await hooks.api.getJson(`/portfolios/recs/${hooks.route.params['rec_id']}/`);

    navigateTo(urls.portfolios.contactDonor(
      rec.plan.id,
      rec.donor.id,
      rec.id,
      true,
    ));
  })
</script>

<template>

</template>
