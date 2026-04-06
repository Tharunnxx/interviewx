import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // ✅ ADD THIS LINE HERE
        console.log("API KEY:", process.env.GOOGLE_GENERATIVE_AI_API_KEY);

        const { role, level, techstack, questionCount } = await req.json();

        const genAI = new GoogleGenerativeAI(
            process.env.GOOGLE_GENERATIVE_AI_API_KEY!
        );

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `
You are an expert technical interviewer.

Generate ${questionCount} HIGH QUALITY interview questions.

Role: ${role}
Level: ${level}
Tech Stack: ${techstack}

Rules:
- Questions must be realistic and industry-level
- Mix conceptual + practical + scenario-based
- Do NOT include explanations
- Return ONLY a JSON array

Example:
["Question 1", "Question 2"]
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        console.log("🔥 RAW TEXT:", text);

        // 🔥 Clean response
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

        // ✅ Validate output
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