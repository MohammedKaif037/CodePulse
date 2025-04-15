import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code2, BarChart2, Calendar, Brain } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Code2 className="h-6 w-6 text-purple-600" />
            <span>CodePulse</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Track Your Coding Habits with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  CodePulse helps you build consistent coding habits, track your progress, and receive personalized AI
                  guidance to improve your skills.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-purple-100 p-3">
                  <BarChart2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Track Your Progress</h3>
                  <p className="text-gray-500">
                    Monitor your coding time, completed tasks, and skill development with intuitive visualizations.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-purple-100 p-3">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Build Consistent Habits</h3>
                  <p className="text-gray-500">
                    Maintain coding streaks, set achievable goals, and develop a sustainable practice routine.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-purple-100 p-3">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">AI-Powered Insights</h3>
                  <p className="text-gray-500">
                    Receive personalized recommendations, challenges, and learning resources based on your goals and
                    progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <Code2 className="h-5 w-5 text-purple-600" />
            <span>CodePulse</span>
          </div>
          <p className="text-sm text-gray-500">© 2025 CodePulse. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-gray-500 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
