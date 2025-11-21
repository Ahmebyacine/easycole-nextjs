import Link from "next/link";

const { Button } = require("../ui/button");

const CTAFooter = () => (
  <section className="relative h-96 mt-16 flex items-center justify-center text-center overflow-hidden">
    {/* Background Image with Overlay */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/CTAfooterimg.jpg')" }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-[rgba(15,39,70,0.4)]"></div>
    </div>

    {/* Content */}
    <div className="relative z-10 p-4 space-y-6">
      <h2 className="text-4xl font-bold text-white">
        Prêt à développer vos compétences?
      </h2>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Link href="#formations">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 text-lg">
            S&apos;INSCRIRE
          </Button>
        </Link>
        <Button
          variant="outline"
          className="border-white text-white bg-transparent hover:bg-white/10 px-10 py-3 text-lg"
        >
          Contacter-nous sur WhatsApp
        </Button>
      </div>
    </div>
  </section>
);
export default CTAFooter;
