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
    id: "reading_preference",
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
    id: "vocabulary_level",
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
    id: "visual_distraction_sensitivity",
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
    id: "preferred_structure",
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
    id: "reading_pace",
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
    id: "attention_span",
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

    // Prepare the JSON payload with UUID and user responses
    const userResponses = {
      reading_preference: answers.reading_preference,
      vocabulary_level: answers.vocabulary_level,
      visual_distraction_sensitivity: answers.visual_distraction_sensitivity,
      preferred_structure: answers.preferred_structure,
      reading_pace: answers.reading_pace,
      attention_span: answers.attention_span,
    };

    // cogniweave-userId - c21d4c44-571e-4e74-ad24-9a2049fc3bb8
    // cogniweave-profile
    // {
    //    "reading_preference":"short_sentences",
    //    "vocabulary_level":"simple",
    //    "visual_distraction_sensitivity":"high",
    //    "preferred_structure":"bullet_points_for_lists",
    //    "reading_pace":"slow_and_steady",
    //    "attention_span":"short_bursts",
    //    "target_reading_level":"grade_6"
    // }

    // {
    //   "userId": "a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789",
    //   "user_responses": {
    //     "reading_preference": "short_sentences",
    //     "vocabulary_level": "simple",
    //     "visual_distraction_sensitivity": "high",
    //     "preferred_structure": "bullet_points_for_lists"
    //   }
    // }

    try {
      // Call the /users API endpoint with UUID
      console.log("---- `${CREATE_PROFILE_API_URL}` ---");
      console.log(`${CREATE_PROFILE_API_URL}`);

      console.log("--- JSON Body to send ---");
      console.log(
        JSON.stringify({
          userId: userId,
          user_responses: userResponses,
        })
      );

      const response = await fetch(`${CREATE_PROFILE_API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          user_responses: userResponses,
        }),
      });

      // const response = await fetch("/api/users", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     userId: userId,
      //     user_responses: userResponses,
      //   }),
      // });

      const data = await response.json();
      console.log("CreateProfile API response:", data);

      if (data.success) {
        // Set default reading level based on preferences
        const target_reading_level =
          answers.vocabulary_level === "simple"
            ? "grade_6"
            : answers.vocabulary_level === "moderate"
            ? "grade_8"
            : "grade_10";

        const completeProfile: UserProfile = {
          reading_preference:
            answers.reading_preference as UserProfile["reading_preference"],
          vocabulary_level:
            answers.vocabulary_level as UserProfile["vocabulary_level"],
          visual_distraction_sensitivity:
            answers.visual_distraction_sensitivity as UserProfile["visual_distraction_sensitivity"],
          preferred_structure:
            answers.preferred_structure as UserProfile["preferred_structure"],
          reading_pace: answers.reading_pace as UserProfile["reading_pace"],
          attention_span:
            answers.attention_span as UserProfile["attention_span"],
          target_reading_level,
        };

        setProfile(completeProfile);
        toast.success("Profile created successfully! Ready to transform text.");
        router.push("/transform");
      } else {
        toast.error(data.message || "Failed to create profile");
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
