import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { role, level, techstack, questionCount } = await req.json();

        const genAI = new GoogleGenerativeAI(
            process.env.GOOGLE_GENERATIVE_AI_API_KEY!
        );

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `
You are an expert technical interviewer.

Generate EXACTLY ${questionCount} interview questions.

Role: ${role}
Level: ${level}
Tech Stack: ${techstack}

STRICT RULES:

1. Difficulty Control:
- If level is "Beginner":
  - ONLY basic and easy questions
  - Focus on fundamentals, definitions, simple queries
  - NO advanced SQL joins, NO complex ML, NO system design

- If level is "Intermediate":
  - Moderate difficulty
  - Some real-world scenarios
  - Medium complexity logic

- If level is "Advanced":
  - Challenging questions
  - Complex SQL, ML concepts, system design, optimization

2. Question Rules:
- Keep questions short and clear
- Mix conceptual + practical
- NO explanations
- NO answers
- NO extra text

3. Output Format:
- Return ONLY a JSON array
- Must contain EXACTLY ${questionCount} questions

Example:
["Question 1", "Question 2"]
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Clean response
        const cleaned = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const start = cleaned.indexOf("[");
        const end = cleaned.lastIndexOf("]");

        if (start === -1 || end === -1) {
            console.error("❌ No JSON found:", cleaned);
            return NextResponse.json({ questions: [] });
        }

        const jsonString = cleaned.substring(start, end + 1);

        let questions: string[] = [];

        try {
            questions = JSON.parse(jsonString);
        } catch (err) {
            console.error("❌ JSON Parse Error:", jsonString);
            return NextResponse.json({ questions: [] });
        }

        // Validate output
        if (!Array.isArray(questions) || questions.length === 0) {
            console.error("❌ Invalid questions:", questions);
            return NextResponse.json({ questions: [] });
        }

        return NextResponse.json({ questions });

    } catch (err) {
        console.error("❌ GENERATION ERROR:", err);
        return NextResponse.json({ questions: [] }, { status: 500 });
    }
}