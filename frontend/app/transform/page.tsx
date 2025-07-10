"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/contexts/user-context";
import { toast } from "sonner";
import {
  Loader2,
  Copy,
  RotateCcw,
  Sparkles,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { TRANSFORM_CONTENT_API_URL } from "@/utils/constants";

const sampleTexts = {
  academic:
    "The intricate mechanism of cellular respiration involves a series of metabolic reactions and processes that take place in the cells of organisms to convert chemical energy from oxygen molecules or nutrients into adenosine triphosphate (ATP), and then release waste products.",
  legal:
    "The party of the first part hereby agrees to indemnify and hold harmless the party of the second part from and against any and all claims, damages, losses, costs, and expenses, including reasonable attorneys' fees, arising out of or resulting from the performance of this agreement.",
  technical:
    "The implementation utilizes a microservices architecture with containerized deployment orchestrated through Kubernetes, enabling horizontal scaling and fault tolerance while maintaining service isolation and inter-service communication via RESTful APIs.",
  medical:
    "Hypertension, commonly referred to as high blood pressure, is a chronic medical condition characterized by persistently elevated arterial blood pressure, typically defined as systolic pressure exceeding 140 mmHg or diastolic pressure exceeding 90 mmHg.",
  financial:
    "The diversified portfolio allocation strategy employs a systematic approach to risk management through asset class diversification, incorporating equities, fixed-income securities, and alternative investments to optimize risk-adjusted returns while maintaining liquidity requirements.",
};

export default function TransformPage() {
  const [inputText, setInputText] = useState("");
  const [transformedText, setTransformedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSample, setSelectedSample] = useState<string>("");
  const [isInitializing, setIsInitializing] = useState(true);
  const { userId, profile, hasCompletedOnboarding, resetProfile } = useUser();
  const router = useRouter();
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Handle initialization and prevent premature redirects
  useEffect(() => {
    // Give time for localStorage to load and context to initialize
    const timer = setTimeout(() => {
      setIsInitializing(false);

      // Only redirect after we're sure the context has loaded
      if (!hasCompletedOnboarding) {
        router.replace("/onboard");
      }
    }, 100); // Small delay to allow context to hydrate

    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding, router]);

  // Track mount status to avoid setting state after unmount
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting
  if (!hasCompletedOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Redirecting to onboarding...</p>
        </div>
      </div>
    );
  }

  const handleTransform = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to transform");
      return;
    }

    setIsLoading(true);

    try {
      // const response = await fetch("/api/transform", {
      const response = await fetch(`${TRANSFORM_CONTENT_API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          textContent: inputText,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debug log

      const parsedData = JSON.parse(data.body);
      
      console.log("Parsed JSON Body Data:", parsedData); // Parsed JSON Body Data

      if (parsedData.success) {
        parsedData.message = "Text transformed successfully!"
        setTransformedText(parsedData.transformedText);
        toast.success("Text transformed successfully!");
      } else {
        toast.error(parsedData.message || "Failed to transform text");
      }
    } catch (error) {
      console.error("Transform error:", error); // Debug log
      toast.error("Something went wrong. Please try again.");
    } finally {
      // Always clear loading state, regardless of component mount status
      setIsLoading(false);
    }
  };

  const handleSampleSelect = (value: string) => {
    setSelectedSample(value);
    if (value && sampleTexts[value as keyof typeof sampleTexts]) {
      setInputText(sampleTexts[value as keyof typeof sampleTexts]);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transformedText);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy text");
    }
  };

  const handleReset = () => {
    setInputText("");
    setTransformedText("");
    setSelectedSample("");
  };

  const getTextSizeClass = () => {
    switch (profile?.visualDistractionSensitivity) {
      case "high":
        return "text-lg"; // Larger text for high sensitivity
      case "low":
        return "text-sm"; // Smaller text for low sensitivity
      default:
        return "text-base";
    }
  };

  const getLineHeightClass = () => {
    switch (profile?.visualDistractionSensitivity) {
      case "high":
        return "leading-relaxed"; // More spacing for high sensitivity
      case "low":
        return "leading-tight"; // Less spacing for low sensitivity
      default:
        return "leading-normal";
    }
  };

  const handleResetProfile = () => {
    resetProfile();
    toast.success("Profile reset successfully! Redirecting to onboarding...");
    setTimeout(() => {
      router.push("/onboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Transform Your Text</h1>
          <p className="text-lg text-muted-foreground">
            Paste complex text below and watch it transform into clear,
            personalized content.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Input Text
              </CardTitle>
              <CardDescription>
                Paste your complex text here or choose a sample to try.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Try a sample text:
                </label>
                <Select
                  value={selectedSample}
                  onValueChange={handleSampleSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a sample text type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic Research</SelectItem>
                    <SelectItem value="legal">Legal Document</SelectItem>
                    <SelectItem value="technical">Technical Manual</SelectItem>
                    <SelectItem value="medical">Medical Information</SelectItem>
                    <SelectItem value="financial">
                      Financial Document
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Your text:
                </label>
                <Textarea
                  placeholder="Paste your complex text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleTransform}
                  disabled={isLoading || !inputText.trim()}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Transforming...
                    </>
                  ) : (
                    "Transform Text"
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>Transformed Text</CardTitle>
              <CardDescription>
                Your personalized, easy-to-read content appears here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">
                      AI is transforming your text...
                    </p>
                  </div>
                </div>
              ) : transformedText ? (
                <div className="space-y-4">
                  <div
                    className={`p-4 bg-muted/50 rounded-lg whitespace-pre-wrap ${getTextSizeClass()} ${getLineHeightClass()}`}
                    style={{ fontFamily: "inherit" }}
                  >
                    {transformedText}
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleCopy}
                    className="w-full bg-transparent"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
                  <p>Your transformed text will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary */}
        {profile && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Cognitive Profile</CardTitle>
              <CardDescription>
                Text is being transformed based on these preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Reading Style:</span>{" "}
                  {profile.readingPreference
                    ? (profile.readingPreference ?? "").replace(/_/g, " ")
                    : "Not specified"}
                </div>
                <div>
                  <span className="font-medium">Vocabulary:</span>{" "}
                  {profile.vocabularyLevel || "Not specified"}
                </div>
                <div>
                  <span className="font-medium">Visual Focus:</span>{" "}
                  {profile.visualDistractionSensitivity || "Not specified"}
                </div>
                <div>
                  <span className="font-medium">Structure:</span>{" "}
                  {profile.preferredStructure
                    ? (profile.preferredStructure ?? "").replace(/_/g, " ")
                    : "Not specified"}
                </div>
                <div>
                  <span className="font-medium">Reading Pace:</span>{" "}
                  {profile.readingPace
                    ? (profile.readingPace ?? "").replace(/_/g, " ")
                    : "Not specified"}
                </div>
                <div>
                  <span className="font-medium">Attention Span:</span>{" "}
                  {profile.attentionSpan
                    ? profile.attentionSpan.replace(/_/g, " ")
                    : "Not specified"}
                </div>
                <div>
                  <span className="font-medium">Target Reading Level:</span>{" "}
                  {profile.targetReadingLevel
                    ? profile.targetReadingLevel.replace(/_/g, " ")
                    : "Not specified"}
                </div>
              </div>

              {/* Show AI-generated profile details if available */}
              {profile.aiGenerated?.profile && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium mb-3">AI-Optimized Settings:</h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium">Target Reading Level:</span>{" "}
                      {profile.aiGenerated.profile.targetReadingLevel.replace(
                        /_/g,
                        " "
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Paragraph Strategy:</span>{" "}
                      {profile.aiGenerated.profile.paragraphStrategy.replace(
                        /_/g,
                        " "
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Sentence Length:</span>{" "}
                      {profile.aiGenerated.profile.sentenceLength}
                    </div>
                    <div>
                      <span className="font-medium">Visual Distraction:</span>{" "}
                      {profile.aiGenerated.profile.visualDistraction}
                    </div>
                    <div>
                      <span className="font-medium">Avoid Jargon:</span>{" "}
                      {profile.aiGenerated.profile.avoidJargon ? "Yes" : "No"}
                    </div>
                    <div>
                      <span className="font-medium">Use Active Voice:</span>{" "}
                      {profile.aiGenerated.profile.useActiveVoice
                        ? "Yes"
                        : "No"}
                    </div>
                  </div>

                  {/* Cognitive Needs Section */}
                  {profile.aiGenerated?.profile?.cognitiveNeeds &&
                  profile.aiGenerated.profile.cognitiveNeeds.length > 0 ? (
                    <div>
                      <span className="font-medium">Cognitive Needs:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.aiGenerated.profile.cognitiveNeeds.map(
                          (need, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                            >
                              {need.replace(/_/g, " ")}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  asChild
                >
                  <a href="/onboard">Update Profile</a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent text-destructive hover:text-destructive"
                  onClick={() => setShowResetDialog(true)}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {/* AI Insights Section */}
        {profile?.aiGenerated?.reasoning && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>AI Profile Insights</CardTitle>
              <CardDescription>
                AI-generated analysis of your cognitive needs (Confidence:{" "}
                {Math.round((profile.aiGenerated?.confidence || 0) * 100)}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-medium">Processing Time:</span>{" "}
                  {profile.aiGenerated?.processingTime || 0}ms
                </div>
                {profile.aiGenerated?.reasoning?.key_adaptations && (
                  <div>
                    <span className="font-medium">Key Adaptations:</span>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {profile.aiGenerated.reasoning.key_adaptations.map(
                        (adaptation, index) => (
                          <li key={index}>{adaptation}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {profile.aiGenerated?.reasoning?.cognitive_load && (
                  <div>
                    <span className="font-medium">
                      Cognitive Load Analysis:
                    </span>
                    <p className="mt-1 text-muted-foreground">
                      {profile.aiGenerated.reasoning.cognitive_load}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Reset Profile
              </CardTitle>
              <CardDescription>
                This will permanently delete your current cognitive profile and
                generate a new user ID. You'll need to complete the onboarding
                process again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowResetDialog(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleResetProfile}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
