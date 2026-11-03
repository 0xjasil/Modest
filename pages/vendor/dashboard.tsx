import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useVendor } from "@/context/VendorContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalFollowers: number;
  monthlyRevenue: number;
  averageRating: number;
}

export default function VendorDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { vendor, products, orders, earnings, isLoading, fetchVendorProfile } = useVendor();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalFollowers: 0,
    monthlyRevenue: 0,
    averageRating: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchVendorProfile();
  }, [user, router, fetchVendorProfile]);

  useEffect(() => {
    if (vendor && earnings) {
      setDashboardStats({
        totalRevenue: earnings.totalRevenue || 0,
        totalOrders: earnings.totalOrders || 0,
        totalProducts: products.length,
        totalFollowers: vendor.followers || 0,
        monthlyRevenue: Math.floor((earnings.totalRevenue || 0) / 12), // Simple monthly average
        averageRating: vendor.rating || 0,
      });
    }
  }, [earnings, vendor, products]);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Vendor Dashboard | Moryella</title>
        </Head>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!vendor) {
    return (
      <>
        <Head>
          <title>Vendor Dashboard | Moryella</title>
        </Head>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              No Vendor Profile
            </h1>
            <p className="text-gray-600 mb-6">
              You need to create a vendor profile to access the dashboard.
            </p>
            <Link href="/vendor/settings">
              <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700">
                Create Profile
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Vendor Dashboard | Moryella</title>
        <meta name="description" content="Vendor dashboard for managing products and orders" />
      </Head>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {vendor.storeName}!
            </h1>
            <p className="text-gray-600">
              Manage your products, orders, and store settings
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={`₹${dashboardStats.totalRevenue.toLocaleString()}`}
              subtitle="All time"
              icon="💰"
            />
            <StatCard
              title="Total Orders"
              value={dashboardStats.totalOrders}
              subtitle="Orders received"
              icon="📦"
            />
            <StatCard
              title="Total Products"
              value={dashboardStats.totalProducts}
              subtitle="Active listings"
              icon="🛍️"
            />
            <StatCard
              title="Store Rating"
              value={`${dashboardStats.averageRating.toFixed(1)}/5`}
              subtitle="Average rating"
              icon="⭐"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <QuickActionCard
              title="Product Management"
              description="Add, edit, or remove products from your store"
              href="/vendor/products"
              icon="📝"
              color="blue"
            />
            <QuickActionCard
              title="View Orders"
              description="Check pending and completed orders"
              href="/vendor/orders"
              icon="📋"
              color="green"
            />
            <QuickActionCard
              title="Store Settings"
              description="Update your store profile and preferences"
              href="/vendor/settings"
              icon="⚙️"
              color="purple"
            />
            <QuickActionCard
              title="Earnings"
              description="View your monthly earnings and withdrawals"
              href="/vendor/earnings"
              icon="💹"
              color="orange"
            />
          </div>

          {/* Store Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Store Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Store Name" value={vendor.storeName} />
              <InfoItem label="Email" value={vendor.email} />
              <InfoItem label="Phone" value={vendor.phone} />
              <InfoItem label="City" value={vendor.city} />
              <InfoItem
                label="Status"
                value={vendor.isActive ? "Active" : "Inactive"}
              />
              <InfoItem
                label="Verified"
                value={vendor.isVerified ? "Yes" : "No"}
              />
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Description:</p>
              <p className="text-gray-700">{vendor.description}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
}

function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: "blue" | "green" | "purple" | "orange";
}

const colorClasses = {
  blue: "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100",
  green: "bg-green-50 border-green-200 text-green-600 hover:bg-green-100",
  purple: "bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100",
  orange: "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100",
};

function QuickActionCard({
  title,
  description,
  href,
  icon,
  color,
}: QuickActionCardProps) {
  return (
    <Link href={href}>
      <div
        className={`p-6 rounded-lg border-2 cursor-pointer transition ${colorClasses[color]}`}
      >
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm opacity-80">{description}</p>
      </div>
    </Link>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  );
}
