<script lang="ts" setup>
  import { ref, watch } from "vue";
  import { EmailTemplate } from "~/apps/emails/interfaces";
  import { useForm } from "~/composables/useForm";
  import { useNotify } from "~/composables/useNotify";

  const props = defineProps<{
    template: EmailTemplate;
  }>();

  const emit = defineEmits<{
    (event: "update:template", templateHtml: string): void;
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
    form: useForm({
      path: () => `emails/templates/${props.template.pk}/`,
      method: "PATCH",
      getExtraData: () => ({
        content_html: state.templateHtml.value,
      }),
      onSuccess: async () => {
        hooks.notify.send("Template saved");
        emit("update:template", state.templateHtml.value);
        state.isDrawerOpen.value = false;
        // todo replace with reloading email content_html_default
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.reload();
      },
    }),
  };

  const state = {
    templateHtml: ref<string | null>(null),
    isDrawerOpen: ref(false),
  };

  watch(() => props.template, templateNew => {
    state.templateHtml.value = templateNew.content_html;
  }, { immediate: true });
</script>

<template>
  <CFlex>
    <CButton
      @click="state.isDrawerOpen.value = true"
      variant="outline"
      color-scheme="gray"
      gap="2"
    >
      <CIcon name="file-text" size="4" mb="2px" />
      Edit template
    </CButton>

    <ChakraDrawer
      v-model="state.isDrawerOpen.value"
      w="calc(850px + var(--chakra-spaces-6) * 2)"
    >
      <CFlex
        gap="3"
        direction="column"
        pb="1"
      >
        <CBox
          min-w="787"
          p="6"
          pt="4"
          bg="white"
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
                <FormKit name="subject" label="Subject" />
                <FormKit name="email_from" label="Email from" />
              </CFlex>

            </FormKit>

            <CBox
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
            </CBox>

          </CFlex>
        </CBox>
      </CFlex>
    </ChakraDrawer>
  </CFlex>
</template>
