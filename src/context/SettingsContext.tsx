import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  baseUrl: string;
  maxReservationDays: number;
  minAdvanceHours: number;
  emailNotifications: {
    newReservation: boolean;
    posterRequest: boolean;
  };
}

const defaultSettings: Settings = {
  baseUrl: 'https://presentoirs.example.com/stand/',
  maxReservationDays: 30,
  minAdvanceHours: 24,
  emailNotifications: {
    newReservation: true,
    posterRequest: true,
  },
};

const SettingsContext = createContext<{
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('display-stand-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('display-stand-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsProvider;