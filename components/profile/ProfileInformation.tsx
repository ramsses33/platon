"use client";

import {
  CheckCircle2,
  LoaderCircle,
  Mail,
  Save,
  UserRound,
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

type ProfileRow = {
  full_name: string | null;
  email: string | null;
};

export default function ProfileInformation() {
  const [fullName, setFullName] =
    useState("");

  const [
    initialFullName,
    setInitialFullName,
  ] = useState("");

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const normalizedFullName =
    useMemo(() => {
      return fullName
        .trim()
        .replace(/\s+/g, " ");
    }, [fullName]);

  const hasChanges =
    normalizedFullName !==
    initialFullName;

  const fullNameIsValid =
    normalizedFullName.length >= 2 &&
    normalizedFullName.length <= 120;

  const loadProfile =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const {
          data: userData,
          error: userError,
        } =
          await supabase.auth.getUser();

        const user =
          userData.user;

        if (userError || !user) {
          setError(
            "Unable to identify the current user."
          );

          return;
        }

        const {
          data,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select(
            "full_name, email"
          )
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error(
            "Unable to load profile:",
            profileError
          );

          setError(
            "Unable to load your profile."
          );

          return;
        }

        const profile =
          data as ProfileRow | null;

        const metadataFullName =
          typeof user.user_metadata
            ?.full_name === "string"
            ? user.user_metadata.full_name
                .trim()
            : "";

        const profileName =
          profile?.full_name?.trim() ||
          metadataFullName;

        const profileEmail =
          profile?.email?.trim() ||
          user.email ||
          "";

        setFullName(profileName);

        setInitialFullName(
          profileName
        );

        setEmail(profileEmail);
      } catch (loadError) {
        console.error(
          "Profile loading error:",
          loadError
        );

        setError(
          "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  async function saveProfile() {
    if (!fullNameIsValid) {
      toast.error(
        "Full name must contain between 2 and 120 characters."
      );

      return;
    }

    setSaving(true);
    setError("");

    try {
      const {
        data: userData,
        error: userError,
      } =
        await supabase.auth.getUser();

      const user =
        userData.user;

      if (userError || !user) {
        toast.error(
          "You are not logged in."
        );

        return;
      }

      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            full_name:
              normalizedFullName,
            email:
              user.email || email,
          },
          {
            onConflict: "id",
          }
        );

      if (profileError) {
        console.error(
          "Unable to save profile:",
          profileError
        );

        toast.error(
          profileError.message ||
            "Unable to save profile."
        );

        return;
      }

      const {
        error: metadataError,
      } =
        await supabase.auth.updateUser(
          {
            data: {
              full_name:
                normalizedFullName,
            },
          }
        );

      if (metadataError) {
        console.error(
          "Unable to update profile metadata:",
          metadataError
        );
      }

      setFullName(
        normalizedFullName
      );

      setInitialFullName(
        normalizedFullName
      );

      window.dispatchEvent(
        new CustomEvent(
          "platon-profile-updated"
        )
      );

      toast.success(
        "Profile saved successfully."
      );
    } catch (saveError) {
      console.error(
        "Profile saving error:",
        saveError
      );

      toast.error(
        "Unable to save profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-2xl">
        <div className="flex min-h-[420px] items-center justify-center">
          <div className="text-center">
            <LoaderCircle
              size={36}
              className="mx-auto animate-spin text-cyan-400"
            />

            <p className="mt-4 font-bold text-white">
              Loading profile
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[32px] border border-rose-400/20 bg-white/[0.045] p-8 text-center backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-400">
          <UserRound size={28} />
        </div>

        <h2 className="mt-5 text-xl font-black text-white">
          Profile unavailable
        </h2>

        <p className="mt-2 text-sm text-rose-300/70">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
            void loadProfile();
          }}
          className="mt-6 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
        >
          Try again
        </button>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/[0.07] blur-[100px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-400">
              Account Profile
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
              Personal Information
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Manage the personal information connected to your PLATON account.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
            <UserRound size={22} />
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/[0.08] bg-black/20 p-5 sm:p-6">
          <div>
            <label
              htmlFor="profile-full-name"
              className="text-xs font-black uppercase tracking-[0.16em] text-white/35"
            >
              Full Name
            </label>

            <div className="relative mt-3">
              <UserRound
                size={18}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                id="profile-full-name"
                type="text"
                value={fullName}
                onChange={(event) => {
                  setFullName(
                    event.target.value.slice(
                      0,
                      120
                    )
                  );
                }}
                disabled={saving}
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full rounded-2xl border border-white/10 bg-black/25 py-4 pl-14 pr-12 text-sm font-semibold text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
              />

              {fullNameIsValid && (
                <CheckCircle2
                  size={18}
                  className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-emerald-400"
                />
              )}
            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
              <p
                className={`text-xs font-medium ${
                  fullName
                    ? fullNameIsValid
                      ? "text-emerald-400"
                      : "text-rose-400"
                    : "text-white/25"
                }`}
              >
                {fullName
                  ? fullNameIsValid
                    ? "Valid account name"
                    : "Enter at least 2 characters"
                  : "Enter your full name"}
              </p>

              <p className="text-xs text-white/20">
                {fullName.length}/120
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="profile-email"
              className="text-xs font-black uppercase tracking-[0.16em] text-white/35"
            >
              Email Address
            </label>

            <div className="relative mt-3">
              <Mail
                size={18}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                id="profile-email"
                type="email"
                value={email}
                readOnly
                className="w-full cursor-not-allowed rounded-2xl border border-white/10 bg-black/25 py-4 pl-14 pr-5 text-sm text-white/55 outline-none"
              />
            </div>

            <p className="mt-2 text-xs text-white/25">
              Email changes require secure account verification.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={() => {
              void saveProfile();
            }}
            disabled={
              saving ||
              !hasChanges ||
              !fullNameIsValid
            }
          >
            {saving ? (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            ) : (
              <Save size={18} />
            )}

            <span className="ml-2">
              {saving
                ? "Saving Profile..."
                : "Save Changes"}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
