import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Zap, Users, Shield, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">About CogniWeave</h1>
          <p className="text-xl text-muted-foreground mb-8">
            A Lambda-Powered Cognitive Accessibility Engine that unlocks digital understanding for everyone.
          </p>
        </div>

        {/* The Vision */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">The CogniWeave Vision</CardTitle>
              <CardDescription>Unlocking Digital Understanding</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-lg leading-relaxed">
                Every mind is unique, but our digital world is full of complex information. For millions of people with
                learning differences, dense text is a barrier. CogniWeave is a revolutionary web application, powered
                directly by AWS Lambda and Amazon Bedrock, that breaks down that barrier.
              </p>
              <p className="text-lg leading-relaxed">
                Users simply paste complex text into our app, and our serverless AI engine instantly simplifies it into
                clear, easy-to-read chunks, personalized to their unique cognitive needs. CogniWeave is a centralized
                hub for making information truly accessible.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* The Problem */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">The Cognitive Accessibility Chasm</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed mb-6">
                An estimated 15-20% of the population is neurodivergent, a group that includes individuals with
                Attention-Deficit/Hyperactivity Disorder (ADHD), dyslexia, and Autism Spectrum Disorder (ASD). This
                significant segment of the global population faces substantial barriers when attempting to process
                dense, complex text.
              </p>
              <p className="text-lg leading-relaxed">
                Information across crucial domains—from academic papers and legal documents to professional reports and
                technical manuals—is overwhelmingly presented in a one-size-fits-all format. This standardized
                presentation inherently alienates a large and capable audience, creating a cognitive accessibility chasm
                that hinders educational attainment, professional growth, and equitable access to information.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How CogniWeave Works</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <Brain className="h-10 w-10 text-primary mb-2" />
                <CardTitle>The Direct Lambda-AI Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">
                  The innovation of CogniWeave is its elegant and powerful simplicity. The core is a focused, text-in,
                  text-out engine. A user pastes any block of text into the Next.js application. On submission, the app
                  calls an API Gateway endpoint that triggers one AWS Lambda function.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Serverless Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">
                  This function is the entire brain of the operation: it fetches the user's profile from Amazon
                  DynamoDB, constructs a detailed prompt for Amazon Bedrock using Anthropic's Claude 3.5 Sonnet, and
                  orchestrates the AI-driven simplification in a single, synchronous step.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Architecture Diagram */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
              <CardDescription>A pure serverless design powered by AWS Lambda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 py-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Next.js App</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium">API Gateway</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Lambda Function</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Bedrock AI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Demo Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Demo Steps</h2>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  User Onboarding (45 seconds)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed mb-4">
                  <strong>Action:</strong> The presenter shows the CogniWeave web application's clean home screen. They
                  quickly complete the simple, multi-step onboarding wizard with questions about reading preferences
                  (e.g., "How do you prefer to read?" with options like "Short sentences" or "Detailed explanations").
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  <strong>Technical Narration:</strong> "Our Next.js app just made a single API call to our
                  CreateProfile AWS Lambda function. That function used the reasoning power of Amazon Bedrock to create
                  a personalized cognitive profile based on those answers and saved it securely to Amazon DynamoDB. The
                  entire backend for this is serverless."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  Live Text Transformation (1.5 minutes)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed mb-4">
                  <strong>Action:</strong> The presenter navigates to the "Transform" page. They copy a paragraph of
                  dense, academic text from a source like Wikipedia or a scientific journal and paste it into the input
                  box. They click the "Transform" button. A brief loading animation appears. The output box is then
                  populated with a simplified, easy-to-read version of the text, visibly broken into shorter sentences
                  and paragraphs with more generous spacing.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  <strong>Technical Narration:</strong> "And this is our core innovation in action. The app just sent
                  that complex text to our TransformContent Lambda via API Gateway. In a single, synchronous execution,
                  that Lambda function retrieved our unique profile from DynamoDB, then instructed Amazon Bedrock's
                  Claude 3.5 Sonnet to rewrite the text according to our exact cognitive needs. This powerful,
                  personalized simplification was orchestrated in real-time by a single, lean Lambda function. No
                  servers, no containers, just code."
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Personalized Cognitive Profiles</h3>
                    <p className="text-muted-foreground">
                      Tailored for ADHD, dyslexia, autism, and other learning differences through a simple onboarding
                      process.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Real-Time Processing</h3>
                    <p className="text-muted-foreground">
                      Instant text transformation powered by AWS Lambda and Amazon Bedrock AI.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Serverless Architecture</h3>
                    <p className="text-muted-foreground">
                      Scalable, cost-effective, and reliable infrastructure that scales automatically with demand.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Privacy-Focused</h3>
                    <p className="text-muted-foreground">
                      Your data stays secure with local storage and privacy-first design principles.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card>
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Experience CogniWeave?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Transform your reading experience with personalized AI-powered text simplification.
              </p>
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/onboard">Get Started Now</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
