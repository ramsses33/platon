import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const sections = [
  {
    title: "Vision",
    text: "PLATON is a next-generation digital asset designed to operate through its own official ecosystem with transparent pricing and long-term sustainability."
  },
  {
    title: "Technology",
    text: "The PLATON Network combines high-speed transactions, secure wallets, staking and an integrated blockchain explorer."
  },
  {
    title: "Economy",
    text: "The network follows a controlled token economy with official price updates, staking rewards and ecosystem growth."
  },
  {
    title: "Security",
    text: "Advanced cryptography, wallet protection and transparent transaction verification ensure network integrity."
  },
  {
    title: "Roadmap",
    text: "Future development includes merchant payments, governance, AI integration and worldwide adoption."
  },
  {
    title: "Community",
    text: "The PLATON ecosystem grows together with developers, validators, businesses and community members."
  }
];

export default function WhitepaperPage() {
  return (
    <main className="min-h-screen bg-[#05070A] text-white">
      <Navbar />

      <section className="px-8 pt-32 pb-24">
        <div className="mx-auto max-w-7xl">

          <PageHeader
            badge="Official Whitepaper"
            title="PLATON Whitepaper"
            description="Technical documentation describing the PLATON ecosystem, network architecture and long-term vision."
          />

          <div className="grid gap-8 md:grid-cols-2">
            {sections.map((section) => (
              <Card key={section.title}>
                <h2 className="text-3xl font-black">
                  {section.title}
                </h2>

                <p className="mt-5 text-gray-400 leading-8">
                  {section.text}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button>
              Download Whitepaper (PDF)
            </Button>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}