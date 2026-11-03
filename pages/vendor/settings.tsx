import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useVendor } from "@/context/VendorContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiFetchJson } from "@/lib/apiFetch";

export default function VendorSettings() {
  const router = useRouter();
  const { user } = useAuth();
  const { vendor, products, orders, earnings, isLoading, fetchVendorProfile, updateVendorProfile } =
    useVendor();
  const [formData, setFormData] = useState({
    storeName: "",
    email: "",
    phone: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    category: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [tab, setTab] = useState<"profile" | "bank" | "settings">("profile");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchVendorProfile();
  }, [user, router, fetchVendorProfile]);

  useEffect(() => {
    if (vendor) {
      setFormData({
        storeName: vendor.storeName || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        description: vendor.description || "",
        address: vendor.address || "",
        city: vendor.city || "",
        state: vendor.state || "",
        pincode: vendor.pincode || "",
        category: vendor.category || "",
      });
    }
  }, [vendor]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await apiFetchJson<any>(
        `/api/vendors/me`,
        {
          method: "PATCH",
          body: JSON.stringify(formData),
        }
      );

      if (response) {
        setMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
        updateVendorProfile(response);
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          type: "error",
          text: "Failed to update profile",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while updating profile",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Store Settings | Moryella Vendor</title>
        </Head>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-gray-600">Loading settings...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Store Settings | Moryella Vendor</title>
        <meta name="description" content="Manage your store settings and profile" />
      </Head>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Store Settings
            </h1>
            <p className="text-gray-600">
              Manage your store profile and preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setTab("profile")}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                tab === "profile"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setTab("bank")}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                tab === "bank"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Bank Details
            </button>
            <button
              onClick={() => setTab("settings")}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                tab === "settings"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Preferences
            </button>
          </div>

          {/* Messages */}
          {message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Profile Tab */}
          {tab === "profile" && (
            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Store Name"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent resize-none"
                    placeholder="Tell customers about your store..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      storeName: vendor?.storeName || "",
                      email: vendor?.email || "",
                      phone: vendor?.phone || "",
                      description: vendor?.description || "",
                      address: vendor?.address || "",
                      city: vendor?.city || "",
                      state: vendor?.state || "",
                      pincode: vendor?.pincode || "",
                      category: vendor?.category || "",
                    })}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Bank Details Tab */}
          {tab === "bank" && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  Bank details management will be available soon
                </p>
                <p className="text-sm text-gray-500">
                  You'll be able to add and manage your bank accounts for payouts
                </p>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {tab === "settings" && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">
                      Receive email for new orders and updates
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-pink-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">
                      Receive SMS for urgent order updates
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Marketing Emails</p>
                    <p className="text-sm text-gray-600">
                      Receive tips and marketing insights
                    </p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Danger Zone</h3>
                <button className="text-red-600 hover:text-red-900 font-medium">
                  Close Store
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
      />
    </div>
  );
}
