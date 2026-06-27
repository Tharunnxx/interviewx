"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import InterviewCard from "@/components/InterviewCard";
import {
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db, auth } from "@/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

const Page = () => {
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.log("No user logged in");
                setInterviews([]);
                setLoading(false);
                return;
            }

            try {
                const q = query(
                    collection(db, "interviews"),
                    where("userId", "==", user.uid)
                );

                const querySnapshot = await getDocs(q);

                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log("🔥 User Interviews:", data);
                setInterviews(data);
            } catch (error) {
                console.error("Error fetching interviews:", error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            {/* HERO */}
            <section className="card-cta">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
                    <p className="text-lg">
                        Practice on real interview questions & get instant feedback
                    </p>

                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="/create-interview">Create an Interview</Link>
                    </Button>
                </div>

                <Image
                    src="/robot.png"
                    alt="robo-dude"
                    width={400}
                    height={400}
                    className="max-sm:hidden"
                />
            </section>

            {/* YOUR INTERVIEWS */}
            <section className="flex flex-col gap-6 mt-8">
                <h2>Your Interviews</h2>

                <div className="interviews-section">
                    {loading ? (
                        <p>Loading interviews...</p>
                    ) : interviews.length > 0 ? (
                        interviews.map((interview) => (
                            <InterviewCard {...interview} key={interview.id} />
                        ))
                    ) : (
                        <p>No interviews created yet</p>
                    )}
                </div>
            </section>

            {/* PREBUILT */}
            <section className="flex flex-col gap-6 mt-8">
                <h2>Take an Interview</h2>

                <div className="interviews-section">
                    <p>Coming soon...</p>
                </div>
            </section>
        </>
    );
};

export default Page;