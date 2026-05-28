import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Ensure dot env config is read if present
import "dotenv/config";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini service
let aiInstance: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it to Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// API endpoint for general health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// AI Mentor API
app.post("/api/mentor", async (req, res) => {
  try {
    const { message, code, language, challengeTitle, chatHistory } = req.body;
    const ai = getAI();

    // Prepare content with history of the chat
    const systemInstruction = `You are "Sparky", the friendly and highly encouraging AI Coding Mentor on CodeSpark, an interactive tech education platform.
Your main goals are:
1. Help users learn coding in the easiest, most engaging, and most interactive way possible.
2. Provide hints and guide steps rather than just dumping completed answers. Ask thought-provoking questions, use emojis appropriately, and cheer on the student.
3. Be supportive, patient, and use clear developer formatting with markdown code blocks.
4. Keep explanations short, bite-sized, and modern. Under 150 words per response unless writing complex explanations.
5. If code is provided (Language: ${language || 'General'}, Challenge: ${challengeTitle || 'None'}), review it and give constructive hints on why it may fail or how to optimize it.`;

    const chatInput = [
      ...(chatHistory || []).map((h: { sender: string; text: string }) => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      }))
    ];

    // Construct the latest user prompt with context
    let promptText = "";
    if (code) {
      promptText += `[CURRENT WORKSPACE CODE (${language || 'unknown'}):\n\`\`\`${language || ''}\n${code}\n\`\`\`]\n\n`;
    }
    if (challengeTitle) {
      promptText += `[LESSON CONTEXT: "${challengeTitle}"]\n\n`;
    }
    promptText += `${message}`;

    chatInput.push({
      role: "user",
      parts: [{ text: promptText }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatInput,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I was unable to process that. Try rephrasing your question!";
    res.json({ reply });
  } catch (error: any) {
    console.error("AI Mentor service error:", error);
    res.status(500).json({
      error: error.message || "Failed to communicate with AI Mentor.",
      isConfigError: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY"
    });
  }
});

// Endpoint for quick code reviews & suggestions
app.post("/api/review-code", async (req, res) => {
  try {
    const { code, language, challenge } = req.body;
    const ai = getAI();

    const prompt = `Review the following ${language || 'programming'} code for the challenge: "${challenge || 'General Coding'}"
Code:
\`\`\`${language}\n${code}\`\`\`

Please provide:
1. Clear pass/fail assessment based on logical sanity.
2. A list of 2-3 specific recommendations or performance/stylistic improvements.
3. Explain simply what this code does in 1-2 sentences.

Respond in JSON format with the following keys:
- passed: boolean
- explanation: string (short, human friendly summary)
- suggestions: string[] (array of recommendations)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT" as any,
          properties: {
            passed: { type: "BOOLEAN" as any },
            explanation: { type: "STRING" as any },
            suggestions: {
              type: "ARRAY" as any,
              items: { type: "STRING" as any }
            }
          },
          required: ["passed", "explanation", "suggestions"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Code review service error:", error);
    res.status(500).json({
      error: error.message || "Failed to complete code review.",
      isConfigError: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY"
    });
  }
});

// Vite middleware setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving compiled production build from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CodeSpark server listening on http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Vite setup error:", err);
});
