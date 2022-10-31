import { ref } from "vue";

const isFullWidth = ref(true);

const isAdminBarVisible = ref(false);

function collapse() {
  isFullWidth.value = false;
}

function unfold() {
  isFullWidth.value = true;
}

function showAdminBar() {
  isAdminBarVisible.value = true;
}

function hideAdminBar() {
  isAdminBarVisible.value = false;
}

export function useLeftMenu() {
  return {
    isFullWidth,
    isAdminBarVisible,
    collapse,
    unfold,
    showAdminBar,
    hideAdminBar,
  };
}
