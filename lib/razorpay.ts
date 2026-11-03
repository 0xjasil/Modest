/**
 * Razorpay payment helper utilities
 */

export interface RazorpayOrder {
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
}

export interface PaymentVerificationRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message?: string;
}

/**
 * Check if Razorpay integration is explicitly enabled
 */
export function isRazorpayEnabled(): boolean {
  return process.env.NEXT_PUBLIC_RAZORPAY_ENABLED === 'true';
}

/**
 * Load Razorpay script dynamically (only if enabled)
 */
export async function loadRazorpayScript(): Promise<boolean> {
  if (!isRazorpayEnabled()) {
    return false;
  }

  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get Razorpay key from environment
 */
export function getRazorpayKeyId(): string {
  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!key) {
    if (!isRazorpayEnabled()) {
      return '';
    }
    throw new Error('Razorpay Key ID not configured. Set NEXT_PUBLIC_RAZORPAY_KEY_ID env var.');
  }
  return key;
}

/**
 * Payment statuses
 */
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];

/**
 * Payment types
 */
export const PAYMENT_TYPES = {
  WALLET: 'wallet',
  ORDER: 'order',
} as const;

export type PaymentType = (typeof PAYMENT_TYPES)[keyof typeof PAYMENT_TYPES];

/**
 * Get payment type label
 */
export function getPaymentTypeLabel(type: PaymentType): string {
  const labels: Record<PaymentType, string> = {
    wallet: 'Wallet Top-up',
    order: 'Order Payment',
  };
  return labels[type];
}

/**
 * Get payment status label
 */
export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    pending: 'Pending',
    processing: 'Processing',
    success: 'Success',
    failed: 'Failed',
    cancelled: 'Cancelled',
  };
  return labels[status];
}

/**
 * Get payment status color (for UI)
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    pending: '#595E63',
    processing: '#0066cc',
    success: '#00aa00',
    failed: '#cc0000',
    cancelled: '#cccccc',
  };
  return colors[status];
}
