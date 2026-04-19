"use client";

import { Toast as RadixToast } from "radix-ui";

import styles from "./ToastProvider.module.css";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RadixToast.Provider swipeDirection="right">
      {children}
      <RadixToast.Viewport className={styles.viewport} />
    </RadixToast.Provider>
  );
};
