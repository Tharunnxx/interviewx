import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { questions, answers, role } = await req.json();

        const cleanedAnswers = answers.map((a: string) =>
            a
                .toLowerCase()
                .replace(/[^\w\s]/g, "")
                .replace(/\s+/g, " ")
                .trim()
        );

        const prompt = `
You are an AI interviewer analyzing a mock interview.

This is a PRACTICE interview, not a real hiring decision.

IMPORTANT RULES:

- Be supportive and constructive, not harsh
- Focus on helping the candidate improve

SCORING LOGIC:
- If the core concept is correct → score between 70–85
- If partially correct → score between 50–70
- If mostly incorrect → score below 50

EVALUATION GUIDELINES:
- Focus primarily on whether the idea is correct
- Do NOT heavily penalize short answers
- Do NOT assume missing detail means lack of knowledge
- Ignore minor grammar or speech-to-text errors completely
- Only reduce score significantly if the concept is clearly wrong or missing

COMMUNICATION:
- Be encouraging and helpful
- Avoid overly negative tone
- Provide suggestions, not harsh criticism

Role: ${role}

Questions and Answers:
${questions
            .map(
                (q: string, i: number) =>
                    `Q${i + 1}: ${q}\nA${i + 1}: ${
                        cleanedAnswers[i] || "No answer provided"
                    }`
            )
            .join("\n\n")}

Return ONLY valid JSON in this format:
{
  "score": <overall score 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "categoryScores": [
    { "name": "Communication Skills", "score": <0-100>, "comment": "<feedback>" },
    { "name": "Technical Knowledge", "score": <0-100>, "comment": "<feedback>" },
    { "name": "Problem Solving", "score": <0-100>, "comment": "<feedback>" },
    { "name": "Cultural Fit", "score": <0-100>, "comment": "<feedback>" },
    { "name": "Confidence and Clarity", "score": <0-100>, "comment": "<feedback>" }
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
        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!text) throw new Error("Empty AI response");

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

        if (parsed.score < 60) {
            parsed.score = Math.max(parsed.score, 60);
        }

        return NextResponse.json(parsed);
    } catch (err) {
        console.error("❌ Feedback Error:", err);

        return NextResponse.json({
            score: 65,
            summary: "Feedback could not be generated properly, but keep practicing!",
            categoryScores: [
                {
                    name: "Communication Skills",
                    score: 65,
                    comment: "Keep improving clarity and structure.",
                },
                {
                    name: "Technical Knowledge",
                    score: 65,
                    comment: "Basic understanding present, continue learning.",
                },
                {
                    name: "Problem Solving",
                    score: 60,
                    comment: "Needs more practical exposure.",
                },
                {
                    name: "Cultural Fit",
                    score: 60,
                    comment: "No strong signals detected.",
                },
                {
                    name: "Confidence and Clarity",
                    score: 65,
                    comment: "Work on confidence and articulation.",
                },
            ],
            strengths: ["Good effort", "Basic understanding present"],
            improvements: ["Practice more", "Improve explanation depth"],
        });
    }
}