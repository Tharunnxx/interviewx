"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { db } from "@/firebase/client";
import {
    doc,
    getDoc,
    updateDoc,
    addDoc,
    collection,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

enum CallStatus {
    INACTIVE = "INACTIVE",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

const Agent = ({
                   userName,
                   mode,
                   interviewId,
               }: {
    userName: string;
    mode: "create" | "interview";
    interviewId?: string;
}) => {
    const [currentText, setCurrentText] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
    const [showFeedback, setShowFeedback] = useState(false);
    const [step, setStep] = useState(0);
    const [totalSteps, setTotalSteps] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    const router = useRouter();

    const isActiveRef = useRef(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        return () => {
            isActiveRef.current = false;
            if (audioRef.current) audioRef.current.pause();
        };
    }, []);

    // 🔊 SPEAK
    const speak = async (text: string) => {
        if (!isActiveRef.current) return;

        return new Promise<void>(async (resolve) => {
            try {
                setIsSpeaking(true);
                setCurrentText(`AI: ${text}`);

                const res = await fetch("/api/tts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text }),
                });

                const blob = await res.blob();
                const audio = new Audio(URL.createObjectURL(blob));
                audioRef.current = audio;

                audio.onended = () => {
                    setIsSpeaking(false);
                    resolve();
                };

                audio.onerror = () => {
                    setIsSpeaking(false);
                    resolve();
                };

                await audio.play();
            } catch {
                setIsSpeaking(false);
                resolve();
            }
        });
    };

    // 🎤 LISTEN (dynamic timer)
    const listen = async (durationSec: number): Promise<string> => {
        if (!isActiveRef.current) return "";

        return new Promise(async (resolve) => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: Blob[] = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.start();

            let time = durationSec;
            setTimeLeft(time);
            setCurrentText("🎤 Listening...");

            const interval = setInterval(() => {
                time--;
                setTimeLeft(time);
                if (time <= 0) clearInterval(interval);
            }, 1000);

            setTimeout(() => recorder.stop(), durationSec * 1000);

            recorder.onstop = async () => {
                clearInterval(interval);

                const blob = new Blob(chunks, { type: "audio/webm" });
                const formData = new FormData();
                formData.append("audio", blob);

                const res = await fetch("/api/transcribe", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                const answer = data.text || "Could not understand";

                setCurrentText(`You: ${answer}`);
                resolve(answer);
            };
        });
    };

    // 🔥 FETCH QUESTIONS
    const fetchQuestions = async () => {
        if (!interviewId) return [];
        const snap = await getDoc(doc(db, "interviews", interviewId));
        return snap.exists() ? snap.data().questions || [] : [];
    };

    // 🟢 CREATE FLOW
    const startCreateFlow = async () => {
        try {
            isActiveRef.current = true;
            setCallStatus(CallStatus.ACTIVE);

            const setupQuestions = [
                "What role are you preparing for?",
                "What level are you targeting?",
                "What tech stack do you want?",
                "How many questions do you want?",
            ];

            setTotalSteps(setupQuestions.length);
            const answers: string[] = [];

            await speak(`Hi ${userName}, let's create your interview.`);

            for (let i = 0; i < setupQuestions.length; i++) {
                if (!isActiveRef.current) break;

                setStep(i + 1);
                await speak(setupQuestions[i]);

                // ✅ 10 sec for create
                const ans = await listen(10);
                answers.push(ans);
            }

            const [role, level, techstackRaw, count] = answers;
            const questionCount = Number(count) || 5;

            // 🔥 API CALL
            const res = await fetch("/api/generate-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role,
                    level,
                    techstack: techstackRaw,
                    questionCount,
                }),
            });

            const data = await res.json();

            console.log("🔥 API RESPONSE:", data);

            // ❌ STRICT CHECK (NO FAKE QUESTIONS)
            if (!Array.isArray(data.questions) || data.questions.length === 0) {
                await speak("Failed to generate questions. Please try again.");
                setCallStatus(CallStatus.FINISHED);
                return;
            }

            // ✅ SAVE TO FIREBASE
            await addDoc(collection(db, "interviews"), {
                role,
                level,
                techstack: techstackRaw.split(",").map((t) => t.trim()),
                questionCount,
                questions: data.questions,
                answers: [],
                createdAt: new Date(),
            });

            await speak("Interview created successfully!");
            setCallStatus(CallStatus.FINISHED);

        } catch (error) {
            console.error("❌ Create Error:", error);
            await speak("Something went wrong. Please try again.");
            setCallStatus(CallStatus.FINISHED);
        }
    };

    // 🔵 INTERVIEW FLOW
    const startInterview = async () => {
        isActiveRef.current = true;
        setCallStatus(CallStatus.ACTIVE);

        const questions = await fetchQuestions();

        if (!questions.length) {
            await speak("No questions found.");
            setCallStatus(CallStatus.FINISHED);
            return;
        }

        setTotalSteps(questions.length);
        const answers: string[] = [];

        for (let i = 0; i < questions.length; i++) {
            if (!isActiveRef.current) break;

            setStep(i + 1);
            await speak(questions[i]);

            // ✅ 15 sec for interview
            const ans = await listen(15);
            answers.push(ans);
        }

        if (interviewId) {
            await updateDoc(doc(db, "interviews", interviewId), {
                answers,
            });
        }

        await speak("Interview completed.");
        setShowFeedback(true);
        setCallStatus(CallStatus.FINISHED);
    };

    const handleEnd = () => {
        isActiveRef.current = false;
        if (audioRef.current) audioRef.current.pause();
        setCallStatus(CallStatus.FINISHED);
    };

    return (
        <>
            {/* UI */}
            <div className="call-view">
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image src="/ai-avatar.png" alt="ai" width={65} height={54} />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>

                <div className="card-border">
                    <div className="card-content">
                        <Image
                            src="/user-avatar.png"
                            alt="user"
                            width={120}
                            height={120}
                            className="rounded-full"
                        />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>

            {/* TEXT BAR */}
            {currentText && (
                <div className="mt-6 px-6">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center shadow-lg">
                        <p className="text-lg font-semibold animate-fadeIn">
                            {currentText}
                        </p>

                        {callStatus === CallStatus.ACTIVE && (
                            <div className="mt-2 text-sm opacity-70">
                                {step}/{totalSteps} • ⏳ {timeLeft}s
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* BUTTONS */}
            <div className="w-full flex justify-center mt-6 gap-3">
                {callStatus === CallStatus.INACTIVE ? (
                    <button
                        className="btn-call"
                        onClick={() =>
                            mode === "create" ? startCreateFlow() : startInterview()
                        }
                    >
                        {mode === "create" ? "Create Interview" : "Start Interview"}
                    </button>
                ) : callStatus === CallStatus.ACTIVE ? (
                    <button className="btn-disconnect" onClick={handleEnd}>
                        End
                    </button>
                ) : showFeedback ? (
                    <button
                        className="btn-primary"
                        onClick={() =>
                            router.push(`/interview/${interviewId}/feedback`)
                        }
                    >
                        View Feedback
                    </button>
                ) : (
                    <button
                        className="btn-secondary"
                        onClick={() => router.push("/")}
                    >
                        Back to Dashboard
                    </button>
                )}
            </div>
        </>
    );
};

export default Agent;