import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        const response = await fetch(
            "https://api.deepgram.com/v1/speak?model=aura-asteria-en",
            {
                method: "POST",
                headers: {
                    Authorization: `Token ${process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            }
        );

        const buffer = await response.arrayBuffer();

        return new Response(buffer, {
            headers: {
                "Content-Type": "audio/mpeg",
            },
        });
    } catch (error) {
        console.error("Deepgram TTS error:", error);
        return NextResponse.json({ error: "TTS failed" }, { status: 500 });
    }
}