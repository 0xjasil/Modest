import type { NextApiRequest, NextApiResponse } from "next";

/**
 * GET /api/store-settings
 * Returns the store settings stored by the admin panel.
 * Since both admin and frontend run in the same browser the admin localStorage
 * key is authoritative.  On the server-side (SSR/ISR) we return defaults.
 *
 * The frontend reads this route client-side so it always gets fresh data.
 */

export interface DeliveryBadge {
  id: string;
  icon: string;
  text: string;
  enabled: boolean;
}

export interface StoreSettings {
  freeShippingThreshold: number;
  standardShippingFee: number;
  codAvailable: boolean;
  returnWindowDays: number;
  deliveryBadges: DeliveryBadge[];
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  storeName: string;
  storeTagline: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  heroBannerTitle: string;
  heroBannerSubtitle: string;
  announcementBarText: string;
  announcementBarEnabled: boolean;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  freeShippingThreshold: 1500,
  standardShippingFee: 99,
  codAvailable: true,
  returnWindowDays: 7,
  deliveryBadges: [
    { id: "shipping", icon: "🚚", text: "Free Shipping over ₹1,500 (else ₹99)", enabled: true },
    { id: "cod",      icon: "💵", text: "Cash on Delivery Available",           enabled: true },
    { id: "return",   icon: "🔄", text: "7 Days Easy Return/Exchange",          enabled: true },
    { id: "quality",  icon: "✨", text: "100% Quality Assurance",               enabled: true },
  ],
  deliveryDaysMin: 3,
  deliveryDaysMax: 5,
  storeName: "Modest Studio",
  storeTagline: "Beauty Beyond Today",
  supportEmail: "support@moodest.in",
  supportPhone: "+91 98765 43210",
  currency: "INR",
  heroBannerTitle: "Luxury Modest Fashion",
  heroBannerSubtitle: "Discover our exclusive Abaya collection",
  announcementBarText: "Free shipping on orders over ₹1,500 | Use code MODEST10 for 10% off",
  announcementBarEnabled: true,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Server-side always returns defaults; the client-side hook overlays localStorage
  res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
  return res.status(200).json(DEFAULT_SETTINGS);
}
