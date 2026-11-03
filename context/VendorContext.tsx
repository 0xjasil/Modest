import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";

/* ── Types ────────────────────────────────────────────────────── */
export interface VendorProfile {
  id: number;
  userId: number;
  storeName: string;
  slug: string;
  description: string;
  logo: string;
  banner: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  category: string;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  followers: number;
  createdAt: string;
  updatedAt: string;
}

export interface VendorProduct {
  id: number;
  vendorId: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  sku: string;
  image: string;
  category: string;
  status: "draft" | "active" | "inactive";
  rating: number;
  reviewCount: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface VendorOrder {
  id: number;
  vendorId: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  commission: number;
  earnings: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded";
  createdAt: string;
  updatedAt: string;
}

export interface VendorEarnings {
  totalEarnings: number;
  totalRevenue?: number;
  pendingPayout: number;
  availableBalance: number;
  totalOrders: number;
  totalSold: number;
  commissionRate: number;
  recentPayouts: {
    id: string;
    amount: number;
    status: "pending" | "completed" | "failed";
    date: string;
  }[];
}

interface VendorState {
  vendor: VendorProfile | null;
  products: VendorProduct[];
  orders: VendorOrder[];
  earnings: VendorEarnings | null;
  isLoading: boolean;
  error: string | null;
}

type VendorAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_VENDOR_SUCCESS"; vendor: VendorProfile }
  | { type: "FETCH_PRODUCTS_SUCCESS"; products: VendorProduct[] }
  | { type: "FETCH_ORDERS_SUCCESS"; orders: VendorOrder[] }
  | { type: "FETCH_EARNINGS_SUCCESS"; earnings: VendorEarnings }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "ADD_PRODUCT"; product: VendorProduct }
  | { type: "UPDATE_PRODUCT"; product: VendorProduct }
  | { type: "DELETE_PRODUCT"; id: number }
  | { type: "UPDATE_ORDER_STATUS"; orderId: number; status: VendorOrder["status"] }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_LOADING"; isLoading: boolean };

export interface VendorContextValue {
  vendor: VendorProfile | null;
  products: VendorProduct[];
  orders: VendorOrder[];
  earnings: VendorEarnings | null;
  isLoading: boolean;
  error: string | null;

  fetchVendorProfile(): Promise<void>;
  createVendorProfile(data: Omit<VendorProfile, "id" | "userId" | "createdAt" | "updatedAt">): Promise<VendorProfile>;
  updateVendorProfile(data: Partial<VendorProfile>): Promise<VendorProfile>;
  fetchVendorProducts(): Promise<void>;
  createProduct(data: Omit<VendorProduct, "id" | "vendorId" | "rating" | "reviewCount" | "soldCount" | "createdAt" | "updatedAt">): Promise<VendorProduct>;
  updateProduct(id: number, data: Partial<VendorProduct>): Promise<VendorProduct>;
  deleteProduct(id: number): Promise<void>;
  fetchVendorOrders(): Promise<void>;
  updateOrderStatus(orderId: number, status: VendorOrder["status"]): Promise<void>;
  fetchVendorEarnings(): Promise<void>;
  fetchEarnings(): Promise<void>;
  requestPayout(amount: number): Promise<void>;
  clearError(): void;
}

/* ── Reducer ──────────────────────────────────────────────────── */
function reducer(state: VendorState, action: VendorAction): VendorState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };

    case "FETCH_VENDOR_SUCCESS":
      return { ...state, vendor: action.vendor, isLoading: false, error: null };

    case "FETCH_PRODUCTS_SUCCESS":
      return { ...state, products: action.products, isLoading: false, error: null };

    case "FETCH_ORDERS_SUCCESS":
      return { ...state, orders: action.orders, isLoading: false, error: null };

    case "FETCH_EARNINGS_SUCCESS":
      return { ...state, earnings: action.earnings, isLoading: false, error: null };

    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.error };

    case "ADD_PRODUCT":
      return { ...state, products: [action.product, ...state.products] };

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) => (p.id === action.product.id ? action.product : p)),
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.id),
      };

    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.orderId ? { ...o, status: action.status } : o
        ),
      };

    case "SET_ERROR":
      return { ...state, error: action.error };

    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };

    default:
      return state;
  }
}

/* ── Context ──────────────────────────────────────────────────── */
const VendorContext = createContext<VendorContextValue | null>(null);

/* ── Provider ─────────────────────────────────────────────────── */
export function VendorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    vendor: null,
    products: [],
    orders: [],
    earnings: null,
    isLoading: false,
    error: null,
  });

  const fetchVendorProfile = useCallback(async () => {
    // Single merchant backend: vendor module preserved locally without 404 network failure
    dispatch({ type: "SET_LOADING", isLoading: false });
  }, []);

  const createVendorProfile = useCallback(
    async (data: Omit<VendorProfile, "id" | "userId" | "createdAt" | "updatedAt">) => {
      const vendor: VendorProfile = {
        ...data,
        id: Date.now(),
        userId: 1,
        rating: 5,
        reviewCount: 0,
        followers: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: "FETCH_VENDOR_SUCCESS", vendor });
      return vendor;
    },
    []
  );

  const updateVendorProfile = useCallback(async (data: Partial<VendorProfile>) => {
    if (!state.vendor) throw new Error("No vendor profile to update");
    const updated = { ...state.vendor, ...data, updatedAt: new Date().toISOString() };
    dispatch({ type: "FETCH_VENDOR_SUCCESS", vendor: updated });
    return updated;
  }, [state.vendor]);

  const fetchVendorProducts = useCallback(async () => {
    dispatch({ type: "SET_LOADING", isLoading: false });
  }, []);

  const createProduct = useCallback(
    async (data: Omit<VendorProduct, "id" | "vendorId" | "rating" | "reviewCount" | "soldCount" | "createdAt" | "updatedAt">) => {
      const product: VendorProduct = {
        ...data,
        id: Date.now(),
        vendorId: state.vendor?.id ?? 1,
        rating: 5,
        reviewCount: 0,
        soldCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: "ADD_PRODUCT", product });
      return product;
    },
    [state.vendor]
  );

  const updateProduct = useCallback(
    async (id: number, data: Partial<VendorProduct>) => {
      const existing = state.products.find((p) => p.id === id);
      if (!existing) throw new Error("Product not found");
      const updated: VendorProduct = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: "UPDATE_PRODUCT", product: updated });
      return updated;
    },
    [state.products]
  );

  const deleteProduct = useCallback(async (id: number) => {
    dispatch({ type: "DELETE_PRODUCT", id });
  }, []);

  const fetchVendorOrders = useCallback(async () => {
    dispatch({ type: "SET_LOADING", isLoading: false });
  }, []);

  const updateOrderStatus = useCallback(
    async (orderId: number, status: VendorOrder["status"]) => {
      dispatch({ type: "UPDATE_ORDER_STATUS", orderId, status });
    },
    []
  );

  const fetchVendorEarnings = useCallback(async () => {
    dispatch({ type: "SET_LOADING", isLoading: false });
  }, []);

  const requestPayout = useCallback(async (_amount: number) => {
    // Preserved locally
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", error: null });
  }, []);

  const value: VendorContextValue = {
    vendor: state.vendor,
    products: state.products,
    orders: state.orders,
    earnings: state.earnings,
    isLoading: state.isLoading,
    error: state.error,

    fetchVendorProfile,
    createVendorProfile,
    updateVendorProfile,
    fetchVendorProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchVendorOrders,
    updateOrderStatus,
    fetchVendorEarnings,
    fetchEarnings: fetchVendorEarnings,
    requestPayout,
    clearError,
  };

  return (
    <VendorContext.Provider value={value}>{children}</VendorContext.Provider>
  );
}

/* ── Hook ─────────────────────────────────────────────────────── */
export function useVendor(): VendorContextValue {
  const ctx = useContext(VendorContext);
  if (!ctx) throw new Error("useVendor must be used inside <VendorProvider>");
  return ctx;
}
