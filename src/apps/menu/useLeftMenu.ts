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
  console.log("show");
  isAdminBarVisible.value = true;
}

function hideAdminBar() {
  console.log("hide");
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
