import React, { useContext, useMemo, useReducer } from "react";
import { htmlIdGenerator } from "@elastic/eui";
// eslint-disable-next-line import/no-unresolved
import { Toast } from "@elastic/eui/src/components/toast/global_toast_list";

export const addToastAction = (content: Toast) => ({
  type: "ADD_TOAST",
  payload: content,
});

export const removeToastAction = (content: Toast) => ({
  type: "REMOVE_TOAST",
  payload: content,
});

export function toastReducer(
  state: Toast[] = [],
  action: { type: string; payload: Toast }
) {
  switch (action.type) {
    case "ADD_TOAST":
      return state.concat([action.payload]);
    case "REMOVE_TOAST":
      return state.filter((toast) => toast.id !== action.payload.id);
    default:
      return state;
  }
}

export function createToast(
  title: string,
  color: "primary" | "success" | "warning" | "danger",
  iconType: string,
  text: string
): Toast {
  return {
    id: htmlIdGenerator()(),
    title: title,
    color: color,
    iconType: iconType,
    text: <p>{text}</p>,
  };
}

export function createSuccessToast(title: string, text: string) {
  return createToast(title, "success", "check", text);
}

export function createWarningToast(title: string, text: string) {
  return createToast(title, "warning", "help", text);
}

export function createDangerToast(title: string, text: string) {
  return createToast(title, "danger", "alert", text);
}

const ToastContext = React.createContext<{
  items: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (toast: Toast) => void;
}>({
  items: [],
  addToast: (toast: Toast) => {},
  removeToast: (toast: Toast) => {},
});
ToastContext.displayName = "ToastContext";

// eslint-disable-next-line @typescript-eslint/ban-types
export const ToastContextProvider = (props: React.PropsWithChildren<{}>) => {
  const [items, dispatch] = useReducer(toastReducer, []);

  const value = useMemo(
    () => ({
      items,
      addToast: (toast: Toast) => dispatch(addToastAction(toast)),
      removeToast: (toast: Toast) => dispatch(removeToastAction(toast)),
    }),
    [items, dispatch]
  );
  return (
    <ToastContext.Provider value={value}>
      {" "}
      {props.children}
    </ToastContext.Provider>
  );
};
export const useToastContext = () => useContext(ToastContext);
