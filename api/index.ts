import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: "Gemini API Key is not configured on the server." });
  }

  const { messages } = req.body;
  if (!messages) {
    return res.status(400).json({ error: "Messages are required." });
  }

  try {
    const contents = messages.map((m: any) => {
      const parts = [];
      if (m.text) parts.push({ text: m.text });
      if (m.image && (m.image.data || m.image.url)) {
        // Note: For now, we prefer data (base64) because it's easier to send to Gemini directly
        // If it's a URL, Gemini might need a different approach (fetching it or using File API)
        // Here we assume m.image.data is provided by the client if it was just uploaded
        if (m.image.data) {
          parts.push({
            inlineData: {
              mimeType: m.image.mimeType,
              data: m.image.data,
            },
          });
        }
      }
      return {
        role: m.role === "user" ? "user" : "model",
        parts,
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: "당신은 스마트 농업 비서 kfarmnet입니다. 농민들에게 친절하고 전문적인 조언을 제공합니다. 답변은 한국어로 작성하며, 실질적인 도움이 되는 구체적인 정보를 제공하세요."
      }
    });

    res.json({ text: response.text?.trim() || "응답이 없습니다." });
  } catch (error: any) {
    console.error("Gemini API Error (Server):", error);
    const errorMsg = error.message || "Unknown error";
    res.status(500).json({ error: errorMsg });
  }
});

export default app;
