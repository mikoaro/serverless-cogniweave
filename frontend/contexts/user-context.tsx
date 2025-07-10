"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface UserProfile {
  readingPreference:
    | "short_sentences"
    | "medium_sentences"
    | "detailed_explanations";
  vocabularyLevel: "simple" | "moderate" | "advanced";
  visualDistractionSensitivity: "high" | "medium" | "low";
  preferredStructure:
    | "bullet_points_for_lists"
    | "numbered_lists"
    | "paragraphs";
  readingPace: "slow_and_steady" | "moderate_pace" | "quick_reading";
  attentionSpan: "short_bursts" | "medium_sections" | "long_form";
  targetReadingLevel: "grade_6" | "grade_8" | "grade_10";
  aiGenerated?: {
    confidence: number;
    reasoning: {
      comprehension_needs: string;
      attention_factors: string;
      structural_elements: string;
      cognitive_load: string;
      processing_considerations: string;
      key_adaptations: string[];
    };
    profile: {
      targetReadingLevel: "grade_6" | "grade_8" | "grade_10";
      paragraphStrategy:
        | "one_idea_per_paragraph"
        | "short_blocks"
        | "medium_blocks"
        | "long_form";
      sentenceLength: "short" | "medium" | "long";
      avoidJargon: boolean;
      useActiveVoice: boolean;
      vocabularyLevel: "simple" | "moderate" | "advanced";
      visualDistraction: "low" | "medium" | "high";
      cognitiveNeeds: string[];
    };
    processingTime: number;
  };
}

interface UserContextType {
  userId: string | null;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  hasCompletedOnboarding: boolean;
  resetProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const storedUserId = localStorage.getItem("cogniweave-userId");
    const storedProfile = localStorage.getItem("cogniweave-profile");

    if (storedUserId && storedProfile) {
      setUserId(storedUserId);
      setProfileState(JSON.parse(storedProfile));
      setHasCompletedOnboarding(true);
    } else {
      // Generate new UUID when application loads for the first time
      const newUserId = uuidv4();
      setUserId(newUserId);
      localStorage.setItem("cogniweave-userId", newUserId);
      console.log("Generated new UUID for user:", newUserId);
    }
  }, []);

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    setHasCompletedOnboarding(true);
    localStorage.setItem("cogniweave-profile", JSON.stringify(newProfile));
  };

  const resetProfile = () => {
    // Generate new UUID
    const newUserId = uuidv4();
    setUserId(newUserId);

    // Clear profile
    setProfileState(null);
    setHasCompletedOnboarding(false);

    // Update localStorage
    localStorage.setItem("cogniweave-userId", newUserId);
    localStorage.removeItem("cogniweave-profile");

    console.log("Profile reset - new UUID generated:", newUserId);
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        profile,
        setProfile,
        hasCompletedOnboarding,
        resetProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
