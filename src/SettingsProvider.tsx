import { createContext } from "react";

export const SettingsContext = createContext(undefined);

export const SettingsProvider = ({ settings, children }) => {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
