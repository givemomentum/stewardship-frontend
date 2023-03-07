<script lang="ts" setup>
  import Editor from "@tinymce/tinymce-vue";
  import { computed, ref, watch } from "vue";
  import { LetterTemplateVariable } from "~/apps/letters/interfaces";

  const props = defineProps<{
    modelValue?: string;
    variables?: LetterTemplateVariable[];
    isResizable?: boolean;
    isReadOnly?: boolean;
    isShowMenuBar?: boolean;
    isShowToolbar?: boolean;

    width?: number | string;
    padding?: string;
    minHeight?: string;
    editorBoxShadow?: string;
    editorBackground?: string;
    contentCssDefault?: string;
  }>();

  const state = {
    isVisible: ref(true),
    vars: ref(composeMergeTags(props.variables)),
    config: ref({
      block_formats: "Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3; Header 4=h4",
      plugins: "spellchecker mergetags anchor autolink charmap code codesample emoticons image link lists media searchreplace table visualblocks wordcount pagebreak checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker permanentpen powerpaste advtable advcode editimage tableofcontents footnotes mergetags autocorrect",
      toolbar: "styles | bold italic underline strikethrough | link image align | numlist bullist indent outdent | removeformat",
      mergetags_list: composeMergeTags(props.variables),
      font_size_formats: "8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
      font_family_formats: "Andale Mono=andale mono,times; Arial=arial, helvetica, sans-serif; Arial Black=arial black, avant garde; Calibri=Calibri; Book Antiqua=book antiqua,palatino; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
      content_css: "/styles/tiny-mce.css",
      width: props.width ?? "100%",
      height: props.minHeight ?? "570px",
      resize: props.isResizable ?? false,
      branding: false,
      menubar: props.isShowMenuBar ?? true,
      statusbar: false,
      // can't use css vars in /styles/tiny-mce.css because the editor is an iframe, plus easy to keep those in one place
      // language=CSS
      content_style: `
        :root {
          --mce-padding: ${props.padding ?? "1in"};
          --mce-min-height: ${props.minHeight};
          --mce-editor-box-shadow: ${props.editorBoxShadow};
          --mce-editor-background: ${props.editorBackground};
        }

        @media screen {
          html {
            background: #f4f4f4;
            /* noinspection CssUnresolvedCustomProperty */
            background: var(--mce-editor-background, none);
            max-height: 100%;
          }
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          margin-bottom: 0.5rem;
          min-height: var(--mce-min-height, 100%);
          box-shadow: var(--mce-editor-box-shadow, none);
          padding-left: var(--mce-padding) !important;
          padding-right: var(--mce-padding) !important;
        }

        @media screen {
          body {
            background-color: #fff;
            box-sizing: border-box;
            padding: var(--mce-padding);
          }
        }
        
        body {
          ${props.contentCssDefault ?? ""}
        }
      `,
    }),
  };

  watch(() => props.variables, variablesNew => {
    const isIncludeMergeTags = variablesNew && variablesNew.length > 0;

    let plugins = "anchor autolink charmap code codesample emoticons image link lists media searchreplace table visualblocks wordcount pagebreak checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker powerpaste advtable advcode editimage tableofcontents footnotes autocorrect autoresize";
    if (isIncludeMergeTags) {
      plugins += " mergetags";
    }
    state.config.value.plugins = plugins;
  }, { immediate: true });

  const emit = defineEmits(["update:modelValue"]);

  const value = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emit("update:modelValue", value);
    },
  });

  function composeMergeTags(vars?: LetterTemplateVariable[]): Array<{ value: string; title: string; }> {
    return vars?.map(variable => ({
      value: variable.key,
      title: variable.label ?? variable.key,
    })) ?? [];
  }
</script>

<template>
  <chakra.div v-if="state.isVisible.value" class="tiny-mce">
    <Editor
      api-key="sqzu7ujp1iezh799a6xjbryjl4xjzzcktw0kopn9yxl3mzkr"
      v-model="value"
      :init="state.config.value"
      :disabled="props.isReadOnly ?? false"
    />
  </chakra.div>

  <CFlex
    v-if="props.variables"
    direction="column"
    mt="7"
    gap="3"
  >
    <CFlex font-size="xl">Variables available</CFlex>
    <CFlex direction="column" gap="2">
      <CTag
        v-for="variable in props.variables"
        :key="variable.key"
        w="fit-content"
        font-size="md"
      >
        {{ variable.key }}
      </CTag>
    </CFlex>
  </CFlex>
</template>

<style lang="scss">
  .tiny-mce {
    .tox-edit-area__iframe {
      $toolbar-height: 88px;
      $page-pt: 32px;
      max-height: calc(100vh - $toolbar-height - $page-pt);
    }
    .tox {
      z-index: var(--chakra-zIndices-popover) !important;

      &.tox-tinymce {
        border-width: 1px;
        border-color: var(--chakra-colors-gray-200);
      }
      &.tox-tinymce.tox-tinymce--disabled {
        border-width: 1px;
        .tox-editor-header {
          display: none;
        }
      }
      &:not(.tox-tinymce-inline) .tox-editor-header {
        box-shadow: none;
        border-bottom: 1px solid;
        border-color: var(--chakra-colors-gray-200);
      }
    }
  }
</style>
