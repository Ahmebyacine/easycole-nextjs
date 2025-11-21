import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const CourseCard = ({ title, price, duration }) => (
  <Card className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <CardHeader className="p-0">
      <div className="relative w-full h-62">
        <Image
          src="/dattesimg.jpg"
          alt="courseimg"
          fill
          className="object-cover rounded-lg"
        />
      </div>
    </CardHeader>
    <CardContent className="p-4 space-y-2">
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">{duration} jours</p>
        <div className="text-green-600 text-xs font-bold px-2 py-1 rounded">
          {price} DA
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <Button className="w-full bg-blue-600 hover:bg-blue-700">
        Voir la formation <span className="ml-2">&rarr;</span>
      </Button>
    </CardFooter>
  </Card>
);

const CoursesGrid = () => (
  <section className="container mx-auto py-16 px-4 md:px-8" id="formations">
    <h2 className="text-3xl font-bold text-center mb-4">
      Nos <span className="text-blue-600">Formations </span>Professionnelles
    </h2>
    <p className="text-center text-gray-500 mb-12 max-w-3xl mx-auto">
      Des programmes certifiés et pratiques pour développer vos compétences et
      booster votre carrière
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <CourseCard
        title="Gestion des unités de production de dattes"
        price="34500"
        duration="3"
      />
      <CourseCard
        title="Gestion des unités de production de dattes"
        price="34500"
        duration="3"
      />
      <CourseCard
        title="Gestion des unités de production de dattes"
        price="34500"
        duration="3"
      />
    </div>

    <div className="text-center mt-10">
      <Button
        variant="outline"
        className="text-gray-700 border-gray-300 hover:bg-gray-50"
      >
        Voir plus <ArrowRight />
      </Button>
    </div>
  </section>
);
export default CoursesGrid;
