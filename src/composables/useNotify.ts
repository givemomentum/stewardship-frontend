import { POSITION, TYPE, useToast } from "vue-toastification";

const hooks = {
  toast: useToast(),
};

export function useNotify() {
  return {
    send: (message: string) => hooks.toast(
      message,
      {
        type: TYPE.DEFAULT,
        position: POSITION.BOTTOM_CENTER,
        timeout: 2100,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
        showCloseButtonOnHover: true,
        icon: false,
        draggable: false,
      },
    ),
  };
}
