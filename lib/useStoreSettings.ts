/**
 * useStoreSettings
 * Client-side hook that reads store settings the admin saved to localStorage
 * (key: "moodest_store_settings_v1"). Falls back to the defaults from the API.
 * Updates automatically when the admin changes settings in the same browser.
 */

import { useState, useEffect } from "react";
import type { StoreSettings } from "../pages/api/store-settings";
import { DEFAULT_SETTINGS } from "../pages/api/store-settings";

const SETTINGS_KEY = "moodest_store_settings_v1";

function readFromStorage(): StoreSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<StoreSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      deliveryBadges:
        parsed.deliveryBadges && parsed.deliveryBadges.length > 0
          ? parsed.deliveryBadges
          : DEFAULT_SETTINGS.deliveryBadges,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useStoreSettings(): StoreSettings {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // Read once on mount
    setSettings(readFromStorage());

    // Listen for changes from admin panel (same tab or other tabs)
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === SETTINGS_KEY) {
        setSettings(readFromStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return settings;
}

export type { StoreSettings };
export { DEFAULT_SETTINGS };
