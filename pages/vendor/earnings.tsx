import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useVendor } from "@/context/VendorContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface EarningsData {
  period: string;
  amount: number;
  orders: number;
}

export default function VendorEarnings() {
  const router = useRouter();
  const { user } = useAuth();
  const { vendor, products, orders, earnings, isLoading, fetchEarnings } = useVendor();
  const [timePeriod, setTimePeriod] = useState<"month" | "quarter" | "year">(
    "month"
  );
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchEarnings();
  }, [user, router, fetchEarnings]);

  useEffect(() => {
    if (earnings) {
      // Group earnings by period
      let grouped: EarningsData[] = [];

      if (timePeriod === "month") {
        grouped = generateMonthlyData();
      } else if (timePeriod === "quarter") {
        grouped = generateQuarterlyData();
      } else {
        grouped = generateYearlyData();
      }

      setEarningsData(grouped);
    }
  }, [earnings, timePeriod]);

  const generateMonthlyData = (): EarningsData[] => {
    return Array.from({ length: 12 }, (_, i) => ({
      period: new Date(2026, i, 1).toLocaleString("default", {
        month: "short",
      }),
      amount: Math.floor(Math.random() * 50000) + 10000,
      orders: Math.floor(Math.random() * 100) + 10,
    }));
  };

  const generateQuarterlyData = (): EarningsData[] => {
    return [
      {
        period: "Q1",
        amount: 180000,
        orders: 250,
      },
      {
        period: "Q2",
        amount: 195000,
        orders: 280,
      },
      {
        period: "Q3",
        amount: 210000,
        orders: 310,
      },
      {
        period: "Q4",
        amount: 225000,
        orders: 340,
      },
    ];
  };

  const generateYearlyData = (): EarningsData[] => {
    return [
      { period: "2023", amount: 450000, orders: 800 },
      { period: "2024", amount: 825000, orders: 1500 },
      { period: "2025", amount: 1200000, orders: 2200 },
      { period: "2026", amount: 810000, orders: 1180 },
    ];
  };

  const totalEarnings = earningsData.reduce((sum, d) => sum + d.amount, 0);
  const totalOrders = earningsData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalEarnings / totalOrders) : 0;

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Earnings | Moryella Vendor</title>
        </Head>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-gray-600">Loading earnings...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Earnings | Moryella Vendor</title>
        <meta name="description" content="View your store earnings and payouts" />
      </Head>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Earnings & Payouts
            </h1>
            <p className="text-gray-600">
              Track your earnings and manage your payouts
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <EarningsCard
              title="Total Earnings"
              amount={`₹${totalEarnings.toLocaleString()}`}
              subtitle="Total earnings"
              icon="💰"
              color="blue"
            />
            <EarningsCard
              title="Total Orders"
              amount={totalOrders}
              subtitle="Orders processed"
              icon="📦"
              color="green"
            />
            <EarningsCard
              title="Average Order Value"
              amount={`₹${avgOrderValue.toLocaleString()}`}
              subtitle="Per order average"
              icon="📊"
              color="purple"
            />
          </div>

          {/* Time Period Selector */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Earnings Summary
              </h2>
              <div className="flex space-x-2">
                {["month", "quarter", "year"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      timePeriod === period
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {period === "month" ? "Monthly" : period === "quarter" ? "Quarterly" : "Yearly"}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Alternative (Table for now) */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Period
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      Earnings
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      Orders
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      Avg. Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {earningsData.map((data, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {data.period}
                      </td>
                      <td className="px-4 py-3 text-right text-green-600 font-medium">
                        ₹{data.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        {data.orders}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        ₹{Math.round(data.amount / data.orders).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payouts Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Payout History</h2>
              <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 font-medium">
                Request Payout
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: "PAY001",
                  amount: 50000,
                  date: "2026-10-25",
                  status: "completed",
                },
                {
                  id: "PAY002",
                  amount: 45000,
                  date: "2026-10-18",
                  status: "completed",
                },
                {
                  id: "PAY003",
                  amount: 55000,
                  date: "2026-10-11",
                  status: "completed",
                },
                {
                  id: "PAY004",
                  amount: 40000,
                  date: "2026-10-04",
                  status: "pending",
                },
              ].map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{payout.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(payout.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₹{payout.amount.toLocaleString()}
                    </p>
                    <PayoutStatusBadge status={payout.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bank Account Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Payout Account
            </h2>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                No payout account linked yet
              </p>
              <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 font-medium">
                Add Bank Account
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

interface EarningsCardProps {
  title: string;
  amount: string | number;
  subtitle: string;
  icon: string;
  color: "blue" | "green" | "purple";
}

function EarningsCard({
  title,
  amount,
  subtitle,
  icon,
  color,
}: EarningsCardProps) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
  };

  return (
    <div className={`border-l-4 rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{amount}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

function PayoutStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
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
