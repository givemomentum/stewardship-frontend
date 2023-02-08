<template>
  <CFlex gap="5" pb="8" h="100%" overflow="hidden">

    <CFlex direction="column" gap="7">

      <CFlex h="fit-content">
        <ChakraTable size="sm" :min-w="isBatchSent() ? '500px' : '370px'" class="email-table" w="100%">

          <chakra.tbody>
            <!-- <tr ref="{}"> must be assigned wo `state.{}` and on a native html elements -->
            <tr
              v-for="(email, emailIndex) in state.emails.value"
              ref="tableRowRefs"
              :key="email.pk"
              @click="state.emailOpen.value = email; state.emailOpenIndex.value = emailIndex;"
              :data-key="email.pk"
              :data-is-selected="isSelected(email)"
              :data-is-viewed="email.is_viewed"
              class="table-row"
            >
              <chakra.td v-if="email.rec.donor.name" pr="0 !important" white-space="nowrap">
                {{ email.rec.donor.name }}
              </chakra.td>
              <chakra.td v-else pr="0 !important" white-space="nowrap">
                Unknown
              </chakra.td>

              <chakra.td v-if="isBatchSent()">
                <CBox
                  py="2px"
                  px="2"
                  w="fit-content"
                  border-radius="lg"
                  text-transform="capitalize"
                  font-size="xs"
                  :bg="getStatusStyle(email).bg"
                  :color="getStatusStyle(email).color"
                >
                  {{ email.status }}
                </CBox>
              </chakra.td>

              <chakra.td v-if="isBatchSent()">
                {{ email.open_count || "" }}
              </chakra.td>

              <chakra.td v-if="isBatchSent()">
                {{ format.datetimeHumanShort(email.opened_first_at) }}
              </chakra.td>

              <chakra.td v-if="!isBatchSent()" data-is-numeric="true">
                {{ format.money(email.rec.donor.donated_total) }}
              </chakra.td>

              <chakra.td data-is-numeric="true">
                <CIcon v-if="email.content_html" name="check-square" mb="1" size="4" color="gray.500" />
              </chakra.td>

            </tr>
          </chakra.tbody>
        </ChakraTable>
      </CFlex>

    </CFlex>

  </CFlex>

</template>
