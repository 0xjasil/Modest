import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import BrandLogo from "@/components/BrandLogo";

function getSafeRedirect(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/";
}

const PASSWORD_POLICY_REGEX = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, isLoading, isAuthenticated, clearError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const redirectTarget = useMemo(
    () => getSafeRedirect(router.query.redirect),
    [router.query.redirect]
  );

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTarget);
    }
  }, [isAuthenticated, isLoading, redirectTarget, router]);

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
    if (!formData.email.trim()) {
      setLocalError("Email is required");
      return;
    }
    if (formData.password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }
    if (!PASSWORD_POLICY_REGEX.test(formData.password)) {
      setLocalError(
        "Password must include an uppercase letter, a lowercase letter, and a number or special character"
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      await register(
        formData.email.trim(),
        formData.password,
        formData.firstName.trim(),
        formData.lastName.trim() || undefined
      );
      router.push(redirectTarget);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const displayError = localError || error;
  const loginHref =
    redirectTarget !== "/"
      ? `/login?redirect=${encodeURIComponent(redirectTarget)}`
      : "/login";

  return (
    <main id="main-content" className="min-h-screen bg-mb-bg flex flex-col justify-center py-8 sm:py-12">
      <div className="mx-auto w-full max-w-content px-4 md:px-6">
        <div className="max-w-md mx-auto mb-6 flex justify-center">
          <Link
            href="/"
            aria-label="Modest Studio — homepage"
            className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mb-accent rounded"
          >
            <BrandLogo variant="secondary" className="h-10 sm:h-11 w-auto object-contain" />
          </Link>
        </div>
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
              <Link href={loginHref} className="text-mb-primary font-semibold hover:underline">
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
                <p className="text-[11px] text-mb-muted mt-1">
                  At least 8 characters with uppercase, lowercase, and a number or symbol
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-mb-text mb-1.5">
                  Confirm Password <span className="text-mb-error">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
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
                  I agree to Modest Studio&apos;s customer account terms and privacy policy.
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
          </div>
        </div>
    </main>
  );
}
