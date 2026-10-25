import { Router, Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "GEMINI_API_KEY is missing from environment variables." });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 500 }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to call Gemini API");
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return res.status(500).json({ message: "AI generation failed", error: error.message });
  }
});

export const aiRouter = router;