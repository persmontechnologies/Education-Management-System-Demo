
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY ?? "");

export const generateText = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is not configured. Please set the API_KEY environment variable.";
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are an expert administrative assistant for a school. Provide concise, helpful, and professionally toned responses suitable for an educational environment."
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred while contacting the AI assistant: ${error.message}`;
    }
    return "An unknown error occurred while contacting the AI assistant.";
  }
};
