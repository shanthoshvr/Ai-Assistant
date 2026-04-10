import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getGeminiResponse = async (prompt: string, history: { role: string; parts: { text: string }[] }[]) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      history: history,
      config: {
        systemInstruction: "You are Nila, a professional and helpful AI assistant. You provide clear, concise, and accurate information. You can help with coding, general knowledge, and system tasks.",
      },
    });

    const result = await chat.sendMessage({ message: prompt });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I encountered an error while processing your request. Please check my connection.";
  }
};
