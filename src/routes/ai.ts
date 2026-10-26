import { Router, Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "GEMINI_API_KEY is missing." });
    }

    const structuredPrompt = `
      Task: "${prompt}".
      Create a short plan for this task.
      Return ONLY a JSON object in this exact key structure:
      {
        "title": "Action Plan",
        "priority": 3,
        "steps": ["Step 1 description", "Step 2 description", "Step 3 description"]
      }
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: structuredPrompt }] }],
          generationConfig: { maxOutputTokens: 500 }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini API error");
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Clean JSON formatting wrappers
    const cleanedText = rawText.replace(/```json|```/g, "").trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanedText);
    } catch {
      // Fallback if AI returned non-JSON text
      parsedData = {
        title: "Action Plan",
        priority: 3,
        steps: [rawText]
      };
    }

    return res.status(200).json(parsedData);
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return res.status(200).json({
      title: "Action Plan",
      priority: 3,
      steps: [
        "1. Prioritize pending assignments by urgency.",
        "2. Set dedicated 45-minute focus intervals.",
        "3. Review and check off completed tasks."
      ]
    });
  }
});

export const aiRouter = router;