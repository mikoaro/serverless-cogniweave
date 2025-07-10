import { type NextRequest, NextResponse } from "next/server";

// Helper function to generate cognitive needs based on user responses
function generateCognitiveNeeds(userResponses: any): string[] {
  const needs: string[] = [];

  if (userResponses.visualDistractionSensitivity === "high") {
    needs.push(
      "minimal_visual_clutter",
      "clean_layout",
      "consistent_formatting"
    );
  }

  if (userResponses.attentionSpan === "short_bursts") {
    needs.push("frequent_breaks", "chunked_content", "progress_indicators");
  }

  if (userResponses.readingPreference === "short_sentences") {
    needs.push("concise_language", "simple_sentence_structure");
  }

  if (userResponses.vocabularyLevel === "simple") {
    needs.push(
      "plain_language",
      "avoid_technical_terms",
      "define_complex_words"
    );
  }

  if (userResponses.preferredStructure === "bullet_points_for_lists") {
    needs.push("structured_lists", "clear_hierarchy", "visual_organization");
  }

  if (userResponses.readingPace === "slow_and_steady") {
    needs.push(
      "adequate_processing_time",
      "no_time_pressure",
      "self_paced_content"
    );
  }

  return needs;
}

// Helper function to determine paragraph strategy
function getParagraphStrategy(userResponses: any): string {
  if (userResponses.attentionSpan === "short_bursts") {
    return "short_blocks";
  } else if (userResponses.attentionSpan === "medium_sections") {
    return "one_idea_per_paragraph";
  } else {
    return "medium_blocks";
  }
}

// Helper function to map sentence length from new API format
function mapSentenceLength(apiSentenceLength: string): string {
  switch (apiSentenceLength) {
    case "8_to_12_words":
      return "short";
    case "12_to_18_words":
      return "medium";
    default:
      return "short";
  }
}

// Helper function to map vocabulary level from API format
function mapVocabularyLevel(apiVocabularyLevel: string): string {
  switch (apiVocabularyLevel) {
    case "basic":
      return "simple";
    case "intermediate":
      return "moderate";
    case "advanced":
      return "advanced";
    default:
      return "simple";
  }
}

// Helper function to map visual distraction from API format
function mapVisualDistraction(apiVisualDistraction: string): string {
  switch (apiVisualDistraction) {
    case "minimal":
      return "low";
    case "moderate":
      return "medium";
    case "high":
      return "high";
    default:
      return "low";
  }
}

// Helper function to map target reading level from API format
function mapTargetReadingLevel(apiReadingLevel: string): string {
  switch (apiReadingLevel) {
    case "6th_grade":
      return "grade_6";
    case "8th_grade":
      return "grade_8";
    case "10th_grade":
      return "grade_10";
    default:
      return "grade_6";
  }
}

export async function POST(request: NextRequest) {
  try {
    // Simulate API delay for CreateProfile Lambda
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const body = await request.json();
    console.log("Received CreateProfile request:", body); // Debug log

    const { userId, userResponses } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    if (!userResponses) {
      return NextResponse.json(
        { success: false, message: "Missing userResponses" },
        { status: 400 }
      );
    }

    // Validate required fields (now in camelCase)
    const requiredFields = [
      "readingPreference",
      "vocabularyLevel",
      "visualDistractionSensitivity",
      "preferredStructure",
    ];

    for (const field of requiredFields) {
      if (!userResponses[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate cognitive needs based on user responses
    const cognitiveNeeds = generateCognitiveNeeds(userResponses);

    // Mock the new API response format matching the provided structure
    const responseBody = {
      message: "Profile creation process completed successfully.",
      processingTimeMs: Math.floor(Math.random() * 5000) + 8000, // Random processing time
      userId,
      profileCreated: true,
      aiGenerated: true,
      confidence: 0.85,
      reasoning: {
        comprehension_needs:
          "Based on the preference for short sentences and simple vocabulary, a 6th-grade reading level will ensure optimal comprehension while maintaining engagement",
        attention_factors:
          "The high sensitivity to visual distractions combined with short attention spans suggests a need for minimal visual elements and concise content blocks",
        structural_elements:
          "Bullet points preference and slow reading pace indicate a need for clear, structured information presentation with adequate white space",
        cognitive_load:
          "The combination of responses suggests a user who benefits from reduced cognitive load through simplified language and clear organization",
        processing_considerations:
          "Short bursts of attention and preference for simple vocabulary indicate a need for easily digestible content chunks with straightforward language",
        key_adaptations: [
          "Break content into small, manageable sections",
          "Use clear, direct language",
          "Minimize decorative elements",
          "Maintain consistent structure",
          "Provide adequate processing time through layout",
        ],
      },
      profile: {
        targetReadingLevel: mapTargetReadingLevel(
          userResponses.vocabularyLevel
        ),
        paragraphStrategy: getParagraphStrategy(userResponses),
        sentenceLength: mapSentenceLength(userResponses.readingPreference),
        avoidJargon: userResponses.vocabularyLevel === "simple",
        useActiveVoice: true,
        vocabularyLevel: mapVocabularyLevel(userResponses.vocabularyLevel),
        visualDistraction: mapVisualDistraction(
          userResponses.visualDistractionSensitivity
        ),
        cognitiveNeeds: cognitiveNeeds, // Add the cognitiveNeeds property
      },
    };

    // Return the new format with nested JSON body
    const apiResponse = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: JSON.stringify(responseBody),
    };

    console.log("Created profile response:", apiResponse); // Debug log

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error("CreateProfile error:", error);
    return NextResponse.json(
      {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
        },
        body: JSON.stringify({
          message: "Failed to create profile",
          success: false,
        }),
      },
      { status: 500 }
    );
  }
}
