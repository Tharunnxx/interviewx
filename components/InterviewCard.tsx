import dayjs from "dayjs";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DisplayTechIcons from "@/components/DisplayTechIcons";

type InterviewCardProps = {
    id: string;
    role: string;
    type?: string;
    techstack: string[] | string;
    createdAt?: any;
};

const InterviewCard = ({
                           id,
                           role,
                           type = "Technical",
                           techstack,
                           createdAt,
                       }: InterviewCardProps) => {
    const feedback = null;

    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

    const formattedDate = dayjs(
        createdAt?.toDate?.() || createdAt || Date.now()
    ).format("MMM D, YYYY");

    /* badge color per type */
    const badgeStyles: Record<string, { bg: string; color: string; border: string }> = {
        Technical:   { bg: "rgba(168,157,252,0.12)", color: "#a89dfc", border: "rgba(168,157,252,0.25)" },
        Behavioural: { bg: "rgba(34,201,140,0.1)",   color: "#22c98c", border: "rgba(34,201,140,0.25)" },
        Mixed:       { bg: "rgba(245,166,35,0.1)",   color: "#f5a623", border: "rgba(245,166,35,0.25)" },
    }
    const badge = badgeStyles[normalizedType] ?? badgeStyles.Technical;

    return (
        /* outer gradient border shell */
        <div
            style={{
                padding: "1px",
                borderRadius: "20px",
                background: "linear-gradient(155deg, rgba(168,157,252,0.3) 0%, rgba(168,157,252,0.05) 50%, rgba(255,255,255,0.04) 100%)",
                width: "100%",
                minHeight: "380px",
            }}
        >
            <div className="card-interview" style={{ minHeight: "378px", borderRadius: "19px" }}>

                {/* ── type badge ── */}
                <div
                    style={{
                        position: "absolute", top: 0, right: 0,
                        padding: "5px 14px",
                        borderRadius: "0 18px 0 12px",
                        background: badge.bg,
                        border: `1px solid ${badge.border}`,
                        borderTop: "none", borderRight: "none",
                    }}
                >
                    <span
                        className="badge-text"
                        style={{ color: badge.color, fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
                    >
                        {normalizedType}
                    </span>
                </div>

                {/* ── card body ── */}
                <div>
                    {/* cover image */}
                    <div
                        style={{
                            width: 72, height: 72, borderRadius: "16px",
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "rgba(168,157,252,0.08)",
                        }}
                    >
                        <Image
                            src={getRandomInterviewCover()}
                            alt="Interview cover"
                            width={72}
                            height={72}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>

                    {/* role */}
                    <h3
                        className="mt-4 capitalize"
                        style={{
                            fontSize: "1.1rem", fontWeight: 600,
                            letterSpacing: "-0.02em", color: "#f0f0fa",
                            lineHeight: 1.3,
                        }}
                    >
                        {role || "Interview"}
                    </h3>

                    {/* meta row */}
                    <div className="flex flex-row gap-4 mt-3">
                        <div
                            className="flex flex-row gap-1.5 items-center"
                            style={{ fontSize: "0.8125rem", color: "#6870a6" }}
                        >
                            <Image src="/calendar.svg" alt="date" width={14} height={14} style={{ opacity: 0.7 }} />
                            <span>{formattedDate}</span>
                        </div>

                        <div
                            className="flex flex-row gap-1.5 items-center"
                            style={{ fontSize: "0.8125rem", color: "#6870a6" }}
                        >
                            <Image src="/star.svg" alt="score" width={14} height={14} style={{ opacity: 0.7 }} />
                            <span>
                                {feedback?.totalScore
                                    ? <span style={{ color: "#22c98c", fontWeight: 600 }}>{feedback.totalScore}</span>
                                    : "---"
                                }/100
                            </span>
                        </div>
                    </div>

                    {/* assessment */}
                    <p
                        className="line-clamp-2 mt-4"
                        style={{
                            fontSize: "0.875rem",
                            color: "#6870a6",
                            lineHeight: 1.65,
                        }}
                    >
                        {feedback?.finalAssessment ||
                            "You haven't taken this interview yet. Start now to improve your skills."}
                    </p>
                </div>

                {/* ── card footer ── */}
                <div
                    className="flex flex-row justify-between items-center"
                    style={{
                        paddingTop: "16px",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <DisplayTechIcons techStack={techstack} />

                    <Link href={`/interview/${id}`}>
                        <Button
                            className="btn-primary"
                            style={{ fontSize: "0.8125rem", padding: "0 18px", minHeight: "36px" }}
                        >
                            Start Interview
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default InterviewCard;