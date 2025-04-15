"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Check, Code2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const totalSteps = 8
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    technologies: [] as string[],
    goal: "",
    learningStyle: "",
    timeCommitment: "",
    trackingMetrics: [] as string[],
    motivation: "",
    preferences: [] as string[],
  })

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleTechnology = (tech: string) => {
    setFormData((prev) => {
      const technologies = prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech]
      return { ...prev, technologies }
    })
  }

  const toggleTrackingMetric = (metric: string) => {
    setFormData((prev) => {
      const trackingMetrics = prev.trackingMetrics.includes(metric)
        ? prev.trackingMetrics.filter((m) => m !== metric)
        : [...prev.trackingMetrics, metric]
      return { ...prev, trackingMetrics }
    })
  }

  const togglePreference = (pref: string) => {
    setFormData((prev) => {
      const preferences = prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref]
      return { ...prev, preferences }
    })
  }

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Submit form data and redirect to dashboard
      submitProfile()
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const submitProfile = async () => {
    try {
      setError(null)
      const response = await fetch("/api/user-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to save profile")
      }

      toast({
        title: "Profile saved",
        description: "Your profile has been saved successfully.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error saving profile:", error)
      setError(error.message || "Failed to save your profile. Please try again.")
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Code2 className="h-6 w-6 text-purple-600" />
            <span>CodePulse</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Let's personalize your experience</CardTitle>
            <CardDescription>
              Step {step} of {totalSteps}: {getStepDescription(step)}
            </CardDescription>
            <Progress value={(step / totalSteps) * 100} className="mt-2" />
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">What's your name or dev alias?</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">How many years of coding experience do you have?</Label>
                  <Select value={formData.experience} onValueChange={(value) => updateFormData("experience", value)}>
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Less than 1 year</SelectItem>
                      <SelectItem value="intermediate">1-3 years</SelectItem>
                      <SelectItem value="experienced">3-5 years</SelectItem>
                      <SelectItem value="advanced">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Label>What languages/technologies do you currently use or want to learn?</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "JavaScript",
                    "TypeScript",
                    "Python",
                    "Java",
                    "C#",
                    "Go",
                    "Rust",
                    "React",
                    "Vue",
                    "Angular",
                    "Node.js",
                    "Next.js",
                    "SQL",
                    "NoSQL",
                    "AWS",
                    "Docker",
                  ].map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox
                        id={tech}
                        checked={formData.technologies.includes(tech)}
                        onCheckedChange={() => toggleTechnology(tech)}
                      />
                      <Label htmlFor={tech}>{tech}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Label htmlFor="goal">What is your main goal?</Label>
                <RadioGroup value={formData.goal} onValueChange={(value) => updateFormData("goal", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="job" id="goal-job" />
                    <Label htmlFor="goal-job">Get a job</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="opensource" id="goal-opensource" />
                    <Label htmlFor="goal-opensource">Contribute to open source</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="projects" id="goal-projects" />
                    <Label htmlFor="goal-projects">Build projects</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="newstack" id="goal-newstack" />
                    <Label htmlFor="goal-newstack">Learn a new stack</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <Label htmlFor="learningStyle">How do you prefer to learn?</Label>
                <RadioGroup
                  value={formData.learningStyle}
                  onValueChange={(value) => updateFormData("learningStyle", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reading" id="learning-reading" />
                    <Label htmlFor="learning-reading">Reading documentation and articles</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="videos" id="learning-videos" />
                    <Label htmlFor="learning-videos">Watching videos and tutorials</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="projects" id="learning-projects" />
                    <Label htmlFor="learning-projects">Building projects</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="problems" id="learning-problems" />
                    <Label htmlFor="learning-problems">Solving problems and challenges</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <Label htmlFor="timeCommitment">How much time can you dedicate to coding?</Label>
                <RadioGroup
                  value={formData.timeCommitment}
                  onValueChange={(value) => updateFormData("timeCommitment", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="15min" id="time-15min" />
                    <Label htmlFor="time-15min">15 minutes per day</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30min" id="time-30min" />
                    <Label htmlFor="time-30min">30 minutes per day</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1hour" id="time-1hour" />
                    <Label htmlFor="time-1hour">1 hour per day</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2hours" id="time-2hours" />
                    <Label htmlFor="time-2hours">2+ hours per day</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekends" id="time-weekends" />
                    <Label htmlFor="time-weekends">Weekends only</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <Label>What would you like to track?</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Coding time",
                    "Problems solved",
                    "GitHub commits",
                    "Projects completed",
                    "Concepts learned",
                    "Books/courses completed",
                  ].map((metric) => (
                    <div key={metric} className="flex items-center space-x-2">
                      <Checkbox
                        id={metric}
                        checked={formData.trackingMetrics.includes(metric)}
                        onCheckedChange={() => toggleTrackingMetric(metric)}
                      />
                      <Label htmlFor={metric}>{metric}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4">
                <Label htmlFor="motivation">What motivates you most?</Label>
                <RadioGroup value={formData.motivation} onValueChange={(value) => updateFormData("motivation", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="achievements" id="motivation-achievements" />
                    <Label htmlFor="motivation-achievements">Achievements and badges</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="streaks" id="motivation-streaks" />
                    <Label htmlFor="motivation-streaks">Maintaining streaks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="xp" id="motivation-xp" />
                    <Label htmlFor="motivation-xp">XP points and leveling up</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="peers" id="motivation-peers" />
                    <Label htmlFor="motivation-peers">Peer comparisons and leaderboards</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 8 && (
              <div className="space-y-4">
                <Label>Productivity preferences:</Label>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    "Daily reminders to code",
                    "Daily coding challenges",
                    "Motivational quotes",
                    "Weekly progress reports",
                    "Learning resource recommendations",
                  ].map((pref) => (
                    <div key={pref} className="flex items-center space-x-2">
                      <Checkbox
                        id={pref}
                        checked={formData.preferences.includes(pref)}
                        onCheckedChange={() => togglePreference(pref)}
                      />
                      <Label htmlFor={pref}>{pref}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={step === 1}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700">
              {step === totalSteps ? (
                <>
                  Complete <Check className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

function getStepDescription(step: number): string {
  switch (step) {
    case 1:
      return "General Information"
    case 2:
      return "Technologies"
    case 3:
      return "Goals"
    case 4:
      return "Learning Style"
    case 5:
      return "Time Commitment"
    case 6:
      return "Tracking Metrics"
    case 7:
      return "Motivation"
    case 8:
      return "Preferences"
    default:
      return ""
  }
}
