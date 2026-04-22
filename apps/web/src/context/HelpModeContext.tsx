"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type HelpModeContextType = {
  helpMode: boolean;
  toggleHelpMode: () => void;
  helpHubOpen: boolean;
  openHelpHub: () => void;
  closeHelpHub: () => void;
};

const HelpModeContext = createContext<HelpModeContextType>({
  helpMode: false,
  toggleHelpMode: () => {},
  helpHubOpen: false,
  openHelpHub: () => {},
  closeHelpHub: () => {},
});

export function HelpModeProvider({ children }: { children: ReactNode }) {
  const [helpMode, setHelpMode] = useState(false);
  const [helpHubOpen, setHelpHubOpen] = useState(false);

  // Persist via localStorage so it survives browser restarts
  useEffect(() => {
    try {
      const stored = localStorage.getItem("vibaro_help_mode");
      if (stored === "1") setHelpMode(true);
    } catch {
      // localStorage unavailable (e.g. private mode restrictions) — ignore
    }
  }, []);

  const toggleHelpMode = () => {
    setHelpMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("vibaro_help_mode", next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  const openHelpHub = () => setHelpHubOpen(true);
  const closeHelpHub = () => setHelpHubOpen(false);

  return (
    <HelpModeContext.Provider value={{ helpMode, toggleHelpMode, helpHubOpen, openHelpHub, closeHelpHub }}>
      {children}
    </HelpModeContext.Provider>
  );
}

export function useHelpMode() {
  return useContext(HelpModeContext);
}
