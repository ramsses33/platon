import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import ProtectedPage from "@/components/auth/ProtectedPage";
import ProfileInformation from "@/components/profile/ProfileInformation";
import PasswordSecurity from "@/components/profile/PasswordSecurity";

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

            <div className="mt-10 grid items-start gap-8 xl:grid-cols-2">
              <ProfileInformation />

              <PasswordSecurity />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ProtectedPage>
  );
}
