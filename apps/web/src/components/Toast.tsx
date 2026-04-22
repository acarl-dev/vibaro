"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  subtext?: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
};

export default function Toast({ message, subtext, type = "info", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const accent =
    type === "success"
      ? "border-l-4 border-green-500"
      : type === "error"
      ? "border-l-4 border-red-500"
      : "border-l-4 border-blue-500";

  return (
    <div className={`bg-zinc-800 text-zinc-50 px-4 py-3 rounded-lg shadow-xl min-w-[220px] max-w-sm ${accent} animate-in slide-in-from-bottom-3`}>
      <p className="text-sm font-medium leading-snug">{message}</p>
      {subtext && (
        <p className="text-xs text-zinc-400 mt-0.5">{subtext}</p>
      )}
    </div>
  );
}

