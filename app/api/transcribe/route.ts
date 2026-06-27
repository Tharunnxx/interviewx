import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const audio = formData.get("audio") as Blob;

        if (!audio) {
            return NextResponse.json({ text: "" });
        }

        const buffer = Buffer.from(await audio.arrayBuffer());

        const response = await fetch(
            "https://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&smart_format=true&language=en-IN",
            {
                method: "POST",
                headers: {
                    Authorization: `Token ${process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY}`,
                    "Content-Type": "audio/webm",
                },
                body: buffer,
            }
        );

        const data = await response.json();

        let text =
            data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

        text = text
            // JS frameworks
            .replace(/dot j s/gi, "Next.js")
            .replace(/next j s/gi, "Next.js")
            .replace(/next js/gi, "Next.js")
            .replace(/node j s/gi, "Node.js")
            .replace(/node js/gi, "Node.js")

            // roles
            .replace(/back end/gi, "backend")
            .replace(/front end/gi, "frontend")
            .replace(/full stack/gi, "full-stack")

            // languages
            .replace(/type script/gi, "TypeScript")
            .replace(/java script/gi, "JavaScript")

            // databases
            .replace(/mongo db/gi, "MongoDB")
            .replace(/post gres/gi, "Postgres")
            .replace(/my sequel/gi, "MySQL")

            // APIs
            .replace(/rest api/gi, "REST API")

            // cleanup
            .replace(/\s+/g, " ")
            .trim();

        console.log("FINAL TRANSCRIPT:", text);

        return NextResponse.json({ text });
    } catch (error) {
        console.error("Deepgram error:", error);
        return NextResponse.json({ text: "" });
    }
}