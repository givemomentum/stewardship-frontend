<script setup lang="ts">
  import { ref, watch } from "vue";
  import { POSITION, useToast } from "vue-toastification";
  import { LetterTemplate } from "~/apps/letters/interfaces";
  import { useLetterBatchStore } from "~/apps/letters/useLetterBatchStore";
  import { useApi } from "~/composables/useApi";
  import { useForm } from "~/composables/useForm";

  const props = defineProps<{
    template: LetterTemplate;
  }>();

  const state = {
    templateHtml: ref(props.template.html),
  };

  const hooks = {
    api: useApi(),
    batchStore: useLetterBatchStore(),
    toast: useToast(),
    form: useForm({
      path: () => `letters/templates/${props.template.pk}/`,
      method: "PATCH",
      getExtraData: () => ({
        html: state.templateHtml.value,
      }),
      onSuccess: async () => {
        await hooks.batchStore.load();
        props.template.html = state.templateHtml.value;
        hooks.toast.success(
          "Template saved",
          { position: POSITION.TOP_RIGHT },
        );
      },
    }),
  };

  watch(() => props.template, templateNew => {
    state.templateHtml.value = templateNew.html;
  });

  function isHtmlChanged() {
    return state.templateHtml.value.valueOf() !== props.template.html.valueOf();
  }
</script>

<template>
  <CFlex gap="3" direction="column">
    <CBox
      p="6"
      pt="4"
      bg="white"
      border="1px solid"
      border-color="gray.100"
    >
      <CFlex justify="flex-start" direction="column">
        <FormKit
          type="form"
          :value="props.template"
          :key="props.template.pk"
          @submit="hooks.form.submit"
          :actions="false"
        >

          <CFlex w="100%" gap="6">
            <CFlex w="100%">
              <FormKit name="name" label="Name" />
            </CFlex>

            <CFlex w="100%" pt="32px">
              <FormKit type="submit" label="Save changes" size="md" />
            </CFlex>
          </CFlex>

        </FormKit>

        <CFormLabel mt="3">Template</CFormLabel>
        <CFlex
          pos="relative"
          w="100%"
          h="100%"
          direction="row"
          gap="8"
          max-h="100vh"
        >
          <TinyMce
            :variables="props.template.variables"
            v-model="state.templateHtml.value"
            content-css-default="font-family: Calibri; font-size: 11pt;"
          />
        </CFlex>

      </CFlex>
    </CBox>
  </CFlex>
</template>

<style lang="scss">
  //noinspection CssUnknownTarget
  @import '~/styles/chakra-ui.scss';
  //noinspection CssUnknownTarget
  @import '~/styles/formkit.scss';
</style>
