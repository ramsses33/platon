import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";

const lessons = [
  {
    title: "Getting Started",
    text: "Create your wallet and understand the PLATON ecosystem."
  },
  {
    title: "How to Buy π",
    text: "Learn how to purchase PLATON through the official market."
  },
  {
    title: "Wallet Security",
    text: "Protect your recovery phrase and secure your assets."
  },
  {
    title: "Staking Guide",
    text: "Earn passive rewards by staking your PLATON."
  },
  {
    title: "Blockchain Basics",
    text: "Understand blocks, transactions and validators."
  },
  {
    title: "Advanced PLATON",
    text: "Learn governance, ecosystem tools and future utilities."
  }
];

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-[#05070A] text-white">
      <Navbar />

      <section className="px-8 pt-32 pb-24">
        <div className="mx-auto max-w-7xl">

          <PageHeader
            badge="PLATON Academy"
            title="Learn Everything About π"
            description="Master the PLATON ecosystem from beginner to advanced."
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <Card key={lesson.title}>
                <h2 className="text-2xl font-black">
                  {lesson.title}
                </h2>

                <p className="mt-4 text-gray-400">
                  {lesson.text}
                </p>

                <div className="mt-8 rounded-xl bg-emerald-400/10 px-4 py-3 text-center font-bold text-emerald-300">
                  Read Lesson
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}