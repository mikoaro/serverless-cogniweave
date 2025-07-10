// Import the necessary AWS SDK v3 clients and commands.
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

// --- Client Initialization ---
// Initialize clients outside the handler for reuse.
const bedrockClient = new BedrockRuntimeClient({ region: "us-west-2" });
// Explicitly set the DynamoDB region to us-east-1 as specified.
const ddbClient = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// --- Configuration & Constants ---
const DYNAMODB_TABLE_NAME = "CogniWeave-Users"; // Best practice: use environment variables
const PROFILE_DEFAULTS = {
    targetReadingLevel: "grade_8",
    paragraphStrategy: "one_idea_per_paragraph",
    sentenceLength: "short",
    avoidJargon: true,
    useActiveVoice: true,
    vocabularyLevel: "simple",
    visualDistraction: "low",
    cognitiveNeeds: [], // Added new property for specific needs
};

// --- Helper Functions ---

/**
 * Saves the generated profile to the DynamoDB table.
 * @param {string} userId - The ID of the user.
 * @param {object} profile - The cognitive profile object.
 * @returns {Promise<object>} The data that was saved to the database.
 */
const createProfile = async (userId, profile) => {
    const profileData = {
        userId,
        profile,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
    const command = new PutCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Item: profileData,
    });
    await ddbDocClient.send(command);
    console.log(`[CreateProfile] Successfully saved profile for userId: ${userId}`);
    return profileData;
};

/**
 * Generates a profile using simple mapping as a fallback.
 * @param {object} userResponses - The user's responses.
 * @returns {object} The default profile.
 */
const generateProfileFromMapping = (userResponses) => {
    console.log("[CreateProfile] Fallback triggered. Generating profile from simple mapping.");
    return { ...PROFILE_DEFAULTS };
};

/**
 * Builds a standardized success HTTP response.
 * @param {object} responseData - The main data for the response body.
 * @param {number} processingTime - The time taken in milliseconds.
 * @returns {object} The full HTTP response object.
 */
const buildSuccessResponse = (responseData, processingTime) => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST,OPTIONS"
        },
        body: JSON.stringify({
            message: "Profile creation process completed successfully.",
            processingTimeMs: processingTime,
            ...responseData
        }),
    };
};

// --- Main Handler ---

export const handler = async (event) => {
  const startTime = Date.now();
  console.log("Received event:", JSON.stringify(event, null, 2));

  let profile;
  let aiGenerated = false;
  let confidence = 0;
  let reasoning = "N/A";
  let userId, userResponses;

  try {
    // --- 1. Extract and Validate User Input ---
    let requestBody;
    if (event.body) {
      requestBody = JSON.parse(event.body);
    } else {
      requestBody = event;
    }
    userId = requestBody.userId;
    userResponses = requestBody.userResponses;

    if (!userId) throw new Error("Error: 'userId' is required in the request body.");
    if (!userResponses) throw new Error("Error: 'userResponses' are required in the request body.");

    // --- 2. Construct and Invoke AI Model (if applicable) ---
    const systemPrompt = "You are an expert in cognitive accessibility and educational psychology. Analyze the user's onboarding responses to create an optimal cognitive profile. Your output must be a single, valid JSON object matching the specified format, with no additional text or explanations outside of the JSON structure.";
    const structuredPrompt = {
        task: "generate_cognitive_profile",
        user_responses: userResponses,
        instructions: {
          analyze: [
            "Identify cognitive patterns from the responses",
            "Consider learning style preferences",
            "Evaluate complexity tolerance",
            "Assess visual processing needs",
            "Infer potential cognitive needs (e.g., 'dyslexia_support', 'adhd_support') and represent them as an array of strings."
          ],
          generate: {
            profile_parameters: Object.keys(PROFILE_DEFAULTS),
            confidence_threshold: 0.8,
            reasoning_required: true
          }
        },
        output_format: {
          recommended_profile: "object with all required profile parameters, including an array for 'cognitiveNeeds'",
          confidence: "number between 0 and 1",
          reasoning: "explanation of recommendations"
        }
    };
    const modelId = "anthropic.claude-3-5-sonnet-20241022-v2:0";
    const bedrockBody = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{
            role: "user",
            content: [{ type: "text", text: JSON.stringify(structuredPrompt, null, 2) }],
        }],
    };
    const command = new InvokeModelCommand({
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(bedrockBody),
    });

    console.log(`Invoking Bedrock model for userId: ${userId}...`);
    const apiResponse = await bedrockClient.send(command);
    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBodyJson = JSON.parse(decodedResponseBody);
    const modelOutputText = responseBodyJson.content[0].text;
    const aiResponse = JSON.parse(modelOutputText);

    // --- 3. Process AI Response ---
    if (aiResponse.recommended_profile && aiResponse.confidence && aiResponse.reasoning) {
        profile = aiResponse.recommended_profile;
        confidence = aiResponse.confidence;
        reasoning = aiResponse.reasoning;
        aiGenerated = true;
        console.log(`[CreateProfile] AI profile generated for userId: ${userId} with confidence: ${confidence}`);
    } else {
        console.error("AI response did not match expected format. Falling back.");
        profile = generateProfileFromMapping(userResponses);
    }

  } catch (error) {
    // --- 4. Error Handling & Fallback ---
    console.error("An error occurred during AI profile generation:", error);
    const answers = userResponses || (event.body ? JSON.parse(event.body).userResponses : event.userResponses);
    profile = generateProfileFromMapping(answers || {});
    aiGenerated = false;
    reasoning = `AI generation failed with error: ${error.message}`;
  }

  // --- 5. Save Profile to Database ---
  const savedProfile = await createProfile(userId, profile);

  // --- 6. Return Final Response ---
  const processingTime = Date.now() - startTime;
  const responseData = {
      userId,
      profileCreated: true,
      aiGenerated,
      confidence,
      reasoning,
      profile: savedProfile.profile
  };

  return buildSuccessResponse(responseData, processingTime);
};
