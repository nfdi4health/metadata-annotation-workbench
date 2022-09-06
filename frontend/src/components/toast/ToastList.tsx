import React from "react";
import { EuiGlobalToastList } from "@elastic/eui";
import { useToastContext } from "./ToastContext";

export default () => {
  const { items, removeToast } = useToastContext();

  return (
    <EuiGlobalToastList
      toasts={items}
      dismissToast={removeToast}
      toastLifeTimeMs={3000}
    />
  );
};
