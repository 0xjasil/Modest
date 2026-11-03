import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useVendor } from "@/context/VendorContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function VendorOrders() {
  const router = useRouter();
  const { user } = useAuth();
  const { vendor, products, orders, earnings, isLoading, fetchVendorOrders } = useVendor();
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  >("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchVendorOrders();
  }, [user, router, fetchVendorOrders]);

  useEffect(() => {
    let filtered = orders || [];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const orderDate = new Date();

      if (dateFilter === "today") {
        filtered = filtered.filter((o) => {
          const oDate = new Date(o.createdAt);
          return oDate.toDateString() === now.toDateString();
        });
      } else if (dateFilter === "week") {
        orderDate.setDate(orderDate.getDate() - 7);
        filtered = filtered.filter((o) => new Date(o.createdAt) >= orderDate);
      } else if (dateFilter === "month") {
        orderDate.setMonth(orderDate.getMonth() - 1);
        filtered = filtered.filter((o) => new Date(o.createdAt) >= orderDate);
      }
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.id.toString().includes(searchTerm) ||
          o.orderId?.toString().includes(searchTerm)
      );
    }

    // Sort by newest first
    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setFilteredOrders(filtered);
  }, [orders, statusFilter, dateFilter, searchTerm]);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Manage Orders | Moryella Vendor</title>
        </Head>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter((o) => o.status === "pending").length || 0,
    processing: orders?.filter((o) => o.status === "confirmed").length || 0,
    shipped: orders?.filter((o) => o.status === "shipped").length || 0,
    revenue: orders?.reduce((sum, o) => sum + (o.earnings || 0), 0) || 0,
  };

  return (
    <>
      <Head>
        <title>Manage Orders | Moryella Vendor</title>
        <meta name="description" content="Manage your store orders" />
      </Head>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Manage Orders
            </h1>
            <p className="text-gray-600">
              Track and manage all your customer orders
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard
              label="Total Orders"
              value={stats.total}
              color="blue"
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              color="yellow"
            />
            <StatCard
              label="Processing"
              value={stats.processing}
              color="purple"
            />
            <StatCard
              label="Shipped"
              value={stats.shipped}
              color="green"
            />
            <StatCard
              label="Revenue"
              value={`₹${stats.revenue.toLocaleString()}`}
              color="pink"
            />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Orders
                </label>
                <input
                  type="text"
                  placeholder="Order ID or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setDateFilter("all");
                  }}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        #{order.orderId}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900">
                            Order #{order.orderId}
                          </p>
                          <p className="text-sm text-gray-500">
                            Product #{order.productId}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {order.quantity} {order.quantity === 1 ? "item" : "items"}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        ₹{(order.price || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/vendor/orders/${order.orderId}`}>
                          <button className="text-blue-600 hover:text-blue-900 font-medium text-sm">
                            View Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  color: "blue" | "yellow" | "purple" | "green" | "pink";
}

function StatCard({ label, value, color }: StatCardProps) {
  const colors: Record<string, string> = {
    blue: "border-blue-200 bg-blue-50",
    yellow: "border-yellow-200 bg-yellow-50",
    purple: "border-purple-200 bg-purple-50",
    green: "border-green-200 bg-green-50",
    pink: "border-pink-200 bg-pink-50",
  };

  return (
    <div className={`border-l-4 rounded-lg p-4 ${colors[color]}`}>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
