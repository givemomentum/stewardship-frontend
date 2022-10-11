<script setup lang="ts">
  import { CFlex, CLink, CHeading, CButton } from "@chakra-ui/vue-next";
  import { FiscScan } from "~/interfaces";
  import { urls } from "~/urls";

  const props = defineProps<{
    scanOpen: FiscScan;
  }>();

</script>

<template>
  <CFlex direction="column" gap="4">
    <CFlex justify="space-between" align="center" min-w="418px">
      <CHeading font-size="1.5rem" font-weight="normal">
        Existing donor
      </CHeading>
    </CFlex>

    <div>
      <CLink
        v-if="props.scanOpen.is_existing_donor"
        :href="urls.donorPerfect.donor(props.scanOpen.donor_id)"
        isExternal>
        <CButton
          right-icon="external-link"
          size="md"
        >
          Edit in DonorPerfect
        </CButton>
      </CLink>
    </div>

  </CFlex>
</template>
