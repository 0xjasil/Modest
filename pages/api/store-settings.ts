import type { NextApiRequest, NextApiResponse } from "next";

export interface DeliveryBadge {
  id: string;
  icon: string;
  text: string;
  enabled: boolean;
}

export interface SizeGuideRow {
  size: string;
  heightRange: string;
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
  // Product page
  careInstructions: string;
  fabricFallback: string;
  sizeGuideRows: SizeGuideRow[];
  reviewsSectionTitle: string;
  reviewsSectionSubtitle: string;
  specsTableEnabled: boolean;
  sizeGuideEnabled: boolean;
  notFoundCategoryHref: string;
  // Notifications
  notificationBadgeColor: string;
  notificationDotColor: string;
  notificationUnreadBg: string;
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
  careInstructions: "Dry Clean or Gentle Machine Wash",
  fabricFallback: "Premium Crepe / Linen",
  sizeGuideRows: [
    { size: "50", heightRange: "5'0\" – 5'1\"" },
    { size: "52", heightRange: "5'2\" – 5'3\"" },
    { size: "54", heightRange: "5'4\" – 5'5\"" },
    { size: "56", heightRange: "5'6\" – 5'7\"" },
    { size: "58", heightRange: "5'8\" – 5'9\"" },
    { size: "60", heightRange: "5'10\"+" },
    { size: "62", heightRange: "5'11\"+" },
  ],
  reviewsSectionTitle: "Customer Reviews",
  reviewsSectionSubtitle: "Verified impressions from connoisseurs of Modest Studio.",
  specsTableEnabled: true,
  sizeGuideEnabled: true,
  notFoundCategoryHref: "/category/all",
  notificationBadgeColor: "#5C1A24",
  notificationDotColor: "#5C1A24",
  notificationUnreadBg: "#F5EDE6",
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }
  res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
  return res.status(200).json(DEFAULT_SETTINGS);
}
