<script lang="ts" setup>
  const isOpen = ref(true);
</script>

<template>
  <CButton @click="isOpen = true">open</CButton>

  <CModal
    v-model="isOpen"
    motion-preset="slideInBottom"
  >
    <CModalOverlay />

    <CModalContent>
      <CModalHeader>Modal Title</CModalHeader>
      <CModalCloseButton />
      <CModalBody>
        <CText>hello</CText>
      </CModalBody>

      <CModalFooter>
        <CButton @click="isOpen = false">
          Close
        </CButton>
      </CModalFooter>
    </CModalContent>
  </CModal>
</template>
