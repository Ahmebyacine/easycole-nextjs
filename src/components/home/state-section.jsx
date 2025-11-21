import { Card } from "../ui/card";

const StatsSection = () => (
  <section className="container mx-auto py-10 px-4 md:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 shadow-sm">
      {/* Stat Card 1 */}
      <Card className="text-center">
        <p className="text-3xl font-bold text-blue-600">+7000</p>
        <p className="text-sm text-gray-500">
          Plus de 7000 familles ont fait le choix de faire confiance à Chedes
        </p>
      </Card>
      {/* Stat Card 2 */}
      <Card className="text-center">
        <p className="text-3xl font-bold text-blue-600">+30</p>
        <p className="text-sm text-gray-500">
          Programmes pointus et bien adaptés au marché
        </p>
      </Card>
      {/* Stat Card 3 */}
      <Card className="text-center">
        <p className="text-3xl font-bold text-blue-600">+40</p>
        <p className="text-sm text-gray-500">
          Formateurs experts dédiés à la réussite des étudiants
        </p>
      </Card>
      {/* Stat Card 4 */}
      <Card className="text-center">
        <p className="text-3xl font-bold text-blue-600">90%</p>
        <p className="text-sm text-gray-500">
          Taux d&apos;obtention de diplôme pour les inscrits
        </p>
      </Card>
    </div>
  </section>
);

export default StatsSection;
