// Import the necessary AWS SDK v3 clients and commands.
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// --- Client Initialization ---
// Initialize clients outside the handler for reuse across invocations.
const bedrockClient = new BedrockRuntimeClient({ region: "us-west-2" });
const ddbClient = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// --- Configuration & Constants ---
const DYNAMODB_TABLE_NAME = "CogniWeave-Users";

// --- Helper Functions ---

/**
 * Fetches a user's profile from the DynamoDB table.
 * @param {string} userId - The ID of the user whose profile is to be fetched.
 * @returns {Promise<object|null>} The user's profile object, or null if not found.
 */
const getUserProfile = async (userId) => {
    const command = new GetCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: { userId },
    });
    const { Item } = await ddbDocClient.send(command);
    console.log(`[TransformContent] Fetched profile for userId: ${userId}`);
    return Item ? Item.profile : null;
};

/**
 * Builds a standardized HTTP response.
 * @param {number} statusCode - The HTTP status code.
 * @param {object} body - The response body to be stringified.
 * @returns {object} The full HTTP response object.
 */
const buildResponse = (statusCode, body) => {
    return {
        statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST,OPTIONS"
        },
        body: JSON.stringify(body),
    };
};

// --- Main Handler ---

export const handler = async (event) => {
  const startTime = Date.now();
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    // --- 1. Extract and Validate Input ---
    let requestBody;
    if (event.body) {
      requestBody = JSON.parse(event.body);
    } else {
      requestBody = event;
    }
    const { userId, textContent } = requestBody;

    if (!userId) {
        return buildResponse(400, { success: false, error: "Error: 'userId' is required in the request body." });
    }
    if (!textContent) {
        return buildResponse(400, { success: false, error: "Error: 'textContent' is required in the request body." });
    }

    // --- 2. Fetch User's Cognitive Profile ---
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
        return buildResponse(404, { success: false, error: `Error: No profile found for userId: ${userId}.` });
    }

    // --- 3. Construct the Transformation Prompt ---
    const systemPrompt = "You are an expert content transformation engine. Your task is to process the user's JSON request. You will rewrite the 'text_content' to perfectly match the cognitive 'profile' provided. Adhere strictly to all parameters in the profile. The output should only be the transformed text, with no additional commentary, explanations, or JSON formatting.";
    
    const structuredPrompt = {
        task: "simplify_text",
        profile: userProfile,
        text_content: textContent,
    };

    // --- 4. Invoke the Bedrock Model ---
    const modelId = "anthropic.claude-3-5-sonnet-20241022-v2:0";
    const bedrockBody = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4096, // Allow for longer content transformations
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

    console.log(`[TransformContent] Invoking Bedrock model for userId: ${userId}...`);
    const apiResponse = await bedrockClient.send(command);
    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBodyJson = JSON.parse(decodedResponseBody);
    const transformedContent = responseBodyJson.content[0].text;
    
    // --- 5. Return the Final Response ---
    const processingTime = Date.now() - startTime;
    const responseData = {
        success: true,
        userId,
        transformedText: transformedContent,
        originalText: textContent,
        processingTime: (processingTime / 1000).toFixed(1) + 's',
    };
    return buildResponse(200, responseData);

  } catch (error) {
    // --- Error Handling ---
    console.error("[TransformContent] An error occurred:", error);
    const originalText = event.body ? JSON.parse(event.body).textContent : event.textContent;
    return buildResponse(500, { 
        success: false,
        error: error.message,
        originalText: originalText,
    });
  }
};
