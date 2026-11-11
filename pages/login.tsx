import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import BrandLogo from "@/components/BrandLogo";
import Button from "@/components/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login, error, isLoading, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const displayError = localError || error;

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
                Sign In
              </li>
            </ol>
          </nav>

          {/* Login Container in Brand Theme */}
          <div className="max-w-md mx-auto bg-mb-surface border border-mb-border rounded-[2px] shadow-2xs p-6 sm:p-8">
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-mb-text mb-1.5">Sign In</h1>
            <p className="text-xs sm:text-sm text-mb-body mb-6">
              Don't have an account?{" "}
              <Link href="/register" className="text-mb-primary font-semibold hover:underline">
                Create one
              </Link>
            </p>

            {/* Error Message */}
            {displayError && (
              <div className="mb-4 p-3 bg-mb-error/10 border border-mb-error/30 rounded-[2px]">
                <p className="text-xs sm:text-sm text-mb-error font-medium">{displayError}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-mb-text mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 border border-mb-border rounded-[2px] bg-mb-surface text-mb-text placeholder-mb-placeholder text-sm focus:border-mb-primary focus:ring-1 focus:ring-mb-primary outline-none transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-mb-text mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 border border-mb-border rounded-[2px] bg-mb-surface text-mb-text placeholder-mb-placeholder text-sm focus:border-mb-primary focus:ring-1 focus:ring-mb-primary outline-none transition-colors"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border border-mb-border rounded-[2px] cursor-pointer accent-[#5C1A24]"
                  />
                  <span className="text-xs sm:text-sm text-mb-body">Remember me</span>
                </label>
                <Link href="#" className="text-xs sm:text-sm text-mb-primary hover:underline font-semibold">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-mb-primary hover:bg-mb-primary-hover text-white font-bold text-sm rounded-[2px] shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-mb-border" />
              <span className="text-xs text-mb-muted uppercase tracking-wider">or continue with</span>
              <div className="flex-1 h-px bg-mb-border" />
            </div>

            {/* Social Login */}
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

            {/* Terms */}
            <p className="text-xs text-mb-muted text-center mt-6 leading-relaxed">
              By signing in, you agree to our{" "}
              <Link href="#" className="text-mb-primary hover:underline font-medium">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="#" className="text-mb-primary hover:underline font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
    </main>
  );
}
