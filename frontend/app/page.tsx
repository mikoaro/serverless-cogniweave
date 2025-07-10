"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Zap, Users, Shield } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/contexts/user-context"

export default function HomePage() {
  const { hasCompletedOnboarding } = useUser()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Unlock Digital <span className="text-primary">Understanding</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform complex text into clear, personalized content tailored to your unique cognitive needs. Powered by
            AWS Lambda and AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {hasCompletedOnboarding ? (
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/transform">Start Transforming</Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/onboard">Get Started</Link>
              </Button>
            )}
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Breaking Down the Cognitive Accessibility Chasm</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              15-20% of the population is neurodivergent. CogniWeave makes information accessible for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Brain className="h-10 w-10 text-primary mb-2" />
                <CardTitle>AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced AI understands your cognitive needs and transforms text accordingly.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Instant Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get simplified text in seconds with our serverless AWS Lambda architecture.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Personalized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Tailored for ADHD, dyslexia, autism, and other learning differences.</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Your data stays secure with our privacy-focused, serverless design.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Reading Experience?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who have unlocked their potential with CogniWeave.
          </p>
          {hasCompletedOnboarding ? (
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/transform">Start Transforming</Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/onboard">Get Started Now</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
