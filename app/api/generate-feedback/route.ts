import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { questions, answers, role } = await req.json();

        const prompt = `
You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.

Role: ${role}

Questions and Answers:
${questions.map((q: string, i: number) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || "No answer provided"}`).join("\n\n")}

Please respond ONLY with a valid JSON object in this exact format (no markdown, no code blocks, no extra text):
{
  "score": <overall score 0-100>,
  "summary": "<2-3 sentence overall assessment paragraph>",
  "categoryScores": [
    { "name": "Communication Skills", "score": <0-100>, "comment": "<specific feedback>" },
    { "name": "Technical Knowledge", "score": <0-100>, "comment": "<specific feedback>" },
    { "name": "Problem Solving", "score": <0-100>, "comment": "<specific feedback>" },
    { "name": "Cultural Fit", "score": <0-100>, "comment": "<specific feedback>" },
    { "name": "Confidence and Clarity", "score": <0-100>, "comment": "<specific feedback>" }
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"]
}
`;

        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!text) throw new Error("Empty AI response");

        // 🔥 CLEAN RESPONSE — strip markdown code fences if present
        const cleaned = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch {
            throw new Error("JSON parse failed");
        }

        return NextResponse.json(parsed);

    } catch (err) {
        console.error("❌ Feedback Error:", err);

        return NextResponse.json({
            score: 50,
            summary: "Could not generate feedback. Please try again.",
            categoryScores: [
                { name: "Communication Skills", score: 50, comment: "Unable to evaluate." },
                { name: "Technical Knowledge", score: 50, comment: "Unable to evaluate." },
                { name: "Problem Solving", score: 50, comment: "Unable to evaluate." },
                { name: "Cultural Fit", score: 50, comment: "Unable to evaluate." },
                { name: "Confidence and Clarity", score: 50, comment: "Unable to evaluate." },
            ],
            strengths: ["Keep practicing"],
            improvements: ["Try again"],
        });
    }
}