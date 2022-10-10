import { ref } from "vue";

const isFullWidth = ref(true);

function collapse() {
  isFullWidth.value = false;
}

function unfold() {
  isFullWidth.value = true;
}

export function useLeftMenu() {
  return {
    isFullWidth: isFullWidth,
    collapse: collapse,
    unfold: unfold,
  };
}
