import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useAddress } from '@/context/AddressContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddressForm from '@/components/AddressForm';
import AddressList from '@/components/AddressList';

export default function AddressesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addresses, fetchAddresses, isLoading } = useAddress();

  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/addresses');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch addresses on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated, fetchAddresses]);

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-white">
        <div className="mx-auto max-w-content px-4 md:px-6 py-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-[#514044]" role="list">
              <li role="listitem">
                <Link href="/" className="hover:text-[#5C1A24] hover:underline">
                  Home
                </Link>
              </li>
              <li role="listitem" aria-hidden="true">/</li>
              <li role="listitem">
                <Link href="/profile" className="hover:text-[#5C1A24] hover:underline">
                  Profile
                </Link>
              </li>
              <li role="listitem" aria-hidden="true">/</li>
              <li role="listitem" aria-current="page">
                Addresses
              </li>
            </ol>
          </nav>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-[#2D1A1F]">Saved Addresses</h1>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-4 py-2 bg-[#5C1A24] text-white font-medium rounded-lg hover:opacity-90 transition-colors"
                >
                  {showForm ? '✕ Cancel' : '+ Add New Address'}
                </button>
              </div>

              {/* Form */}
              {showForm && (
                <div className="bg-[#FBF7F3] rounded-lg p-6 mb-6 border border-[#DCC1B9]">
                  <h2 className="text-lg font-semibold text-[#2D1A1F] mb-4">Add New Address</h2>
                  <AddressForm
                    onSuccess={() => {
                      setShowForm(false);
                      fetchAddresses();
                    }}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              )}

              {/* Address List */}
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-6 bg-[#FBF7F3] rounded-lg animate-pulse h-40"
                    />
                  ))}
                </div>
              ) : (
                <AddressList onSelect={(addr) => setSelectedId(addr.id)} selectedId={selectedId || undefined} />
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-[#FBF7F3] rounded-lg p-6 border border-[#DCC1B9] sticky top-20">
                <h3 className="text-lg font-semibold text-[#2D1A1F] mb-4">Quick Links</h3>
                <nav className="space-y-2">
                  <Link
                    href="/profile"
                    className="block px-3 py-2.5 text-sm font-medium text-[#2D1A1F] hover:bg-white hover:text-[#5C1A24] rounded-lg transition-colors"
                  >
                    Profile Settings
                  </Link>
                  <Link
                    href="/wallet"
                    className="block px-3 py-2.5 text-sm font-medium text-[#2D1A1F] hover:bg-white hover:text-[#5C1A24] rounded-lg transition-colors"
                  >
                    Wallet
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-3 py-2.5 text-sm font-medium text-[#2D1A1F] hover:bg-white hover:text-[#5C1A24] rounded-lg transition-colors"
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/cart"
                    className="block px-3 py-2.5 text-sm font-medium text-[#2D1A1F] hover:bg-white hover:text-[#5C1A24] rounded-lg transition-colors"
                  >
                    Shopping Cart
                  </Link>
                </nav>

                {/* Info */}
                <div className="mt-6 pt-6 border-t border-[#DCC1B9] space-y-2 text-xs text-[#514044]">
                  <p>💡 Set one address as default for quick checkout</p>
                  <p>📌 You can manage multiple addresses here</p>
                  <p>✓ All addresses are securely stored</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
