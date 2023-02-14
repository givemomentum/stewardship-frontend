const state = {
  bg: ref("white"),
  isPaddingEnabled: ref(true),
}

export function useLayoutControl() {
  return {
    bg: state.bg,
    isPaddingEnabled: state.isPaddingEnabled,
  };
}
