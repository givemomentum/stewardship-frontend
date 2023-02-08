<script lang="ts" setup>
  import { Recommendation } from "~/apps/tasks/interfaces";
  import { format } from "~/utils";

  const props = defineProps<{
    rec: Recommendation;
  }>();
</script>

<template>

  <CFlex gap="4" direction="column">
    <CHeading font-size="2xl" color="gray.500" font-weight="normal">
      Summary
    </CHeading>
    <CHStack spacing="20" font-size="lg">
      <chakra.table>

        <chakra.tr>
          <chakra.td>Last gift</chakra.td>
          <chakra.td>{{ format.money(props.rec.donor.last_gift_amount) }}, {{ format.date(props.rec.donor.last_gift_date) }}</chakra.td>
        </chakra.tr>
        <chakra.tr>
          <chakra.td>Lifetime giving</chakra.td>
          <chakra.td>{{ format.money(props.rec.donor.donated_total) }}</chakra.td>
        </chakra.tr>
        <chakra.tr>
          <chakra.td>Giving since</chakra.td>
          <chakra.td>{{ format.date(props.rec.donor.giving_since) }}</chakra.td>
        </chakra.tr>

        <chakra.tr
          v-if="props.rec.donor"
          v-for="(data, fieldName) in props.rec.donor.custom_data"
          :key="fieldName"
        >
          <chakra.td>{{ data["label"] }}</chakra.td>
          <chakra.td>{{ data["value"] }}</chakra.td>
        </chakra.tr>

        <chakra.tr
          v-if="props.rec.gift"
          v-for="(data, fieldName) in props.rec.gift.custom_data"
          :key="fieldName"
        >
          <chakra.td>{{ data["label"] }}</chakra.td>
          <chakra.td>{{ data["value"] }}</chakra.td>
        </chakra.tr>

        <chakra.tr v-if="props.rec.explanation">
          <chakra.td>Reason</chakra.td>
          <chakra.td color="gray.500">{{ props.rec.explanation }}
          </chakra.td>
        </chakra.tr>

      </chakra.table>

      <CFlex direction="column" font-size="lg">
        <CFlex py="1" align="center" gap="2" v-if="props.rec.donor.email">
          <CIcon size="5" color="gray.500" name="email" />
          {{ props.rec.donor.email }}
        </CFlex>
        <CFlex py="1" align="center" gap="2" v-if="props.rec.donor.phone">
          <CIcon size="5" fill="gray.500" name="io-call" />
          {{ props.rec.donor.phone }}
        </CFlex>
        <CFlex py="1" align="center" gap="2" v-if="props.rec.donor.mailing_address.city">
          <CIcon size="5" fill="gray.500" name="fa-map-marker-alt" />
          {{ props.rec.donor.mailing_address.city }}, {{ props.rec.donor.mailing_address.state }}
        </CFlex>
      </CFlex>
    </CHStack>
  </CFlex>

</template>

<style lang="scss" scoped>
  table {
    td {
      font-size: var(--chakra-fontSizes-lg);
      padding: var(--chakra-space-3);
      padding-top: var(--chakra-space-1);
      padding-bottom: var(--chakra-space-1);
      padding-left: 0;
      border-bottom: 0;
      vertical-align: top;

      &:first-of-type {
        font-weight: bold;
        white-space: nowrap;
      }
      &:last-of-type {
        padding-left: var(--chakra-space-3);
      }
    }
  }
</style>
