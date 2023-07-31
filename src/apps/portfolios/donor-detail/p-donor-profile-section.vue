<script lang="ts" setup>
  import { captureException } from "@sentry/vue";
  import { marked } from "marked";
  import { nextTick } from "vue";
  import { PrimaryKey } from "~/apps/auth/interfaces";
  import { DonorProfileSection } from "~/apps/letters/interfaces";
  import { usePlanDonorLoader } from "~/apps/portfolios/usePlanDonorLoader";

  const props = defineProps<{
    section: DonorProfileSection;
    planId: PrimaryKey;
  }>();

  const hooks = {
    loader: usePlanDonorLoader(props.section.donor_id, props.planId),
    api: useApi(),
    notify: useNotify(),
  };

  const state = {
    contentHtml: ref(""),
    isChangesUnsaved: ref(false),
    isSaving: ref(false),
  };

  watch(() => props.section, () => {
    state.contentHtml.value = marked(props.section.version?.content_md ?? "");
  }, { immediate: true });

  watch(state.contentHtml, () => {
    state.isChangesUnsaved.value = true;
  });

  function resetChanges() {
    state.contentHtml.value = marked(props.section.version?.content_md ?? "");
    // contentHtml update triggers the watch() above
    // so wait for it to finish with nextTick()
    nextTick(() => {
      state.isChangesUnsaved.value = false;
    });
  }

  async function saveChanges() {
    state.isSaving.value = true;
    try {
      const sectionNewResponse = await hooks.api.post(`/donor-profiles/${props.section.donor_id}/section-versions`, {
        section_id: props.section.id,
        content_html: state.contentHtml.value,
      });

      // use .value to trigger the rerender of PDonorProfile
      const sectionUpdated = hooks.loader.donorProfile.value.find(
        section => section.id === props.section.id
      );
      sectionUpdated.version = sectionNewResponse.data;

      state.isChangesUnsaved.value = false;
      hooks.notify.send("Changes saved");
    } catch (error) {
      state.isChangesUnsaved.value = true;
      captureException(error);
      hooks.notify.error("An error occurred, the error report was sent to our tech team");
    }
    state.isSaving.value = false;
  }
</script>

<template>
  <CFlex direction="column" w="100%" gap="2">
    <CText
      font-size="sm"
      font-weight="bold"
      color="gray.500"
      text-transform="uppercase"

    >
      {{ section.name }}
    </CText>

    <NuxtCkeditorInvisible
      class="desc-full"
      v-model="state.contentHtml.value"
      :placeholder="props.section.placeholder || '- add your bullet points about the donor'"
    />

    <CFlex v-if="state.isChangesUnsaved.value" gap="3" mt="1">
      <CButton
        w="fit-content"
        size="sm"
        :is-loading="state.isSaving.value"
        @click="saveChanges"
      >
        Save changes
      </CButton>
      <CButton
        w="fit-content"
        size="sm"
        variant="outline"
        @click="resetChanges"
        :is-loading="state.isSaving.value"
      >
        Cancel
      </CButton>
    </CFlex>
  </CFlex>
</template>
