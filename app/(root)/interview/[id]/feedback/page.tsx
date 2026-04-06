"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";
import { db } from "@/firebase/client";
import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    addDoc,
} from "firebase/firestore";

interface CategoryScore {
    name: string;
    score: number;
    comment: string;
}

interface FeedbackData {
    id?: string;
    interviewId: string;
    role: string;
    questions: string[];
    answers: string[];
    score: number;
    summary: string;
    categoryScores: CategoryScore[];
    strengths: string[];
    improvements: string[];
    createdAt: Date | string;
}

const FeedbackPage = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [feedback, setFeedback] = useState<FeedbackData | null>(null);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        loadFeedback();
    }, [id]);

    const loadFeedback = async () => {
        try {
            setLoading(true);

            // ─── Step 1: Fetch interview doc ───────────────────────────────
            const interviewRef = doc(db, "interviews", id);
            const interviewSnap = await getDoc(interviewRef);

            if (!interviewSnap.exists()) {
                setError("Interview not found.");
                setLoading(false);
                return;
            }

            const interviewData = interviewSnap.data();
            setRole(interviewData.role || "");

            // ─── Step 2: Check if feedback already exists ──────────────────
            const feedbackQuery = query(
                collection(db, "feedback"),
                where("interviewId", "==", id)
            );
            const feedbackSnap = await getDocs(feedbackQuery);

            if (!feedbackSnap.empty) {
                // ✅ Feedback exists → just display it, no API call
                const existingDoc = feedbackSnap.docs[0];
                setFeedback({
                    id: existingDoc.id,
                    ...(existingDoc.data() as Omit<FeedbackData, "id">),
                });
                setLoading(false);
                return;
            }

            // ─── Step 3: No feedback yet → generate via Gemini API ─────────
            const res = await fetch("/api/generate-feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    questions: interviewData.questions || [],
                    answers: interviewData.answers || [],
                    role: interviewData.role || "",
                }),
            });

            const generated = await res.json();

            // ─── Step 4: Build feedback doc ────────────────────────────────
            const newFeedback: FeedbackData = {
                interviewId: id,
                role: interviewData.role || "",
                questions: interviewData.questions || [],
                answers: interviewData.answers || [],
                score: generated.score ?? 50,
                summary: generated.summary ?? "Could not generate feedback.",
                categoryScores: generated.categoryScores ?? [],
                strengths: generated.strengths ?? ["Keep practicing"],
                improvements: generated.improvements ?? ["Try again"],
                createdAt: new Date().toISOString(),
            };

            // ─── Step 5: Save to Firestore feedback collection ─────────────
            const docRef = await addDoc(collection(db, "feedback"), newFeedback);
            setFeedback({ id: docRef.id, ...newFeedback });

        } catch (err) {
            console.error("❌ Feedback load error:", err);
            setError("Something went wrong loading feedback.");
        } finally {
            setLoading(false);
        }
    };

    // ── LOADING STATE ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Generating your feedback...</p>
                </div>
            </div>
        );
    }

    // ── ERROR STATE ────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-lg">{error}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-4 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // ── MAIN UI ────────────────────────────────────────────────────────────
    return (
        <section className="section-feedback">

            {/* TITLE */}
            <div className="flex flex-row justify-center">
                <h1 className="text-4xl font-semibold">
                    Feedback on the Interview -{" "}
                    <span className="capitalize">{role}</span> Interview
                </h1>
            </div>

            {/* SCORE + DATE ROW */}
            <div className="flex flex-row justify-center">
                <div className="flex flex-row gap-5">

                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/star.svg" width={22} height={22} alt="star" />
                        <p>
                            Overall Impression:{" "}
                            <span className="text-primary-200 font-bold">
                                {feedback?.score}
                            </span>
                            /100
                        </p>
                    </div>

                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
                        <p>
                            {feedback?.createdAt
                                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                                : "N/A"}
                        </p>
                    </div>

                </div>
            </div>

            <hr />

            {/* SUMMARY */}
            <p>{feedback?.summary}</p>

            {/* ── BREAKDOWN OF THE INTERVIEW ── */}
            <div className="flex flex-col gap-4">
                <h2>Breakdown of the Interview:</h2>
                {feedback?.categoryScores?.map((category, index) => (
                    <div key={index}>
                        <p className="font-bold">
                            {index + 1}. {category.name} ({category.score}/100)
                        </p>
                        <p>{category.comment}</p>
                    </div>
                ))}
            </div>

            {/* STRENGTHS */}
            <div className="flex flex-col gap-3">
                <h3>Strengths</h3>
                <ul>
                    {feedback?.strengths?.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* IMPROVEMENTS */}
            <div className="flex flex-col gap-3">
                <h3>Areas for Improvement</h3>
                <ul>
                    {feedback?.improvements?.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* BUTTONS */}
            <div className="buttons">
                <a href="/" className="btn-secondary flex-1 flex justify-center items-center">
                    <p className="text-sm font-semibold text-primary-200 text-center">
                        Back to dashboard
                    </p>
                </a>
                <a
                    href={`/interview/${id}`}
                    className="btn-primary flex-1 flex justify-center items-center"
                >
                    <p className="text-sm font-semibold text-black text-center">
                        Retake Interview
                    </p>
                </a>
            </div>

        </section>
    );
};

export default FeedbackPage;