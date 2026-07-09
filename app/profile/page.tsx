import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProtectedPage from "@/components/auth/ProtectedPage";

export default function ProfilePage() {
  return (
    <ProtectedPage>
      <main className="min-h-screen bg-[#05070A] text-white">
        <Navbar />

        <section className="px-8 pt-32 pb-24">
          <div className="mx-auto max-w-7xl">
            <PageHeader
              badge="PLATON Profile"
              title="Account Settings"
              description="Manage your account, wallet security and notification preferences."
            />

            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <Card>
                <h2 className="text-3xl font-black">
                  Personal Information
                </h2>

                <div className="mt-8 space-y-4">
                  <input
                    placeholder="Full name"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
                  />

                  <input
                    placeholder="Email"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
                  />

                  <Button>Save Changes</Button>
                </div>
              </Card>

              <Card>
                <h2 className="text-3xl font-black">
                  Security
                </h2>

                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl bg-black/30 p-5">
                    <p className="font-bold">
                      Two-Factor Authentication
                    </p>

                    <p className="mt-2 text-sm text-gray-400">
                      Not enabled
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/30 p-5">
                    <p className="font-bold">
                      Wallet Recovery Phrase
                    </p>

                    <p className="mt-2 text-sm text-gray-400">
                      Backed up
                    </p>
                  </div>

                  <Button variant="secondary">
                    Manage Security
                  </Button>
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