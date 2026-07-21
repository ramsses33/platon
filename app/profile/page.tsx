import {
  LockKeyhole,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import ProtectedPage from "@/components/auth/ProtectedPage";
import ProfileInformation from "@/components/profile/ProfileInformation";

export default function ProfilePage() {
  return (
    <ProtectedPage>
      <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
        <Navbar />

        <section className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[190px]" />

            <div className="absolute -right-52 top-[650px] h-[520px] w-[520px] rounded-full bg-violet-500/[0.05] blur-[170px]" />
          </div>

          <div className="relative mx-auto w-full max-w-[1500px]">
            <PageHeader
              badge="PLATON Profile"
              title="Account Settings"
              description="Manage your account information and security preferences."
            />

            <div className="mt-10 grid items-start gap-8 xl:grid-cols-[minmax(0,1.2fr)_420px]">
              <ProfileInformation />

              <Card>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-400">
                      Account Protection
                    </p>

                    <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">
                      Security
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-white/40">
                      Review the protection status of your PLATON account.
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
                    <ShieldCheck size={22} />
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="rounded-[22px] border border-white/[0.07] bg-black/20 p-5">
                    <div className="flex items-center gap-3">
                      <UserCheck
                        size={18}
                        className="text-emerald-400"
                      />

                      <p className="font-black text-white">
                        Protected Account
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      Your profile information is protected by account-level database policies.
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/[0.07] bg-black/20 p-5">
                    <div className="flex items-center gap-3">
                      <LockKeyhole
                        size={18}
                        className="text-yellow-300"
                      />

                      <p className="font-black text-white">
                        Security Controls
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      Password and authentication controls will be connected in the next stage.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ProtectedPage>
  );
}
