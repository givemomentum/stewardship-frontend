<script lang="ts" setup>
  import Editor from '@tinymce/tinymce-vue';
  import { CButton, CFlex, CLink, CHeading } from "@chakra-ui/vue-next";
  import { onMounted, ref } from "vue";
  
  const state = {
    isVisible: ref(true),
  };
  
  const config = {
    apiKey: 'sqzu7ujp1iezh799a6xjbryjl4xjzzcktw0kopn9yxl3mzkr',
    plugins: 'mergetags anchor autolink charmap code codesample emoticons image link lists media searchreplace table visualblocks wordcount pagebreak checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tinycomments tableofcontents footnotes mergetags autocorrect',
    toolbar: 'blocks fontfamily fontsize | bold italic underline strikethrough | link image table mergetags pagebreak | spellcheckdialog a11ycheck | align lineheight | checklist numlist bullist indent outdent | removeformat',
    menubar: false,
    mergetags_list: [
      { value: 'first_name', title: 'First Name' },
      { value: 'email', title: 'Email' },
    ],
    content_css: 'document',
    height: 800
  }
  
  function reloadEditor() {
    state.isVisible.value = false;
    setTimeout(() => state.isVisible.value = true, 200);
  }
</script>

<template>
  <div>
    <CButton @click="reloadEditor()">Reload</CButton>

    <Editor
      v-if="state.isVisible.value"
      :init="config"
    />
  </div>
</template>
