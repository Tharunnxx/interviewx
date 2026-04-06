"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import InterviewCard from "@/components/InterviewCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/client";

const Page = () => {
    const [interviews, setInterviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "interviews"));

                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log("🔥 Firebase Interviews:", data);
                setInterviews(data);
            } catch (error) {
                console.error("Error fetching interviews:", error);
            }
        };

        fetchInterviews();
    }, []);

    return (
        <>
            {/* ── HERO CTA ── */}
            <section className="card-cta">
                <div className="flex flex-col gap-5 max-w-lg" style={{ position: "relative", zIndex: 1 }}>

                    {/* eyebrow badge */}
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px",
                            background: "rgba(168,157,252,0.12)",
                            border: "1px solid rgba(168,157,252,0.25)",
                            borderRadius: "20px",
                            padding: "5px 14px",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            color: "#a89dfc",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            width: "fit-content",
                        }}
                    >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c98c", display: "inline-block" }} />
                        AI-Powered · Voice-Based
                    </div>

                    <h1
                        style={{
                            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                            fontWeight: 700,
                            lineHeight: 1.12,
                            letterSpacing: "-0.03em",
                            color: "#f0f0fa",
                        }}
                    >
                        Get Interview-Ready with{" "}
                        <span style={{ color: "#a89dfc" }}>AI-Powered</span>{" "}
                        Practice & Feedback
                    </h1>

                    <p style={{ color: "#a0a0c0", fontSize: "0.9375rem", lineHeight: 1.7, maxWidth: 380 }}>
                        Practice on real interview questions and get instant, detailed feedback to sharpen your skills.
                    </p>

                    <div className="flex flex-row gap-3 max-sm:flex-col" style={{ marginTop: "4px" }}>
                        <Button asChild className="btn-primary max-sm:w-full">
                            <Link href="/create-interview">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
                                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                                </svg>
                                Create an Interview
                            </Link>
                        </Button>
                    </div>

                    {/* social proof strip */}
                    <div
                        className="flex flex-row items-center gap-3 max-sm:hidden"
                        style={{ marginTop: "8px" }}
                    >
                        <div className="flex flex-row" style={{ gap: "-4px" }}>
                            {["#a89dfc", "#22c98c", "#f5a623", "#ff5c5c"].map((color, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: 28, height: 28, borderRadius: "50%",
                                        background: color + "33",
                                        border: `2px solid ${color}55`,
                                        marginLeft: i === 0 ? 0 : -8,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "10px", color, fontWeight: 600,
                                    }}
                                >
                                    {["AK","SR","MP","RV"][i]}
                                </div>
                            ))}
                        </div>
                        <span style={{ fontSize: "0.8125rem", color: "#6870a6" }}>
                            <strong style={{ color: "#a0a0c0", fontWeight: 600 }}>4,200+</strong> engineers prepared
                        </span>
                    </div>
                </div>

                <Image
                    src="/robot.png"
                    alt="AI Interview Assistant"
                    width={340}
                    height={340}
                    className="max-sm:hidden"
                    style={{ position: "relative", zIndex: 1, filter: "drop-shadow(0 0 40px rgba(108,99,255,0.25))" }}
                />
            </section>

            {/* ── YOUR INTERVIEWS ── */}
            <section className="flex flex-col gap-5 mt-2">
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <h2>Your Interviews</h2>
                        {interviews.length > 0 && (
                            <p style={{ fontSize: "0.875rem", color: "#6870a6", marginTop: "2px" }}>
                                {interviews.length} session{interviews.length !== 1 ? "s" : ""} created
                            </p>
                        )}
                    </div>

                    <Button asChild className="btn-secondary">
                        <Link href="/create-interview">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
                                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                            New
                        </Link>
                    </Button>
                </div>

                <div className="interviews-section">
                    {interviews.length > 0 ? (
                        interviews.map((interview) => (
                            <InterviewCard {...interview} key={interview.id} />
                        ))
                    ) : (
                        /* Empty state */
                        <div
                            style={{
                                gridColumn: "1 / -1",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "16px",
                                padding: "64px 24px",
                                borderRadius: "20px",
                                border: "1px dashed rgba(168,157,252,0.2)",
                                background: "rgba(168,157,252,0.03)",
                            }}
                        >
                            <div
                                style={{
                                    width: 56, height: 56, borderRadius: 16,
                                    background: "rgba(168,157,252,0.1)",
                                    border: "1px solid rgba(168,157,252,0.2)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="#a89dfc" strokeWidth="1.5" fill="none"/>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="#a89dfc" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <p style={{ color: "#a0a0c0", fontWeight: 500, fontSize: "0.9375rem" }}>No interviews yet</p>
                                <p style={{ color: "#6870a6", fontSize: "0.8125rem", marginTop: 4 }}>Create your first AI interview to get started</p>
                            </div>
                            <Button asChild className="btn-primary" style={{ marginTop: 4 }}>
                                <Link href="/create-interview">Create Interview</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* ── TAKE AN INTERVIEW (coming soon) ── */}
            <section className="flex flex-col gap-5 mt-2">
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <h2>Take an Interview</h2>
                        <p style={{ fontSize: "0.875rem", color: "#6870a6", marginTop: "2px" }}>
                            Curated practice sessions
                        </p>
                    </div>
                    <span
                        style={{
                            fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.05em",
                            textTransform: "uppercase", color: "#f5a623",
                            background: "rgba(245,166,35,0.1)",
                            border: "1px solid rgba(245,166,35,0.2)",
                            borderRadius: "20px", padding: "4px 12px",
                        }}
                    >
                        Coming soon
                    </span>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "48px 24px",
                        borderRadius: "20px",
                        border: "1px dashed rgba(255,255,255,0.07)",
                        background: "rgba(255,255,255,0.02)",
                    }}
                >
                    <p style={{ color: "#6870a6", fontSize: "0.875rem" }}>
                        Curated interview packs will appear here
                    </p>
                </div>
            </section>
        </>
    );
};

export default Page;