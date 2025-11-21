import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="container mx-auto py-16 px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-center md:space-x-12">
        {/* Left Column: Text & Buttons */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Développez vos compétences <br className="hidden sm:inline" /> avec
            <span className="text-blue-600"> Easy Cole </span>
          </h1>
          <p className="text-gray-600 max-w-md">
            Centre de formation professionnelle, offrant des programmes
            certifiés encadrés par des experts du domaine
          </p>
          <div className="flex space-x-4 pt-4">
            <Link href="#formations">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                S&apos;inscrire
              </Button>
            </Link>
            <Link href="#formations">
              <Button
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Formations
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="md:w-1/2 mt-8 md:mt-0">
          <div className="shadow-2xl rounded-xl overflow-hidden">
            <Image
              src="/presentationimg.jpg"
              alt="Presentation"
              width={600}
              height={400}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
