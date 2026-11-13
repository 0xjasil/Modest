export const BRAND_NAME = "Modest Studio";
export const BRAND_TAGLINE = "Premium Abaya • Modest Wears • Accessories";
export const BRAND_DESCRIPTION =
  "Discover luxury abayas, open front kimonos, silk kaftans, and modest accessories crafted with unmatched elegance and modesty.";

export const SIZES = ["50", "52", "54", "56", "58", "60", "62"] as const;
export type AbayaSize = (typeof SIZES)[number];

export interface SizeGuideRow {
  size: AbayaSize;
  lengthInches: number;
  bustInches: number;
  recommendedHeight: string;
}

export const SIZE_GUIDE: SizeGuideRow[] = [
  { size: "50", lengthInches: 50, bustInches: 40, recommendedHeight: "4'11\" - 5'1\"" },
  { size: "52", lengthInches: 52, bustInches: 42, recommendedHeight: "5'1\" - 5'3\"" },
  { size: "54", lengthInches: 54, bustInches: 44, recommendedHeight: "5'3\" - 5'5\"" },
  { size: "56", lengthInches: 56, bustInches: 46, recommendedHeight: "5'5\" - 5'7\"" },
  { size: "58", lengthInches: 58, bustInches: 48, recommendedHeight: "5'7\" - 5'9\"" },
  { size: "60", lengthInches: 60, bustInches: 50, recommendedHeight: "5'9\" - 5'11\"" },
  { size: "62", lengthInches: 62, bustInches: 52, recommendedHeight: "5'11\"+" },
];

/**
 * Single source of truth for storefront commerce rules.
 * MUST stay in sync with the NestJS OrdersService pricing:
 *   shippingAmount = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
 *   taxAmount      = 0 (GST is inclusive)
 */
export const FREE_SHIPPING_THRESHOLD = 1500;
export const STANDARD_SHIPPING_FEE = 99;
export const EXPRESS_SHIPPING_FEE = 299;

/** Shipping fee for a given bag subtotal (all amounts in INR). */
export function getShippingFee(subtotal: number): number {
  if (!Number.isFinite(subtotal) || subtotal <= 0) return 0;
  return subtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

/** Amount still needed to unlock complimentary shipping (0 once unlocked). */
export function getAmountToFreeShipping(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD + 1 - Math.floor(subtotal));
}

export const NAV_LINKS = [
  { label: "Front Open", href: "/category/front-open" },
  { label: "Double Shrug", href: "/category/double-shrug" },
  { label: "Basic Kaftans", href: "/category/basic-kaftan" },
  { label: "Daily Wear", href: "/category/daily-wear" },
  { label: "Kimono Abayas", href: "/category/kimono-abaya" },
  { label: "Embroidery", href: "/category/embroidery-abaya" },
  { label: "Handwork", href: "/category/handwork-abaya" },
  { label: "Bridal Wear", href: "/category/bridal-wear" },
  { label: "Jilbabs", href: "/category/jilbabs" },
  { label: "Chiffon Stoles", href: "/category/hijabs-stoles" },
  { label: "Accessories", href: "/category/caps-accessories" },
  { label: "Special Offers", href: "/category/all" },
];

export const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "discount", label: "Discount" },
  { value: "newest", label: "New Arrivals" },
];

