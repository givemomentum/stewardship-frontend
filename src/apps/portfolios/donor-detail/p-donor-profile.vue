<script lang="ts" setup>
  import { PrimaryKey } from "~/apps/auth/interfaces";
  import { DonorProfileSection } from "~/apps/letters/interfaces";
  import { usePlanDonorLoader } from "~/apps/portfolios/usePlanDonorLoader";
  import { useComp } from "~/structs";

  const props = defineProps<{
    donorId: PrimaryKey;
    planId: PrimaryKey;
  }>();

  const hooks = {
    loader: usePlanDonorLoader(props.donorId, props.planId),
  };

  const state = {
    isSectionModalOpen: ref(false),
  };

  const comp = useComp(() => {
    const sectionsEmpty = computed(() => hooks.loader.donorProfile.value.filter(section => !section.version));
    return {
      sectionsEmpty: sectionsEmpty,
    }
  });

  watch(comp.sectionsEmpty.value, () => {
    // in case the Summary section is empty - show it to MGO
    // otherwise we would be showing the "Notes" tab with nothing in it which looks broken
    const sectionEmptySummary = comp.sectionsEmpty.value.find(
      section => section.name === "Summary"
    );
    if (sectionEmptySummary) {
      makeEmptySectionVisible(sectionEmptySummary);
    }
  }, { immediate: true });

  function makeEmptySectionVisible(sectionToShow: DonorProfileSection) {
    const sectionEmptySource = hooks.loader.donorProfile.value.find(
      section => section.id === sectionToShow.id
    );
    // make it not empty anymore, since `version` was `null` before
    sectionEmptySource.version = {
      content_md: "",
    };
    state.isSectionModalOpen.value = false;
  }
</script>

<template>
  <CFlex
    direction="column"
    gap="4"
  >
    <CFlex
      v-if="hooks.loader.donorProfile.value.length > 0"
      direction="column"
    >
      <CBox
        v-for="section in hooks.loader.donorProfile.value"
        :key="section.id"
      >
        <PDonorProfileSection
          v-if="section.version"
          :section="section"
          :plan-id="props.planId"
        />
      </CBox>
    </CFlex>

    <CButton
      v-if="comp.sectionsEmpty.value.length > 0"
      @click="state.isSectionModalOpen.value = true"
      variant="outline"
      color-scheme="gray"
      size="sm"
      w="fit-content"
    >
      <CIcon name="plus" mr="2" />
      Add section
    </CButton>

    <CModal
      v-if="state.isSectionModalOpen.value"
      v-model="state.isSectionModalOpen.value"
    >
      <CModalOverlay />
      <CModalContent max-w="350px">
        <CModalHeader>Choose the section to add</CModalHeader>
        <CModalCloseButton mt="2" />
        <CModalBody pb="6">
          <CStack gap="2">
            <CButton
              v-for="section in comp.sectionsEmpty.value"
              :key="section.id"
              @click="makeEmptySectionVisible(section)"
            >
              {{ section.name }}
            </CButton>
          </CStack>
        </CModalBody>
      </CModalContent>
    </CModal>
  </CFlex>
</template>
