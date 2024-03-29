<script lang="ts" setup>
  import { Rec, Task } from "~/apps/tasks/interfaces";
  import { format, getShortRecurringGiftDescription, supportsRecurringGiving } from "~/utils";
  import RRecExpectedValue from "~/apps/tasks/recs/r-donor-expected-value.vue";

  const props = defineProps<{
    rec: Rec;
    task: Task;
  }>();
</script>

<template>

  <CFlex gap="4" direction="column" pt="7">
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
      :direction="{ base: 'column', '2xl': 'row' }"
      :gap="{ base: 3, '2xl': 16 }"
    >
      <chakra.table>
        <chakra.tr>
          <chakra.td>Last gift</chakra.td>
          <chakra.td>{{ format.money(props.rec.donor.last_gift_amount) }} on
            {{ format.date(props.rec.donor.last_gift_date) }}
          </chakra.td>
        </chakra.tr>
        <chakra.tr>
          <chakra.td>Lifetime giving</chakra.td>
          <chakra.td>{{ format.money(props.rec.donor.donated_total) }}</chakra.td>
        </chakra.tr>
        <chakra.tr>
          <chakra.td>Giving since</chakra.td>
          <chakra.td>{{ format.date(props.rec.donor.giving_since) }}</chakra.td>
        </chakra.tr>
        <chakra.tr v-if="supportsRecurringGiving(props.rec.donor)">
          <chakra.td>Recurring giving</chakra.td>
          <chakra.td>{{ getShortRecurringGiftDescription(props.rec.donor) }}</chakra.td>
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

        <chakra.tr v-if="props.rec.donor?.communication_preferences">
          <chakra.td>Communication preferences</chakra.td>
          <chakra.td>{{ props.rec.donor.communication_preferences }}</chakra.td>
        </chakra.tr>

        <chakra.tr v-if="props.rec.donor?.crm_url">
          <chakra.td>CRM Profile</chakra.td>
          <chakra.td>
            <CLink
              :href="props.rec.donor?.crm_url"
              h="0"
              is-external
              @click.stop=""
            >
              <CButton right-icon="external-link" variant="link">
                <!-- Workaround for Donor Perfect link issue: Show Donor Id, so she can copy it.-->
                {{
                  props.rec.donor?.source == "donor_perfect" ? props.rec.donor?.source_id : "View"
                }}
              </CButton>
            </CLink>
          </chakra.td>
        </chakra.tr>

      </chakra.table>

      <CFlex direction="column">
        <CFlex
          v-if="props.rec.donor.email"
          :py="{ base: 1, '2xl': 2 }"
          align="center"
          gap="2"
          white-space="nowrap"
        >
          <CIcon size="5" color="gray.500" name="email" />
          {{ props.rec.donor.email }}
        </CFlex>
        <CFlex
          v-if="props.rec.donor.phone_number"
          :py="{ base: 1, '2xl': 2 }"
          align="center"
          gap="2"
          white-space="nowrap"
        >
          <CIcon size="5" fill="gray.500" name="io-call" />
          {{ props.rec.donor.phone_number }}
        </CFlex>
        <CFlex
          v-if="props.rec.donor.mailing_address?.city"
          :py="{ base: 1, '2xl': 2 }"
          align="center"
          gap="2"
          white-space="nowrap"
        >
          <CIcon size="5" fill="gray.500" name="fa-map-marker-alt" />
          {{ props.rec.donor.mailing_address.city }}, {{ props.rec.donor.mailing_address.state }}
        </CFlex>
      </CFlex>
    </CFlex>
  </CFlex>

</template>

<style lang="scss" scoped>
  table {
    td {
      font-size: var(--chakra-fontSizes-md);
      padding: 0;
      padding-top: var(--chakra-space-2);
      padding-bottom: var(--chakra-space-2);
      border-bottom: 0;
      vertical-align: top;

      // reduces padding on screens smaller than --chakra-breakpoints-2xl
      @media (max-width: 1536px) {
        padding-top: var(--chakra-space-1);
        padding-bottom: var(--chakra-space-1);
      }

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
