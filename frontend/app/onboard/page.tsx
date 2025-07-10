"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useUser, type UserProfile } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { CREATE_PROFILE_API_URL } from "@/utils/constants";

const onboardingSteps = [
  {
    id: "readingPreference",
    title: "Reading Style",
    description: "How do you like sentences to be written?",
    question: "What reading style works best for you?",
    options: [
      {
        value: "short_sentences",
        label: "Short sentences",
        description: "Brief and clear sentences",
      },
      {
        value: "medium_sentences",
        label: "Medium sentences",
        description: "Balanced sentence length",
      },
      {
        value: "detailed_explanations",
        label: "Detailed explanations",
        description: "Longer, more complete sentences",
      },
    ],
  },
  {
    id: "vocabularyLevel",
    title: "Word Difficulty",
    description: "What level of vocabulary do you prefer?",
    question: "Which words are easier for you to understand?",
    options: [
      {
        value: "simple",
        label: "Simple words",
        description: "Easy, everyday language",
      },
      {
        value: "moderate",
        label: "Mixed vocabulary",
        description: "Some complex words are okay",
      },
      {
        value: "advanced",
        label: "Advanced words",
        description: "Complex vocabulary is fine",
      },
    ],
  },
  {
    id: "visualDistractionSensitivity",
    title: "Visual Focus",
    description: "How do visual elements affect your reading?",
    question: "What helps you focus while reading?",
    options: [
      {
        value: "high",
        label: "Clean and simple",
        description: "Minimal formatting, less distracting",
      },
      {
        value: "medium",
        label: "Some formatting",
        description: "A little formatting helps",
      },
      {
        value: "low",
        label: "Rich formatting",
        description: "Colors and styles help me focus",
      },
    ],
  },
  {
    id: "preferredStructure",
    title: "Information Layout",
    description: "How do you like information organized?",
    question: "Which format helps you understand better?",
    options: [
      {
        value: "bullet_points_for_lists",
        label: "Bullet points",
        description: "Clear, separated points",
      },
      {
        value: "numbered_lists",
        label: "Numbered lists",
        description: "Step-by-step format",
      },
      {
        value: "paragraphs",
        label: "Paragraphs",
        description: "Traditional text blocks",
      },
    ],
  },
  {
    id: "readingPace",
    title: "Reading Speed",
    description: "How fast do you like to process information?",
    question: "What reading pace works best for you?",
    options: [
      {
        value: "slow_and_steady",
        label: "Slow and steady",
        description: "I like to take my time",
      },
      {
        value: "moderate_pace",
        label: "Moderate pace",
        description: "Not too fast, not too slow",
      },
      {
        value: "quick_reading",
        label: "Quick reading",
        description: "I prefer to read quickly",
      },
    ],
  },
  {
    id: "attentionSpan",
    title: "Focus Duration",
    description: "How long can you focus on reading?",
    question: "What works best for your attention?",
    options: [
      {
        value: "short_bursts",
        label: "Short sections",
        description: "Small chunks work better",
      },
      {
        value: "medium_sections",
        label: "Medium sections",
        description: "Balanced content blocks",
      },
      {
        value: "long_form",
        label: "Longer content",
        description: "I can focus for longer periods",
      },
    ],
  },
];

// Helper function to map API values to our UserProfile format
function mapApiProfileToUserProfile(apiProfile: any): Partial<UserProfile> {
  return {
    targetReadingLevel:
      apiProfile.targetReadingLevel === "6th_grade"
        ? "grade_6"
        : apiProfile.targetReadingLevel === "8th_grade"
        ? "grade_8"
        : "grade_10",
  };
}

export default function OnboardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserProfile>>({});
  const { userId, setProfile } = useUser();
  const router = useRouter();
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStepData.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!userId) {
      toast.error("User ID not available. Please refresh the page.");
      return;
    }

    setIsCreatingProfile(true);

    // Prepare the JSON payload with camelCase keys
    const userResponses = {
      readingPreference: answers.readingPreference,
      vocabularyLevel: answers.vocabularyLevel,
      visualDistractionSensitivity: answers.visualDistractionSensitivity,
      preferredStructure: answers.preferredStructure,
      readingPace: answers.readingPace,
      attentionSpan: answers.attentionSpan,
    };

    try {
      // Call the /users API endpoint with camelCase payload
      // `${CREATE_PROFILE_API_URL}`
      // const response = await fetch("/api/users", {
      const response = await fetch(`${CREATE_PROFILE_API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          userResponses: userResponses,
        }),
      });

      const apiResponse = await response.json();
      console.log("CreateProfile API response:", apiResponse);

      // Parse the nested JSON body
      let parsedBody;
      try {
        parsedBody = JSON.parse(apiResponse.body);
      } catch (parseError) {
        console.error("Failed to parse response body:", parseError);
        toast.error("Invalid response format from server");
        return;
      }

      // Check if profile creation was successful
      if (apiResponse.statusCode === 200 && parsedBody.profileCreated) {
        // Map the AI-generated profile to our UserProfile format
        const aiProfile = parsedBody.profile;

        const completeProfile: UserProfile = {
          readingPreference:
            answers.readingPreference as UserProfile["readingPreference"],
          vocabularyLevel:
            answers.vocabularyLevel as UserProfile["vocabularyLevel"],
          visualDistractionSensitivity:
            answers.visualDistractionSensitivity as UserProfile["visualDistractionSensitivity"],
          preferredStructure:
            answers.preferredStructure as UserProfile["preferredStructure"],
          readingPace: answers.readingPace as UserProfile["readingPace"],
          attentionSpan: answers.attentionSpan as UserProfile["attentionSpan"],
          targetReadingLevel:
            aiProfile.targetReadingLevel === "6th_grade"
              ? "grade_6"
              : aiProfile.targetReadingLevel === "8th_grade"
              ? "grade_8"
              : "grade_10",
        };

        // Store additional AI-generated profile data for transform API
        const enhancedProfile = {
          ...completeProfile,
          aiGenerated: {
            confidence: parsedBody.confidence,
            reasoning: parsedBody.reasoning,
            profile: {
              targetReadingLevel:
                aiProfile.targetReadingLevel === "6th_grade"
                  ? "grade_6"
                  : aiProfile.targetReadingLevel === "8th_grade"
                  ? "grade_8"
                  : "grade_10",
              paragraphStrategy: aiProfile.paragraphStrategy,
              sentenceLength:
                aiProfile.sentenceLength === "8_to_12_words"
                  ? "short"
                  : aiProfile.sentenceLength === "12_to_18_words"
                  ? "medium"
                  : "short",
              avoidJargon: aiProfile.avoidJargon,
              useActiveVoice: aiProfile.useActiveVoice,
              vocabularyLevel:
                aiProfile.vocabularyLevel === "basic"
                  ? "simple"
                  : aiProfile.vocabularyLevel === "intermediate"
                  ? "moderate"
                  : "advanced",
              visualDistraction:
                aiProfile.visualDistraction === "minimal"
                  ? "low"
                  : aiProfile.visualDistraction === "moderate"
                  ? "medium"
                  : "high",
              cognitiveNeeds: aiProfile.cognitiveNeeds || [], // Ensure cognitiveNeeds is preserved
            },
            processingTime: parsedBody.processingTimeMs,
          },
        };

        setProfile(enhancedProfile as UserProfile);

        toast.success(
          `Profile created successfully! (${
            parsedBody.processingTimeMs
          }ms, ${Math.round(parsedBody.confidence * 100)}% confidence)`
        );
        router.push("/transform");
      } else {
        toast.error(parsedBody.message || "Failed to create profile");
      }
    } catch (error) {
      console.error("Profile creation error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const canProceed = answers[currentStepData.id as keyof UserProfile];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Set Up Your Profile</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
          {userId && (
            <p className="text-xs text-muted-foreground mt-2">
              User ID: {userId}
            </p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">
                {currentStepData.question}
              </h3>
              <RadioGroup
                value={answers[currentStepData.id as keyof UserProfile] || ""}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {currentStepData.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={option.value}
                        className="font-medium cursor-pointer"
                      >
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed || isCreatingProfile}
              >
                {currentStep === onboardingSteps.length - 1 ? (
                  isCreatingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    "Complete"
                  )
                ) : (
                  "Next"
                )}
                {currentStep < onboardingSteps.length - 1 && (
                  <ChevronRight className="w-4 h-4 ml-2" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
