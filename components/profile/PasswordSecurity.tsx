"use client";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function PasswordSecurity() {
  const [email, setEmail] =
    useState("");

  const [emailVerified, setEmailVerified] =
    useState(false);

  const [loadingAccount, setLoadingAccount] =
    useState(true);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const loadAccount =
    useCallback(async () => {
      setLoadingAccount(true);

      try {
        const {
          data,
          error,
        } =
          await supabase.auth.getUser();

        if (error || !data.user) {
          toast.error(
            "Unable to load account security."
          );

          return;
        }

        setEmail(
          data.user.email ?? ""
        );

        setEmailVerified(
          Boolean(
            data.user.email_confirmed_at
          )
        );
      } catch (error) {
        console.error(
          "Unable to load account security:",
          error
        );

        toast.error(
          "Unable to load account security."
        );
      } finally {
        setLoadingAccount(false);
      }
    }, []);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  const passwordHasMinimumLength =
    newPassword.length >= 8;

  const passwordHasUppercase =
    /[A-Z]/.test(newPassword);

  const passwordHasLowercase =
    /[a-z]/.test(newPassword);

  const passwordHasNumber =
    /[0-9]/.test(newPassword);

  const newPasswordIsValid =
    useMemo(() => {
      return (
        passwordHasMinimumLength &&
        passwordHasUppercase &&
        passwordHasLowercase &&
        passwordHasNumber
      );
    }, [
      passwordHasMinimumLength,
      passwordHasUppercase,
      passwordHasLowercase,
      passwordHasNumber,
    ]);

  const passwordsMatch =
    newPassword.length > 0 &&
    newPassword === confirmPassword;

  const formIsValid =
    Boolean(currentPassword) &&
    newPasswordIsValid &&
    passwordsMatch &&
    currentPassword !== newPassword &&
    !saving;

  function clearForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  }

  async function changePassword() {
    if (!email) {
      toast.error(
        "Account email is unavailable."
      );

      return;
    }

    if (!currentPassword) {
      toast.error(
        "Enter your current password."
      );

      return;
    }

    if (!newPasswordIsValid) {
      toast.error(
        "New password does not meet the security requirements."
      );

      return;
    }

    if (!passwordsMatch) {
      toast.error(
        "New passwords do not match."
      );

      return;
    }

    if (
      currentPassword === newPassword
    ) {
      toast.error(
        "New password must be different from the current password."
      );

      return;
    }

    setSaving(true);

    try {
      const {
        error: verificationError,
      } =
        await supabase.auth.signInWithPassword(
          {
            email,
            password:
              currentPassword,
          }
        );

      if (verificationError) {
        toast.error(
          "Current password is incorrect."
        );

        return;
      }

      const {
        error: updateError,
      } =
        await supabase.auth.updateUser(
          {
            password:
              newPassword,
          }
        );

      if (updateError) {
        console.error(
          "Unable to change password:",
          updateError
        );

        toast.error(
          updateError.message ||
            "Unable to change password."
        );

        return;
      }

      clearForm();

      toast.success(
        "Password changed successfully."
      );
    } catch (error) {
      console.error(
        "Password change error:",
        error
      );

      toast.error(
        "Unable to change password."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-400/[0.07] blur-[100px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-400">
              Account Protection
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
              Security Controls
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Update your password and review the protection status of your account.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[22px] border border-white/[0.07] bg-black/20 p-5">
            <div className="flex items-center gap-3">
              <LockKeyhole
                size={18}
                className="text-emerald-400"
              />

              <p className="font-black text-white">
                Password Protection
              </p>
            </div>

            <p className="mt-2 text-sm leading-6 text-white/35">
              Your account is protected by encrypted password authentication.
            </p>
          </div>

          <div className="rounded-[22px] border border-white/[0.07] bg-black/20 p-5">
            <div className="flex items-center gap-3">
              {loadingAccount ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin text-cyan-400"
                />
              ) : (
                <CheckCircle2
                  size={18}
                  className={
                    emailVerified
                      ? "text-emerald-400"
                      : "text-yellow-300"
                  }
                />
              )}

              <p className="font-black text-white">
                Email Verification
              </p>
            </div>

            <p className="mt-2 text-sm leading-6 text-white/35">
              {loadingAccount
                ? "Checking account status..."
                : emailVerified
                  ? "Your account email is verified."
                  : "Your account email is not verified."}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-white/[0.08] bg-black/20 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <KeyRound
              size={19}
              className="text-yellow-300"
            />

            <h3 className="font-black text-white">
              Change Password
            </h3>
          </div>

          <div className="mt-6">
            <label
              htmlFor="current-password"
              className="text-xs font-black uppercase tracking-[0.16em] text-white/35"
            >
              Current Password
            </label>

            <div className="relative mt-3">
              <input
                id="current-password"
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                value={currentPassword}
                onChange={(event) => {
                  setCurrentPassword(
                    event.target.value
                  );
                }}
                disabled={saving}
                autoComplete="current-password"
                placeholder="Enter current password"
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 pr-14 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <button
                type="button"
                onClick={() => {
                  setShowCurrentPassword(
                    (value) => !value
                  );
                }}
                disabled={saving}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white disabled:cursor-not-allowed"
                aria-label="Show or hide current password"
              >
                {showCurrentPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="new-password"
              className="text-xs font-black uppercase tracking-[0.16em] text-white/35"
            >
              New Password
            </label>

            <div className="relative mt-3">
              <input
                id="new-password"
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(
                    event.target.value
                      .slice(0, 72)
                  );
                }}
                disabled={saving}
                autoComplete="new-password"
                placeholder="Create new password"
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 pr-14 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <button
                type="button"
                onClick={() => {
                  setShowNewPassword(
                    (value) => !value
                  );
                }}
                disabled={saving}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white disabled:cursor-not-allowed"
                aria-label="Show or hide new password"
              >
                {showNewPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
              <p
                className={
                  passwordHasMinimumLength
                    ? "text-emerald-400"
                    : "text-white/25"
                }
              >
                • At least 8 characters
              </p>

              <p
                className={
                  passwordHasUppercase
                    ? "text-emerald-400"
                    : "text-white/25"
                }
              >
                • One uppercase letter
              </p>

              <p
                className={
                  passwordHasLowercase
                    ? "text-emerald-400"
                    : "text-white/25"
                }
              >
                • One lowercase letter
              </p>

              <p
                className={
                  passwordHasNumber
                    ? "text-emerald-400"
                    : "text-white/25"
                }
              >
                • One number
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="confirm-password"
              className="text-xs font-black uppercase tracking-[0.16em] text-white/35"
            >
              Confirm New Password
            </label>

            <div className="relative mt-3">
              <input
                id="confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value
                      .slice(0, 72)
                  );
                }}
                disabled={saving}
                autoComplete="new-password"
                placeholder="Repeat new password"
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 pr-14 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <button
                type="button"
                onClick={() => {
                  setShowConfirmPassword(
                    (value) => !value
                  );
                }}
                disabled={saving}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white disabled:cursor-not-allowed"
                aria-label="Show or hide password confirmation"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {confirmPassword && (
              <p
                className={`mt-2 text-xs font-medium ${
                  passwordsMatch
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {passwordsMatch
                  ? "Passwords match"
                  : "Passwords do not match"}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={() => {
              void changePassword();
            }}
            disabled={!formIsValid}
          >
            {saving ? (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            ) : (
              <KeyRound size={18} />
            )}

            <span className="ml-2">
              {saving
                ? "Changing Password..."
                : "Change Password"}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
