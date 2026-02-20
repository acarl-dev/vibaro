"use client";

import { useState, useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
};

export default function Toast({ message, type = "info", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <div
        className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg min-w-[200px] max-w-md`}
      >
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

export function useToast() {
  const [toastState, setToastState] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToastState({ show: true, message, type });
  };

  const hideToast = () => {
    setToastState({ ...toastState, show: false });
  };

  return { toastState, showToast, hideToast };
}

