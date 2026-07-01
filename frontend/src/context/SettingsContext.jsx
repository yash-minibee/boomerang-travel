import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/api";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    company_name: "Boomerang Global Travel",
    phone: "+91 98765 43210",
    email: "hello@boomerangtravel.com",
    address: "Level 12, Cyber Hub, DLF Phase 2, Gurugram — 122002",
    whatsapp_number: "919876543210",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    youtube_url: "",
    site_title: "Boomerang Global Travel",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSettings()
      .then(res => {
        if (res && res.data) {
          setSettings(prev => ({ ...prev, ...res.data }));
        }
      })
      .catch(err => {
        console.warn("Failed to load settings from API:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
