import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100" dir="ltr">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 sm:px-12 sm:py-6">
        <div className="text-2xl font-bold">
          Easy<span className="text-primary">Cole</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/login">
            <Button variant="outline">
              Log in
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-20 sm:py-32 text-center">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 text-balance">
            Master Your Training Schedule
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 text-balance">
            Plan, organize, and track your training programs with an intuitive platform designed for coaches and
            athletes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/login">
              <Button size="lg" className="px-15">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 sm:py-24 sm:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-12">Powerful Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Scheduling",
                description: "Create and manage training sessions with drag-and-drop simplicity.",
              },
              {
                title: "Track Progress",
                description: "Monitor athlete performance and progress over time with detailed analytics.",
              },
              {
                title: "Team Collaboration",
                description: "Share schedules and communicate with your entire team seamlessly.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-lg border border-slate-200 bg-slate-50 hover:border-blue-300 transition-colors"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="px-6 py-12 sm:px-12 border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center text-slate-600">
          <p>&copy; {new Date().getFullYear()} TrainingSchedule. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
