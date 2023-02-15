<script lang="ts" setup>
  import { Rec, Task } from "~/apps/tasks/interfaces";
  import { format } from "~/utils";
  import RRecExpectedValue from "~/apps/tasks/recs/r-donor-expected-value.vue";

  const props = defineProps<{
    rec: Rec;
    task: Task;
  }>();
</script>

<template>

  <CFlex gap="4" direction="column" pt="8">
    <CHeading font-size="2xl" color="gray.700" font-weight="normal">
      {{ props.rec.donor.name }}
    </CHeading>

    <RRecExpectedValue
      :task="props.task"
      :rec="props.rec"
      :is-show-total="false"
      key="3"
    />

    <CFlex
      mt="-1"
      :direction="{ base: 'column', lg: 'row' }"
      :gap="{ base: 3, lg: 20 }"
      flex-flow="wrap-reverse"
    >
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
        <chakra.tr v-if="props.rec.donor.birthday">
          <chakra.td>Birthday</chakra.td>
          <chakra.td>{{ format.date(props.rec.donor.birthday) }}</chakra.td>
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

        <chakra.tr v-if="props.rec.donor?.spouse_name">
          <chakra.td>Spouse</chakra.td>
          <chakra.td>{{ props.rec.donor.spouse_name }}</chakra.td>
        </chakra.tr>

        <chakra.tr v-if="props.rec.explanation">
          <chakra.td>Reason</chakra.td>
          <chakra.td color="gray.500">{{ props.rec.explanation }}
          </chakra.td>
        </chakra.tr>

      </chakra.table>

      <CFlex direction="column">
        <CFlex py="2" align="center" gap="2" v-if="props.rec.donor.email">
          <CIcon size="5" color="gray.500" name="email" />
          {{ props.rec.donor.email }}
          <CTag v-if="props.rec.donor.do_not_email">Do not email</CTag>
        </CFlex>
        <CFlex py="2" align="center" gap="2" v-if="props.rec.donor.phone">
          <CIcon size="5" fill="gray.500" name="io-call" />
          {{ props.rec.donor.phone }}
          <CTag v-if="props.rec.donor.do_not_call">Do not call</CTag>
        </CFlex>
        <CFlex py="2" align="center" gap="2" v-if="props.rec.donor.mailing_address.city">
          <CIcon size="5" fill="gray.500" name="fa-map-marker-alt" />
          {{ props.rec.donor.mailing_address.city }}, {{ props.rec.donor.mailing_address.state }}
          <CTag v-if="props.rec.donor.do_not_mail">Do not mail</CTag>
        </CFlex>
      </CFlex>
    </CFlex>
  </CFlex>

</template>

<style lang="scss" scoped>
  table {
    td {
      font-size: var(--chakra-fontSizes-md);
      padding: var(--chakra-space-3);
      padding-top: var(--chakra-space-2);
      padding-bottom: var(--chakra-space-2);
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
