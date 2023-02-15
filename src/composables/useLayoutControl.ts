const state = {
  bg: ref("white"),
  isPaddingEnabled: ref(true),
  isLeftMenuVisible: ref(true),
};

export function useLayoutControl() {
  return {
    bg: state.bg,
    isPaddingEnabled: state.isPaddingEnabled,
    isLeftMenuVisible: state.isLeftMenuVisible,
    activateLeanMode: () => {
      state.bg.value = "white";
      state.isPaddingEnabled.value = false;
      state.isLeftMenuVisible.value = false;
    },
    deactivateLeanMode: () => {
      state.bg.value = "gray.75";
      state.isPaddingEnabled.value = true;
      state.isLeftMenuVisible.value = true;
    },
  };
}
