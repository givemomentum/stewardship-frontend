<script lang="ts" setup>
  import { CrmDonor } from "~/apps/letters/interfaces";

  const props = defineProps<{
    donor?: CrmDonor;
  }>();
</script>

<template>
  <CLink
    :href="donor?.crm_url"
    is-external
  >
    <CButton
      right-icon="external-link"
      variant="outline"
      color-scheme="gray"
      bg="white"
    >
      <!-- Workaround for Donor Perfect link issue: Show Donor Id, so she can copy it.-->
      {{
        donor?.source == "donor_perfect" ? donor?.source_id : "CRM Profile"
      }}
    </CButton>
  </CLink>
</template>
