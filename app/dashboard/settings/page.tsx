"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { toast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications")
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      dailyDigest: true,
      weeklyReport: true,
      challengeReminders: true,
    },
    privacy: {
      publicProfile: false,
      shareProgress: false,
      shareStreak: true,
      shareAchievements: true,
    },
    appearance: {
      darkMode: false,
      compactView: false,
      highContrast: false,
    },
  })

  const handleToggle = (category: string, setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: !prev[category as keyof typeof prev][setting as any],
      },
    }))
  }

  const saveSettings = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  return (
    <SidebarProvider> {/* Add this wrapper */}
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-gray-500">Manage your application settings and preferences</p>
          </div>

          <Tabs defaultValue="notifications" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Control how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.notifications.email}
                      onCheckedChange={() => handleToggle("notifications", "email")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.notifications.push}
                      onCheckedChange={() => handleToggle("notifications", "push")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="daily-digest">Daily Digest</Label>
                      <p className="text-sm text-gray-500">Receive a summary of your daily activity</p>
                    </div>
                    <Switch
                      id="daily-digest"
                      checked={settings.notifications.dailyDigest}
                      onCheckedChange={() => handleToggle("notifications", "dailyDigest")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-report">Weekly Report</Label>
                      <p className="text-sm text-gray-500">Receive a weekly summary of your progress</p>
                    </div>
                    <Switch
                      id="weekly-report"
                      checked={settings.notifications.weeklyReport}
                      onCheckedChange={() => handleToggle("notifications", "weeklyReport")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="challenge-reminders">Challenge Reminders</Label>
                      <p className="text-sm text-gray-500">Get reminded about your daily coding challenge</p>
                    </div>
                    <Switch
                      id="challenge-reminders"
                      checked={settings.notifications.challengeReminders}
                      onCheckedChange={() => handleToggle("notifications", "challengeReminders")}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings}>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="public-profile">Public Profile</Label>
                      <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                    </div>
                    <Switch
                      id="public-profile"
                      checked={settings.privacy.publicProfile}
                      onCheckedChange={() => handleToggle("privacy", "publicProfile")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="share-progress">Share Progress</Label>
                      <p className="text-sm text-gray-500">Allow others to see your learning progress</p>
                    </div>
                    <Switch
                      id="share-progress"
                      checked={settings.privacy.shareProgress}
                      onCheckedChange={() => handleToggle("privacy", "shareProgress")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="share-streak">Share Streak</Label>
                      <p className="text-sm text-gray-500">Allow others to see your coding streak</p>
                    </div>
                    <Switch
                      id="share-streak"
                      checked={settings.privacy.shareStreak}
                      onCheckedChange={() => handleToggle("privacy", "shareStreak")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="share-achievements">Share Achievements</Label>
                      <p className="text-sm text-gray-500">Allow others to see your achievements</p>
                    </div>
                    <Switch
                      id="share-achievements"
                      checked={settings.privacy.shareAchievements}
                      onCheckedChange={() => handleToggle("privacy", "shareAchievements")}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings}>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize how the application looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-gray-500">Use dark theme for the application</p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={settings.appearance.darkMode}
                      onCheckedChange={() => handleToggle("appearance", "darkMode")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-view">Compact View</Label>
                      <p className="text-sm text-gray-500">Use a more compact layout</p>
                    </div>
                    <Switch
                      id="compact-view"
                      checked={settings.appearance.compactView}
                      onCheckedChange={() => handleToggle("appearance", "compactView")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">High Contrast</Label>
                      <p className="text-sm text-gray-500">Increase contrast for better accessibility</p>
                    </div>
                    <Switch
                      id="high-contrast"
                      checked={settings.appearance.highContrast}
                      onCheckedChange={() => handleToggle("appearance", "highContrast")}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings}>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
    </SidebarProvider> 
  )
}
