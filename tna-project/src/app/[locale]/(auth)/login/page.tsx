"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import {
  MapPin,
  House,
  Truck,
  Buildings,
  User as UserIcon,
  Lock,
  Eye,
  EyeSlash,
  SignIn,
  ShieldCheck,
} from "@phosphor-icons/react";
import type { User, UserRole } from "@/lib/types/auth";

export default function LoginPage() {
  const [role, setRole] = useState("owner");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { locale, isRTL, t } = useLocale();
  const { setAuth } = useAuthStore();

  // Map frontend role ID to backend UserRole enum
  const roleMap: Record<string, UserRole> = {
    owner: "OWNER",
    carrier: "CARRIER_STAFF",
    gov: "GOV_USER",
    visitor: "VISITOR",
  };

  const roles = [
    { id: "owner", label: t("auth.login.role_owner"), icon: House },
    { id: "carrier", label: t("auth.login.role_carrier"), icon: Truck },
    { id: "gov", label: t("auth.login.role_gov"), icon: Buildings },
    { id: "visitor", label: t("auth.login.role_visitor"), icon: UserIcon },
  ];

  const currentRoleLabel = roles.find((r) => r.id === role)?.label || "";

  const handleLogin = () => {
    const userRole = roleMap[role] || "VISITOR";

    // Build mock user based on selected role
    const mockUser: User = {
      user_id: `dev-${role}-1`,
      username: `dev_${role}`,
      email: `${role}@example.com`,
      user_role: userRole,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      full_name: `Demo ${currentRoleLabel}`,
      nationality: "SA",
      document_number: "1234567890",
    };

    // Set auth state with mock token
    setAuth(mockUser, "mock-jwt-token-" + role);

    // Redirect to role-specific home
    router.push(`/${locale}/${role}/home`);
  };

  return (
    <div
      className="font-display min-h-screen flex items-center justify-center p-4 bg-surface-100"
      style={{
        backgroundImage:
          "var(--geometric-pattern, linear-gradient(45deg, #f8fafc 25%, transparent 25%, transparent 50%, #f8fafc 50%, #f8fafc 75%, transparent 75%, transparent))",
        backgroundSize: "20px 20px",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-sm sm:max-w-[520px] lg:max-w-[480px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden relative z-10 transition-all duration-300 transform scale-100 px-4 sm:px-0">
        {/* Top Section: Header */}
        <div className="pt-8 sm:pt-10 pb-4 sm:pb-6 px-4 sm:px-6 text-center backdrop-blur-md bg-white/80 relative">
          <div className="absolute top-3 sm:top-4 end-3 sm:end-4">
            <LanguageSwitcher />
          </div>
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="size-14 sm:size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <MapPin size={28} className="sm:size-32" weight="fill" />
            </div>
          </div>
          <h1
            className="text-[20px] sm:text-[22px] font-bold leading-tight tracking-tight mb-1"
            style={{
              background: "linear-gradient(to left, #0CBBDB, #1A73C1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("auth.login.title")}
          </h1>
          <p
            className="text-sm font-semibold opacity-90"
            style={{
              background: "linear-gradient(to left, #0CBBDB, #1A73C1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("auth.login.subtitle")}
          </p>
        </div>

        {/* Form Section */}
        <div className="px-4 sm:px-6 pb-8 sm:pb-10 flex flex-col gap-3 sm:gap-4 animate-in fade-in slide-in- duration-500">
          {/* Role-based selection */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <label className="text-sm font-medium text-slate-700 pr-1">
              {t("auth.login.role_label")}
            </label>
            <div className="bg-slate-50/50 p-1 flex gap-1 rounded-lg border border-slate-200 shadow-sm">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`flex-1 flex flex-col items-center justify-center py-1.5 sm:py-2 px-1 rounded-md transition-all duration-200 text-[10px] sm:text-xs font-semibold gap-1 ${
                    role === r.id
                      ? "bg-white text-primary shadow-sm ring-1 ring-primary/20 scale-[1.02]"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/80"
                  }`}
                >
                  <span
                    className={`transition-all duration-200 ${role === r.id ? "text-primary text-[18px] sm:text-[20px] font-bold" : "text-slate-400 text-[16px] sm:text-[18px]"}`}
                  >
                    <r.icon
                      size={18}
                      className="sm:size-20"
                      weight={role === r.id ? "fill" : "regular"}
                    />
                  </span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input 1: Username */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <label className="text-sm font-medium text-slate-700 pr-1">
              {t("auth.login.username_label")}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <UserIcon size={18} className="sm:size-20" />
              </div>
              <input
                className="w-full h-12 sm:h-[56px] pr-10 sm:pr-12 pl-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50/50 text-slate-900 placeholder:text-slate-400 outline-none"
                placeholder={t("auth.login.username_placeholder")}
                type="text"
              />
            </div>
          </div>

          {/* Input 2: Password */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <label className="text-sm font-medium text-slate-700 pr-1">
              {t("auth.login.password_label")}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Lock size={18} className="sm:size-20" />
              </div>
              <input
                className="w-full h-12 sm:h-[56px] pr-10 sm:pr-12 pl-10 sm:pl-12 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50/50 text-slate-900 placeholder:text-slate-400 outline-none"
                placeholder={t("auth.login.password_placeholder")}
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeSlash size={18} className="sm:size-20" />
                ) : (
                  <Eye size={18} className="sm:size-20" />
                )}
              </button>
            </div>
            <div className="flex justify-start">
              <Link
                href={`/${locale}/forgot-password`}
                className="text-xs font-semibold text-primary hover:underline transition-colors"
              >
                {t("auth.login.forgot_password")}
              </Link>
            </div>
          </div>

          {/* Action Section */}
          <div className="mt-3 sm:mt-4 flex flex-col gap-3 sm:gap-4">
            {/* Primary CTA */}
            <button
              onClick={handleLogin}
              className="w-full h-12 sm:h-[56px] rounded-full text-white font-bold text-base sm:text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(to left, #0CBBDB, #1A73C1)",
              }}
            >
              <SignIn size={20} className="sm:size-24" weight="bold" />
              <span>
                {t("auth.login.login_button", { role: currentRoleLabel })}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-3 sm:py-4">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 sm:mx-4 text-slate-400 text-xs sm:text-sm font-medium">
                {t("auth.login.or_divider")}
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Nafath SSO */}
            <button className="w-full h-12 sm:h-[56px] rounded-full border-2 border-primary bg-white text-primary font-bold text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3 hover:bg-primary/5 transition-colors">
              <div className="size-5 sm:size-6 bg-[#00a651] rounded-md flex items-center justify-center text-white text-[9px] sm:text-[10px]">
                <ShieldCheck size={14} className="sm:size-16" weight="fill" />
              </div>
              <span>{t("auth.login.sso_button")}</span>
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              {t("auth.login.no_account", { role: currentRoleLabel })}{" "}
              <Link
                href={`/${locale}/register/type`}
                className="text-primary font-bold hover:underline mx-1 transition-colors"
              >
                {t("auth.login.create_account")}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Element - hidden on mobile */}
      <div className="fixed bottom-0 left-0 p-6 sm:p-8 opacity-10 pointer-events-none hidden sm:block">
        <img
          className="w-40 sm:w-48 h-40 sm:h-48"
          alt="Subtle geometric pattern for national address"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvoSKfEe8Y15aywHmsxbx5sreIx921pte3XONYmVlR4GlHZrAXkLSy6bTsOK51gYY3REVY5m_jCdYX95igb7dR8l1SM13pz3DLUKXL4ounsV_DfXkD2TrpU7nm7lnwmUmTYbsJEktWf5ND_gZUpFgjQewWB9PVoKIFriTtzp5yE5ptA8xSNeMACqvdZWNj8XBM3TAAOBV7X3cMqY6-iW5JUxVCXgpurDzjgJJjwvIoCrn-RvvzMMWy6ikn5cvS8b_yvtAKjwUVdEow"
        />
      </div>
    </div>
  );
}
