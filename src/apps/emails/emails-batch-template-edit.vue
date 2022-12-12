<script setup lang="ts">
  import { ref, watch } from "vue";
  import { POSITION, useToast } from "vue-toastification";
  import { useEmailBatchStore } from "~/apps/emails/useEmailBatchStore";
  import { useApi } from "~/composables/useApi";
  import { useForm } from "~/composables/useForm";
  import { EmailTemplate } from "~/apps/emails/interfaces";

  const props = defineProps<{
    template: EmailTemplate;
  }>();

  const state = {
    templateHtml: ref(props.template.content_html),
  };

  const hooks = {
    api: useApi(),
    toast: useToast(),
    batchStore: useEmailBatchStore(),
    form: useForm({
      path: () => `emails/templates/${props.template.pk}/`,
      method: "PATCH",
      getExtraData: () => ({
        content_html: state.templateHtml.value,
      }),
      onSuccess: async () => {
        await hooks.batchStore.load();
        props.template.content_html = state.templateHtml.value;
        hooks.toast.success(
          "Template saved",
          { position: POSITION.TOP_RIGHT },
        );
      },
    }),
  };

  watch(() => props.template, templateNew => {
    state.templateHtml.value = templateNew.content_html;
  });

  function isHtmlChanged() {
    return state.templateHtml.value.valueOf() !== props.template.content_html.valueOf();
  }
</script>

<template>
  <CFlex gap="3" direction="column">
    <CBox
      min-w="787"
      p="6"
      pt="4"
      bg="white"
      border="1px solid"
      border-color="gray.100"
    >
      <CFlex justify="flex-start" direction="column" gap="6">
        <FormKit
          type="form"
          :value="props.template"
          :key="props.template.pk"
          @submit="hooks.form.submit"
          :actions="false"
        >

          <CFlex w="100%" gap="6" align="center" key="3" mt="2">
            <CHeading w="100%" variant="page-header">
              {{ props.template.title }}
            </CHeading>

            <CFlex w="100%" mb="-13px">
              <FormKit type="submit" label="Save changes" size="md" />
            </CFlex>
          </CFlex>
          
          <CFlex w="100%" gap="6" mt="6">
            <FormKit name="subject" label="Subjet" />
            <FormKit name="email_from" label="Email from" />
          </CFlex>

        </FormKit>

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
            padding="1rem"
            v-model="state.templateHtml.value"
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
