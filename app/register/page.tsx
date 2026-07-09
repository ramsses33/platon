import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#05070A] text-white">
      <Navbar />

      <section className="flex min-h-screen items-center justify-center px-8 pt-24">
        <Card className="w-full max-w-md">
          <p className="text-sm uppercase tracking-[5px] text-emerald-400">
            Join PLATON
          </p>

          <h1 className="mt-4 text-4xl font-black">
            Create your π wallet
          </h1>

          <RegisterForm />
        </Card>
      </section>
    </main>
  );
}