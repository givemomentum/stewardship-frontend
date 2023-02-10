const state = {
  color: ref("white"),
}

export function useBackgroundColorControl() {
  return {
    color: state.color,
  };
}
