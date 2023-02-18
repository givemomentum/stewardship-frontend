import { POSITION, TYPE, useToast } from "vue-toastification";

const hooks = {
  toast: useToast(),
};

export function useNotify() {
  return {
    send: (message: string) => send(message),
    error: (message: string) => send(message, TYPE.ERROR),
  };
}

function send(message: string, type: TYPE = TYPE.DEFAULT) {
  hooks.toast(
    message,
    {
      type: type,
      position: POSITION.BOTTOM_CENTER,
      timeout: 3000,
      pauseOnFocusLoss: false,
      hideProgressBar: true,
      showCloseButtonOnHover: true,
      icon: false,
      draggable: false,
    },
  );
}
