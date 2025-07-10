import { type NextRequest, NextResponse } from "next/server";

// Sample transformed texts for different types of content
const sampleTransformations = {
  academic: {
    original:
      "The intricate mechanism of cellular respiration involves a series of metabolic reactions and processes that take place in the cells of organisms to convert chemical energy from oxygen molecules or nutrients into adenosine triphosphate (ATP), and then release waste products.",
    transformed:
      "Cells need energy to work. They get this energy through a process called cellular respiration.\n\nHere's how it works:\n• Cells take in oxygen and nutrients\n• They break these down in special reactions\n• This creates ATP, which is like a battery for the cell\n• Waste products are removed\n\nATP gives cells the power they need to do their jobs.",
  },
  legal: {
    original:
      "The party of the first part hereby agrees to indemnify and hold harmless the party of the second part from and against any and all claims, damages, losses, costs, and expenses, including reasonable attorneys' fees, arising out of or resulting from the performance of this agreement.",
    transformed:
      "The first person in this contract promises to protect the second person.\n\nThis protection covers:\n• Any claims against them\n• Money they might lose\n• Costs they have to pay\n• Lawyer fees\n\nThis protection applies if problems come from doing what this contract says.",
  },
  technical: {
    original:
      "The implementation utilizes a microservices architecture with containerized deployment orchestrated through Kubernetes, enabling horizontal scaling and fault tolerance while maintaining service isolation and inter-service communication via RESTful APIs.",
    transformed:
      "This system is built using small, separate programs called microservices.\n\nKey features:\n• Each service runs in its own container\n• Kubernetes manages all the containers\n• Services can grow bigger when needed\n• If one service breaks, others keep working\n• Services talk to each other using web APIs\n\nThis design makes the system reliable and easy to manage.",
  },
  medical: {
    original:
      "Hypertension, commonly referred to as high blood pressure, is a chronic medical condition characterized by persistently elevated arterial blood pressure, typically defined as systolic pressure exceeding 140 mmHg or diastolic pressure exceeding 90 mmHg.",
    transformed:
      "High blood pressure (also called hypertension) happens when blood pushes too hard against artery walls.\n\nWhat the numbers mean:\n• Top number (systolic): Should be under 140\n• Bottom number (diastolic): Should be under 90\n• Higher numbers mean high blood pressure\n\nThis is a long-term condition that needs treatment.",
  },
  financial: {
    original:
      "The diversified portfolio allocation strategy employs a systematic approach to risk management through asset class diversification, incorporating equities, fixed-income securities, and alternative investments to optimize risk-adjusted returns while maintaining liquidity requirements.",
    transformed:
      "A diversified portfolio means spreading your money across different types of investments.\n\nTypes of investments:\n• Stocks (equities)\n• Bonds (fixed-income)\n• Alternative investments\n\nWhy diversify:\n• Reduces risk\n• Helps balance returns\n• Keeps some money easy to access\n\nThis strategy helps protect your money while still growing it.",
  },
};

export async function POST(request: NextRequest) {
  try {
    // Simulate API processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const body = await request.json();
    console.log("Received TransformContent request:", body); // Debug log

    const { userId, textContent, profile } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    if (!textContent || textContent.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Missing text content" },
        { status: 400 }
      );
    }

    console.log("Processing transformation for user:", userId); // Debug log

    // Determine content type based on keywords
    let contentType = "academic"; // default
    const text = textContent.toLowerCase();

    if (
      text.includes("contract") ||
      text.includes("legal") ||
      text.includes("agreement") ||
      text.includes("party")
    ) {
      contentType = "legal";
    } else if (
      text.includes("system") ||
      text.includes("architecture") ||
      text.includes("api") ||
      text.includes("server")
    ) {
      contentType = "technical";
    } else if (
      text.includes("blood") ||
      text.includes("medical") ||
      text.includes("pressure") ||
      text.includes("health")
    ) {
      contentType = "medical";
    } else if (
      text.includes("investment") ||
      text.includes("portfolio") ||
      text.includes("financial") ||
      text.includes("money")
    ) {
      contentType = "financial";
    }

    // Get the appropriate transformation
    const transformation =
      sampleTransformations[contentType as keyof typeof sampleTransformations];

    // Customize based on profile preferences (now using camelCase)
    let transformedText = transformation.transformed;

    if (profile?.preferredStructure === "bullet_points_for_lists") {
      // Keep bullet points as is
      transformedText = transformedText;
    } else if (profile?.preferredStructure === "numbered_lists") {
      // Convert bullet points to numbered lists
      const lines = transformedText.split("\n");
      let counter = 1;
      transformedText = lines
        .map((line) => {
          if (line.trim().startsWith("•")) {
            return line.replace("•", `${counter++}.`);
          }
          return line;
        })
        .join("\n");
    } else if (profile?.preferredStructure === "paragraphs") {
      // Convert bullet points to paragraph format
      transformedText = transformedText
        .replace(/\n• /g, ". ")
        .replace(/\n•/g, ". ");
    }

    if (profile?.readingPreference === "short_sentences") {
      // Make sentences even shorter by adding more breaks
      transformedText = transformedText.replace(/\. /g, ".\n\n");
    }

    if (profile?.attentionSpan === "short_bursts") {
      // Add more paragraph breaks for shorter sections
      transformedText = transformedText.replace(/\n\n/g, "\n\n---\n\n");
    }

    console.log("Transformation completed for user:", userId); // Debug log

    return NextResponse.json({
      success: true,
      userId,
      transformedText,
      originalText: textContent,
      contentType,
      processingTime: "2.1s",
    });
  } catch (error) {
    console.error("Transform API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to transform text" },
      { status: 500 }
    );
  }
}
