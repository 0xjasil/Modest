import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, isLoading, clearError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Validation
    if (!formData.firstName.trim()) {
      setLocalError("First name is required");
      return;
    }
    if (!formData.email) {
      setLocalError("Email is required");
      return;
    }
    if (formData.password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName || undefined
      );
      router.push("/");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const displayError = localError || error;

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-mb-bg py-8 sm:py-16">
        <div className="mx-auto max-w-content px-4 md:px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 max-w-md mx-auto">
            <ol className="flex items-center gap-1.5 text-xs text-mb-muted" role="list">
              <li role="listitem">
                <Link href="/" className="hover:text-mb-primary transition-colors">
                  Home
                </Link>
              </li>
              <li role="listitem" aria-hidden="true" className="text-mb-border">/</li>
              <li role="listitem" aria-current="page" className="text-mb-text font-semibold">
                Create Account
              </li>
            </ol>
          </nav>

          {/* Register Container in Brand Theme */}
          <div className="max-w-md mx-auto bg-mb-surface border border-mb-border rounded-[2px] shadow-2xs p-6 sm:p-8">
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-mb-text mb-1.5">Create Account</h1>
            <p className="text-xs sm:text-sm text-mb-body mb-6">
              Already have an account?{" "}
              <Link href="/login" className="text-mb-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>

            {/* Error Message */}
            {displayError && (
              <div className="mb-4 p-3 bg-mb-error/10 border border-mb-error/30 rounded-[2px]">
                <p className="text-xs sm:text-sm text-mb-error font-medium">{displayError}</p>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-xs sm:text-sm font-semibold text-mb-text mb-1.5">
                  First Name <span className="text-mb-error">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Amina"
                  className="w-full px-3.5 py-2.5 border border-mb-border rounded-[2px] bg-mb-surface text-mb-text placeholder-mb-placeholder text-sm focus:border-mb-primary focus:ring-1 focus:ring-mb-primary outline-none transition-colors"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-xs sm:text-sm font-semibold text-mb-text mb-1.5">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Khan"
                  className="w-full px-3.5 py-2.5 border border-mb-border rounded-[2px] bg-mb-surface text-mb-text placeholder-mb-placeholder text-sm focus:border-mb-primary focus:ring-1 focus:ring-mb-primary outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-mb-text mb-1.5">
                  Email Address <span className="text-mb-error">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 border border-mb-border rounded-[2px] bg-mb-surface text-mb-text placeholder-mb-placeholder text-sm focus:border-mb-primary focus:ring-1 focus:ring-mb-primary outline-none transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-mb-text mb-1.5">
                  Password <span className="text-mb-error">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 border border-mb-border rounded-[2px] bg-mb-surface text-mb-text placeholder-mb-placeholder text-sm focus:border-mb-primary focus:ring-1 focus:ring-mb-primary outline-none transition-colors"
                />
                <p className="text-[11px] text-mb-muted mt-1">Minimum 8 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-mb-text mb-1.5">
                  Confirm Password <span className="text-mb-error">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 border border-mb-border rounded-[2px] bg-mb-surface text-mb-text placeholder-mb-placeholder text-sm focus:border-mb-primary focus:ring-1 focus:ring-mb-primary outline-none transition-colors"
                />
              </div>

              {/* Terms Agreement */}
              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 border border-mb-border rounded-[2px] mt-0.5 cursor-pointer accent-[#5C1A24]"
                />
                <span className="text-xs text-mb-body leading-relaxed">
                  I agree to the{" "}
                  <Link href="#" className="text-mb-primary hover:underline font-medium">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link href="#" className="text-mb-primary hover:underline font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-mb-primary hover:bg-mb-primary-hover text-white font-bold text-sm rounded-[2px] shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-mb-border" />
              <span className="text-xs text-mb-muted uppercase tracking-wider">or sign up with</span>
              <div className="flex-1 h-px bg-mb-border" />
            </div>

            {/* Social Signup */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="py-2.5 border border-mb-border rounded-[2px] font-semibold text-xs sm:text-sm text-mb-text bg-mb-surface hover:bg-mb-bg transition-colors"
              >
                Google
              </button>
              <button
                type="button"
                className="py-2.5 border border-mb-border rounded-[2px] font-semibold text-xs sm:text-sm text-mb-text bg-mb-surface hover:bg-mb-bg transition-colors"
              >
                Facebook
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
