import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { useAddress } from "@/context/AddressContext";
import { useWallet } from "@/context/WalletContext";
import { couponAPI } from "@/lib/api";
import { isRazorpayEnabled } from "@/lib/razorpay";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentModal from "@/components/PaymentModal";
import AddressForm from "@/components/AddressForm";
import AddressList from "@/components/AddressList";
import ShippingSelector from "@/components/ShippingSelector";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { items, total, reserveCart, clearCart } = useCart();
  const { placeOrder } = useOrder();
  const { balance: walletBalance } = useWallet();
  const { 
    addresses, 
    selectedAddress, 
    selectedShipping,
    fetchAddresses, 
    selectAddress,
    selectShipping,
  } = useAddress();

  const [showPayment, setShowPayment] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Wallet usage state
  const [applyWallet, setApplyWallet] = useState(false);

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch addresses on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated, fetchAddresses]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isProcessing && items.length === 0 && !currentOrderId) {
      router.push("/cart");
    }
  }, [items, router, isProcessing, currentOrderId]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponMessage(null);
    try {
      const res = await couponAPI.validate(couponCode.trim(), total);
      if (res.valid) {
        setAppliedCoupon(couponCode.trim());
        setCouponDiscount(res.discount);
        setCouponMessage(`Privilege code applied! Saved ₹${res.discount.toLocaleString("en-IN")}`);
      } else {
        setCouponMessage("Invalid or expired code");
      }
    } catch {
      setCouponMessage("Failed to validate code. Please try again.");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponMessage(null);
  };

  const shippingCost = selectedShipping?.cost ?? 0;
  const subtotalWithShipping = Math.max(0, total - couponDiscount + shippingCost);

  // Determine wallet usage deduction
  let walletDeduction = 0;
  if (applyWallet && walletBalance > 0) {
    walletDeduction = Math.min(walletBalance, subtotalWithShipping);
  }
  const finalTotal = Math.max(0, subtotalWithShipping - walletDeduction);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address.");
      return;
    }
    if (!selectedShipping) {
      setError("Please select a shipping method.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Reserve cart stock first
      const reservation = await reserveCart();
      if (!reservation) {
        setError("Failed to reserve stock. Items may be out of stock.");
        setIsProcessing(false);
        return;
      }

      // 2. Place Order in Backend
      const order = await placeOrder({
        addressId: selectedAddress.id,
        reservationId: reservation.reservationId,
        couponCode: appliedCoupon || undefined,
        walletAmountUsed: applyWallet ? walletDeduction : 0,
      });

      if (!order) {
        setError("Order creation failed. Please check stock and try again.");
        setIsProcessing(false);
        return;
      }

      const orderId = Number(order.id);
      setCurrentOrderId(orderId);
      setPaymentAmount(finalTotal);

      // If COD or final payable is ₹0, complete immediately
      if (paymentMethod === 'COD' || finalTotal === 0) {
        clearCart();
        router.push(`/orders?placed=${orderId}`);
        return;
      }

      // Online Payment flow
      setShowPayment(true);
    } catch (err: any) {
      setError(err?.message || "Failed to initiate order. Please try again.");
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setShowPayment(false);
    if (currentOrderId) {
      router.push(`/orders?placed=${currentOrderId}`);
    } else {
      router.push('/orders');
    }
  };

  return (
    <>
      <Head>
        <title>Checkout | Modest Studio Kochi</title>
        <meta name="description" content="Secure checkout for your Modest Studio Kochi order." />
      </Head>
      <Header />
      <main id="main-content" className="min-h-screen bg-mb-bg py-8 sm:py-12 border-b border-mb-border">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs font-sans text-mb-muted uppercase tracking-editorial" role="list">
              <li>
                <Link href="/" className="hover:text-mb-primary transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-mb-border">/</li>
              <li>
                <Link href="/cart" className="hover:text-mb-primary transition-colors">
                  Bag
                </Link>
              </li>
              <li aria-hidden="true" className="text-mb-border">/</li>
              <li className="text-mb-primary font-semibold" aria-current="page">
                Checkout
              </li>
            </ol>
          </nav>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mb-primary mb-8 tracking-tight">
            Atelier Checkout
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 border border-red-200">
              <p className="text-xs font-body text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Form Content (8 cols on lg) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Delivery Address Section */}
              <div className="bg-mb-surface border border-mb-border p-6">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-mb-border">
                  <h2 className="font-sans text-xs uppercase tracking-editorial font-semibold text-mb-primary">
                    1. Delivery Address
                  </h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-xs font-sans uppercase tracking-wider text-mb-accent-deep hover:underline font-semibold"
                  >
                    {showAddressForm ? "Cancel" : "+ Add New Address"}
                  </button>
                </div>

                {showAddressForm && (
                  <div className="mb-6 p-5 bg-mb-bg border border-mb-border">
                    <AddressForm
                      onSuccess={(addr) => {
                        setShowAddressForm(false);
                        selectAddress(addr);
                        fetchAddresses();
                      }}
                      onCancel={() => setShowAddressForm(false)}
                    />
                  </div>
                )}

                {addresses.length > 0 ? (
                  <AddressList
                    onSelect={(addr) => selectAddress(addr)}
                    selectedId={selectedAddress?.id}
                  />
                ) : (
                  <div className="p-4 bg-mb-bg border border-mb-border text-center">
                    <p className="text-xs font-body text-mb-body">
                      No saved addresses found. Please add a delivery address to proceed.
                    </p>
                  </div>
                )}
              </div>

              {/* Shipping Method Section */}
              {selectedAddress && (
                <div className="bg-mb-surface border border-mb-border p-6">
                  <h2 className="font-sans text-xs uppercase tracking-editorial font-semibold text-mb-primary mb-4 pb-3 border-b border-mb-border">
                    2. Delivery Speed &amp; Shipping
                  </h2>
                  <ShippingSelector
                    pincode={selectedAddress.pincode}
                    onSelect={(option) => selectShipping(option)}
                  />
                </div>
              )}

              {/* Offers, Wallet & Payment Selection */}
              <div className="bg-mb-surface border border-mb-border p-6 space-y-5">
                <h2 className="font-sans text-xs uppercase tracking-editorial font-semibold text-mb-primary pb-3 border-b border-mb-border">
                  3. Privilege Codes &amp; Payment
                </h2>

                {/* Coupon Code Input */}
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-wider text-mb-muted mb-1.5">
                    Studio Privilege Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE (E.G. MODEST20)"
                      disabled={!!appliedCoupon}
                      className="flex-1 px-4 py-2.5 border border-mb-border bg-mb-bg text-xs font-sans uppercase tracking-wider text-mb-primary outline-none focus:border-mb-primary"
                    />
                    {appliedCoupon ? (
                      <button
                        onClick={handleRemoveCoupon}
                        className="px-4 py-2.5 border border-red-300 text-red-700 bg-mb-bg text-xs font-sans uppercase tracking-wider hover:bg-red-50"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        className="luxury-btn-primary px-6 py-2.5 text-xs tracking-editorial disabled:opacity-50"
                      >
                        {isValidatingCoupon ? "Validating..." : "Apply"}
                      </button>
                    )}
                  </div>
                  {couponMessage && (
                    <p className={`text-xs mt-2 ${appliedCoupon ? "text-mb-success font-medium" : "text-red-600"}`}>
                      {couponMessage}
                    </p>
                  )}
                </div>

                {/* Wallet Balance Checkbox */}
                {walletBalance > 0 && (
                  <div className="pt-4 border-t border-mb-border flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-body text-mb-primary">
                      <input
                        type="checkbox"
                        checked={applyWallet}
                        onChange={(e) => setApplyWallet(e.target.checked)}
                        className="w-4 h-4 accent-mb-primary"
                      />
                      <span>Use Modest Credits Balance (Available: ₹{walletBalance.toLocaleString("en-IN")})</span>
                    </label>
                    {applyWallet && walletDeduction > 0 && (
                      <span className="text-xs font-semibold text-mb-success">
                        −₹{walletDeduction.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                )}

                {/* Payment Method Selector */}
                <div className="pt-4 border-t border-mb-border">
                  <h3 className="text-xs font-sans uppercase tracking-editorial font-semibold text-mb-primary mb-3">
                    Select Payment Method
                  </h3>
                  <div className="space-y-3">
                    <label
                      className={`flex items-start gap-3.5 p-4 border transition-all cursor-pointer ${
                        paymentMethod === "ONLINE"
                          ? "border-mb-primary bg-mb-bg"
                          : "border-mb-border bg-mb-surface hover:border-mb-primary"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="ONLINE"
                        checked={paymentMethod === "ONLINE"}
                        onChange={() => setPaymentMethod("ONLINE")}
                        className="mt-0.5 accent-mb-primary"
                      />
                      <div>
                        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-mb-primary">
                          {isRazorpayEnabled() ? "Instant Online Payment (UPI, Cards, NetBanking)" : "Secure Digital Payment"}
                        </p>
                        <p className="text-[11px] font-body text-mb-muted mt-0.5">
                          {isRazorpayEnabled()
                            ? "Google Pay, PhonePe, Paytm, Visa, Mastercard, RuPay & All Major Indian Banks"
                            : "Protected by end-to-end 256-bit encryption"}
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-3.5 p-4 border transition-all cursor-pointer ${
                        paymentMethod === "COD"
                          ? "border-mb-primary bg-mb-bg"
                          : "border-mb-border bg-mb-surface hover:border-mb-primary"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="mt-0.5 accent-mb-primary"
                      />
                      <div>
                        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-mb-primary">
                          Cash on Delivery (COD)
                        </p>
                        <p className="text-[11px] font-body text-mb-muted mt-0.5">
                          Pay cash upon receiving your atelier package at your doorstep
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Order Review Sidebar (4 cols on lg) */}
            <div className="lg:col-span-4">
              <div className="bg-mb-surface border border-mb-border p-6 sticky top-24">
                <h3 className="font-serif text-xl font-normal text-mb-primary mb-4 pb-3 border-b border-mb-border">
                  Order Review
                </h3>

                <div className="divide-y divide-mb-border-lite max-h-56 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="py-2.5 flex justify-between items-center">
                      <div className="pr-2 min-w-0">
                        <p className="font-sans text-xs font-medium text-mb-primary truncate">{item.product.name}</p>
                        <p className="font-body text-[11px] text-mb-muted">Qty: {item.qty}</p>
                      </div>
                      <p className="font-sans text-xs font-semibold text-mb-primary flex-shrink-0">
                        ₹{(item.product.price * item.qty).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-mb-border space-y-2 text-xs font-body text-mb-body">
                  <div className="flex justify-between">
                    <span className="text-mb-muted">Bag Subtotal</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-mb-accent-deep font-semibold">
                      <span>Privilege Discount ({appliedCoupon})</span>
                      <span>−₹{couponDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {selectedShipping && (
                    <div className="flex justify-between">
                      <span className="text-mb-muted">Shipping ({selectedShipping.name})</span>
                      <span>₹{shippingCost.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {applyWallet && walletDeduction > 0 && (
                    <div className="flex justify-between text-mb-accent-deep font-semibold">
                      <span>Modest Credits Applied</span>
                      <span>−₹{walletDeduction.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-mb-border font-sans text-base font-semibold text-mb-primary">
                    <span>Payable Total</span>
                    <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !selectedAddress || !selectedShipping || items.length === 0}
                  className="w-full mt-6 py-4 luxury-btn-primary text-xs tracking-editorial disabled:opacity-50"
                >
                  {isProcessing
                    ? "Securing Atelier Reservation..."
                    : paymentMethod === "COD"
                    ? `Confirm Order (COD ₹${finalTotal.toLocaleString("en-IN")})`
                    : `Proceed to Pay ₹${finalTotal.toLocaleString("en-IN")}`}
                </button>

                <Link
                  href="/cart"
                  className="block text-center mt-3 py-2 text-[11px] font-sans uppercase tracking-wider text-mb-muted hover:text-mb-primary"
                >
                  Return to Shopping Bag
                </Link>

                <div className="mt-5 pt-4 border-t border-mb-border-lite text-[11px] font-body text-mb-muted space-y-1">
                  <p>✓ Handcrafted &amp; checked in Kochi atelier</p>
                  <p>✓ Complete modesty coverage guarantee</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Razorpay / Gateway Modal */}
        {showPayment && currentOrderId && (
          <PaymentModal
            amount={paymentAmount}
            type="order"
            orderId={currentOrderId}
            onSuccess={handlePaymentSuccess}
            onClose={() => {
              setShowPayment(false);
              setIsProcessing(false);
            }}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
