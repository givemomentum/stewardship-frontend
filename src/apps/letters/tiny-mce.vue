<script lang="ts" setup>
  import Editor from "@tinymce/tinymce-vue";
  import { CButton } from "@chakra-ui/vue-next";
  import { computed, ref, watch } from "vue";
  
  const props = defineProps<{ modelValue: string; }>();

  const state = {
    isVisible: ref(true),
  };

  const emit = defineEmits(["update:modelValue"]);

  const value = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emit("update:modelValue", value);
    },
  });

  const editorConfig = {
    block_formats: 'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3; Header 4=h4',
    plugins: "mergetags anchor autolink charmap code codesample emoticons image link lists media searchreplace table visualblocks wordcount pagebreak checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker permanentpen powerpaste advtable advcode editimage tableofcontents footnotes mergetags autocorrect",
    toolbar: "styles | bold italic underline strikethrough | link image mergetags align | checklist numlist bullist indent outdent | removeformat",
    mergetags_list: [
      { value: "first_name", title: "First Name" },
      { value: "email", title: "Email" },
    ],
    font_size_formats: '8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
    font_family_formats: "Andale Mono=andale mono,times; Arial=arial, helvetica, sans-serif; Arial Black=arial black, avant garde; Calibri=Calibri; Book Antiqua=book antiqua,palatino; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
    content_css: "/styles/tiny-mce.css",
    width: 850,
    height: 1300,
    minHeight: 1300,
    resize: false,
    branding: false,
    statusbar: false,
  };

  function reloadEditor() {
    state.isVisible.value = false;
    setTimeout(() => state.isVisible.value = true, 400);
  }
</script>

<template>
  <div v-if="state.isVisible.value">
    <Editor
      api-key="sqzu7ujp1iezh799a6xjbryjl4xjzzcktw0kopn9yxl3mzkr"
      v-model="value"
      :init="editorConfig"
    />
  </div>
</template>

<style lang="scss">
  .tox-edit-area__iframe {
    $toolbar-height: 88px;
    $page-pt: 32px;
    max-height: calc(100vh - $toolbar-height - $page-pt);
  }
</style>
