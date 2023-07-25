import { POSITION, TYPE, useToast } from "vue-toastification";

const hooks = {
  toast: useToast(),
};

export function useNotify() {
  return {
    send: (message: string) => send(message),
    error: (message: string) => send(message, TYPE.ERROR, 7000),
  };
}

function send(message: string, type: TYPE = TYPE.DEFAULT, timeout = 4500) {
  hooks.toast(
    message,
    {
      type: type,
      position: POSITION.BOTTOM_CENTER,
      timeout: timeout,
      pauseOnFocusLoss: false,
      hideProgressBar: true,
      showCloseButtonOnHover: true,
      icon: false,
      draggable: false,
    },
  );
}
