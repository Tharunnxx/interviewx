import Link from "next/link"
import Image from "next/image"

/* ─── tiny inline helpers so we don't need extra files ─── */

const Badge = ({
                   children,
                   color = "#a89dfc",
                   bg = "rgba(168,157,252,0.12)",
                   border = "rgba(168,157,252,0.25)",
               }: {
    children: React.ReactNode
    color?: string
    bg?: string
    border?: string
}) => (
    <span
        style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: bg, border: `1px solid ${border}`,
            borderRadius: 20, padding: "4px 13px",
            fontSize: "0.72rem", fontWeight: 600,
            color, letterSpacing: "0.05em", textTransform: "uppercase" as const,
        }}
    >
        {children}
    </span>
)

const Dot = ({ color }: { color: string }) => (
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
)

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
export default function HomePage() {
    return (
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: "#f0f0fa", background: "#07070f" }}>

            {/* ══════════════════════════════════════
                NAV
            ══════════════════════════════════════ */}
            <nav style={{
                position: "sticky", top: 0, zIndex: 50,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 48px", height: 64,
                background: "rgba(7,7,15,0.85)",
                backdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>
                {/* Logo */}
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <div style={{
                        width: 30, height: 30, borderRadius: 8, background: "#a89dfc",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="#07070f" strokeWidth="2" fill="none"/>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4" stroke="#07070f" strokeWidth="2" strokeLinecap="round" fill="none"/>
                        </svg>
                    </div>
                    <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "#f0f0fa", letterSpacing: "-0.02em" }}>
                        PrepWise
                    </span>
                </Link>

                {/* Nav links */}
                <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="max-sm:hidden">
                    {["How it works", "Features", "Pricing", "Blog"].map(item => (
                        <Link key={item} href="#" style={{ fontSize: "0.875rem", color: "#a0a0c0", textDecoration: "none", transition: "color 0.2s" }}
                              onMouseEnter={e => (e.currentTarget.style.color = "#f0f0fa")}
                              onMouseLeave={e => (e.currentTarget.style.color = "#a0a0c0")}
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Link href="/sign-in" style={{
                        padding: "8px 18px", borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.12)",
                        fontSize: "0.875rem", color: "#a0a0c0", textDecoration: "none",
                        transition: "all 0.2s",
                    }}>
                        Sign in
                    </Link>
                    <Link href="/sign-up" style={{
                        padding: "8px 18px", borderRadius: 10,
                        background: "#a89dfc", color: "#07070f",
                        fontSize: "0.875rem", fontWeight: 600, textDecoration: "none",
                        transition: "all 0.2s",
                    }}>
                        Get started free
                    </Link>
                </div>
            </nav>

            {/* ══════════════════════════════════════
                HERO
            ══════════════════════════════════════ */}
            <section style={{
                maxWidth: 1200, margin: "0 auto", padding: "96px 48px 80px",
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center",
            }} className="max-sm:grid-cols-1 max-sm:px-6 max-sm:pt-16">

                {/* Left */}
                <div>
                    <div style={{ marginBottom: 24 }}>
                        <Badge>
                            <Dot color="#22c98c" />
                            AI-powered interview coach
                        </Badge>
                    </div>

                    <h1 style={{
                        fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                        fontWeight: 700, lineHeight: 1.08,
                        letterSpacing: "-0.035em", color: "#f0f0fa",
                        marginBottom: 20,
                    }}>
                        Ace your next<br />interview with<br />
                        <em style={{ fontStyle: "italic", color: "#a89dfc" }}>real practice</em>
                    </h1>

                    <p style={{ fontSize: "1rem", color: "#a0a0c0", lineHeight: 1.75, marginBottom: 36, maxWidth: 420 }}>
                        Realistic voice-based mock interviews powered by AI. Get instant, detailed feedback and track your progress over time.
                    </p>

                    <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
                        <Link href="/sign-up" style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            padding: "13px 28px", borderRadius: 12,
                            background: "#a89dfc", color: "#07070f",
                            fontSize: "0.9375rem", fontWeight: 600, textDecoration: "none",
                            transition: "all 0.2s",
                        }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                <polygon points="5,3 19,12 5,21" fill="#07070f"/>
                            </svg>
                            Start free interview
                        </Link>
                        <Link href="#how-it-works" style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            padding: "13px 28px", borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.12)",
                            color: "#a0a0c0", fontSize: "0.9375rem", textDecoration: "none",
                            transition: "all 0.2s",
                        }}>
                            See how it works
                        </Link>
                    </div>

                    {/* Social proof */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ display: "flex" }}>
                            {[
                                { initials: "AK", color: "#a89dfc" },
                                { initials: "SR", color: "#22c98c" },
                                { initials: "MP", color: "#f5a623" },
                                { initials: "RV", color: "#ff5c5c" },
                            ].map((av, i) => (
                                <div key={i} style={{
                                    width: 30, height: 30, borderRadius: "50%",
                                    background: av.color + "22",
                                    border: `2px solid ${av.color}44`,
                                    marginLeft: i === 0 ? 0 : -8,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "10px", color: av.color, fontWeight: 600,
                                }}>
                                    {av.initials}
                                </div>
                            ))}
                        </div>
                        <span style={{ fontSize: "0.8125rem", color: "#6870a6" }}>
                            <strong style={{ color: "#a0a0c0", fontWeight: 600 }}>4,200+ engineers</strong> landed their dream job
                        </span>
                    </div>
                </div>

                {/* Right — mock interview card */}
                <div style={{ position: "relative" }}>
                    {/* Main card */}
                    <div style={{
                        background: "linear-gradient(160deg, #131328 0%, #0b0b1a 100%)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 20, overflow: "hidden",
                    }}>
                        {/* Card top bar */}
                        <div style={{
                            background: "rgba(255,255,255,0.03)",
                            borderBottom: "1px solid rgba(255,255,255,0.07)",
                            padding: "11px 18px",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}>
                            <div style={{ display: "flex", gap: 6 }}>
                                {["#ff5c5c","#f5a623","#22c98c"].map(c => (
                                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                                ))}
                            </div>
                            <span style={{ fontSize: "11px", color: "#6870a6", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                Live interview
                            </span>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5c5c" }} />
                                <span style={{ fontSize: "11px", color: "#6870a6" }}>07:42</span>
                            </div>
                        </div>

                        {/* Card body */}
                        <div style={{ padding: 22 }}>
                            {/* Interviewer row */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: 10,
                                    background: "linear-gradient(135deg,#a89dfc,#cac5fe)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="11" width="18" height="11" rx="2" stroke="#07070f" strokeWidth="1.8" fill="none"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#07070f" strokeWidth="1.8" fill="none"/>
                                        <circle cx="12" cy="16" r="1.5" fill="#07070f"/>
                                    </svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#f0f0fa" }}>AI Interviewer</div>
                                    <div style={{ fontSize: "11px", color: "#6870a6" }}>Senior Engineer @ PrepWise</div>
                                </div>
                            </div>

                            {/* Question bubble */}
                            <div style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "4px 14px 14px 14px",
                                padding: "12px 16px", marginBottom: 16,
                            }}>
                                <p style={{ fontSize: "13.5px", color: "#d0d0e8", lineHeight: 1.65, margin: 0 }}>
                                    Walk me through how you'd design a distributed cache system that handles 1M requests per second.
                                </p>
                            </div>

                            {/* Waveform row */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}>
                                    {[8,16,11,22,15,26,18,12,20,9,17,24].map((h, i) => (
                                        <div key={i} style={{ width: 3, height: h, borderRadius: 2, background: "#a89dfc" }} />
                                    ))}
                                </div>
                                <span style={{ fontSize: "12px", color: "#6870a6" }}>Listening to your answer…</span>
                            </div>

                            {/* Transcript preview */}
                            <div style={{
                                background: "rgba(168,157,252,0.08)",
                                border: "1px solid rgba(168,157,252,0.2)",
                                borderRadius: 10, padding: "10px 14px",
                            }}>
                                <p style={{ fontSize: "13px", color: "#a89dfc", lineHeight: 1.6, margin: 0 }}>
                                    "I'd start with a Redis cluster using consistent hashing to distribute keys…"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Floating score badge */}
                    <div style={{
                        position: "absolute", top: 20, right: -20,
                        background: "linear-gradient(160deg, #131328 0%, #0b0b1a 100%)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 14, padding: "12px 16px",
                        minWidth: 130,
                    }}>
                        <div style={{ fontSize: "11px", color: "#6870a6", marginBottom: 4 }}>Overall score</div>
                        <div style={{ fontSize: "28px", fontWeight: 700, color: "#f0f0fa", lineHeight: 1, letterSpacing: "-0.02em" }}>87</div>
                        <div style={{ fontSize: "11px", color: "#22c98c", marginTop: 3 }}>↑ 12 pts this week</div>
                    </div>

                    {/* Floating tag */}
                    <div style={{
                        position: "absolute", bottom: 36, left: -24,
                        background: "linear-gradient(160deg, #131328 0%, #0b0b1a 100%)",
                        border: "1px solid rgba(34,201,140,0.2)",
                        borderRadius: 12, padding: "10px 14px",
                        display: "flex", alignItems: "center", gap: 10,
                    }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: "rgba(34,201,140,0.12)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="#22c98c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontSize: "12px", fontWeight: 600, color: "#f0f0fa" }}>Strong answer</div>
                            <div style={{ fontSize: "11px", color: "#6870a6" }}>Covers scalability</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                TRUST BAR
            ══════════════════════════════════════ */}
            <div style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                padding: "28px 48px",
            }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#3a3a5a", letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                        Trusted by engineers at
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
                        {["Google", "Microsoft", "Amazon", "Flipkart", "Swiggy", "PhonePe"].map(name => (
                            <span key={name} style={{ fontSize: "15px", fontWeight: 600, color: "#2a2a45", letterSpacing: "-0.01em" }}>
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════
                FEATURES
            ══════════════════════════════════════ */}
            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 48px" }}>
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <div style={{ marginBottom: 14 }}>
                        <Badge color="#6870a6" bg="transparent" border="rgba(104,112,166,0.3)">Why PrepWise</Badge>
                    </div>
                    <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#f0f0fa", lineHeight: 1.15 }}>
                        Everything you need to<br />
                        <em style={{ fontStyle: "italic", color: "#a89dfc" }}>interview with confidence</em>
                    </h2>
                </div>

                {/* Feature grid — cell-border layout */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                    border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20,
                    overflow: "hidden",
                }}>
                    {[
                        {
                            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4"/></svg>,
                            title: "Voice-first interviews",
                            desc: "Speak your answers naturally. Real-time transcription captures every word and our AI listens like a real interviewer would.",
                            tag: "Powered by Deepgram",
                            tagColor: "#22c98c",
                        },
                        {
                            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
                            title: "Instant AI feedback",
                            desc: "Get scored on technical accuracy, communication clarity, and confidence — right after every answer, not just at the end.",
                            tag: "Powered by Gemini",
                            tagColor: "#a89dfc",
                        },
                        {
                            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>,
                            title: "Progress tracking",
                            desc: "Watch your scores improve over sessions. Identify weak spots and focus your prep where it counts the most.",
                            tag: "Smart analytics",
                            tagColor: "#f5a623",
                        },
                        {
                            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
                            title: "Role-specific questions",
                            desc: "From SDE to PM, DevOps to Data Science. Questions are generated fresh for your exact role and experience level.",
                            tag: null, tagColor: "",
                        },
                        {
                            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
                            title: "Behavioural & technical",
                            desc: "Practice STAR-method answers alongside system design and DSA. One platform for your complete interview prep.",
                            tag: null, tagColor: "",
                        },
                        {
                            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
                            title: "Detailed session reports",
                            desc: "Every interview generates a full report with per-question breakdowns, suggested improvements, and ideal answer hints.",
                            tag: null, tagColor: "",
                        },
                    ].map((f, i) => (
                        <div key={i} style={{
                            padding: "32px 28px",
                            background: "linear-gradient(160deg, #0f0f20 0%, #09090f 100%)",
                            borderRight: (i + 1) % 3 !== 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                            borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                            transition: "background 0.2s",
                        }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 12,
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#a0a0c0", marginBottom: 18,
                            }}>
                                {f.icon}
                            </div>
                            <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#f0f0fa", marginBottom: 8, letterSpacing: "-0.01em" }}>
                                {f.title}
                            </h3>
                            <p style={{ fontSize: "0.8375rem", color: "#6870a6", lineHeight: 1.7, margin: 0 }}>
                                {f.desc}
                            </p>
                            {f.tag && (
                                <div style={{ marginTop: 14 }}>
                                    <span style={{
                                        fontSize: "11px", fontWeight: 600, padding: "3px 10px",
                                        borderRadius: 20, color: f.tagColor,
                                        background: f.tagColor + "18",
                                        border: `1px solid ${f.tagColor}33`,
                                    }}>
                                        {f.tag}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════
                HOW IT WORKS
            ══════════════════════════════════════ */}
            <section id="how-it-works" style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.015)",
                padding: "96px 48px",
            }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ marginBottom: 14 }}>
                        <Badge color="#6870a6" bg="transparent" border="rgba(104,112,166,0.3)">How it works</Badge>
                    </div>
                    <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#f0f0fa", lineHeight: 1.15, marginBottom: 48 }}>
                        Four steps to<br />
                        <em style={{ fontStyle: "italic", color: "#a89dfc" }}>interview-ready</em>
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                        {[
                            { num: "01", title: "Choose your role", desc: "Tell us your target role, company type, and experience level." },
                            { num: "02", title: "AI generates questions", desc: "Fresh, relevant questions are generated just for you — no repeats." },
                            { num: "03", title: "Speak your answers", desc: "Answer out loud like a real interview. We transcribe and evaluate in real time." },
                            { num: "04", title: "Get your feedback", desc: "Receive a scored report with specific, actionable improvements." },
                        ].map((step, i) => (
                            <div key={i} style={{
                                background: "linear-gradient(160deg, #131328 0%, #0b0b1a 100%)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: 18, padding: 28,
                            }}>
                                <div style={{
                                    fontSize: "2.2rem", fontWeight: 700, lineHeight: 1,
                                    color: "rgba(255,255,255,0.07)", marginBottom: 18,
                                    fontStyle: "italic", letterSpacing: "-0.04em",
                                }}>
                                    {step.num}
                                </div>
                                <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#f0f0fa", marginBottom: 8, letterSpacing: "-0.015em" }}>
                                    {step.title}
                                </h3>
                                <p style={{ fontSize: "0.8375rem", color: "#6870a6", lineHeight: 1.7, margin: 0 }}>
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                CTA SECTION
            ══════════════════════════════════════ */}
            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 48px" }}>
                <div style={{
                    background: "linear-gradient(135deg, #161538 0%, #0e0e1e 55%, #09090f 100%)",
                    border: "1px solid rgba(168,157,252,0.18)",
                    borderRadius: 28, padding: "80px 48px",
                    textAlign: "center", position: "relative", overflow: "hidden",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.55)",
                }}>
                    {/* grid texture */}
                    <div style={{
                        position: "absolute", inset: 0, pointerEvents: "none",
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                        backgroundSize: "44px 44px",
                    }} />
                    {/* glow blob */}
                    <div style={{
                        position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
                        width: 400, height: 200,
                        background: "radial-gradient(ellipse, rgba(108,99,255,0.25) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }} />

                    <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#f0f0fa", marginBottom: 14, position: "relative" }}>
                        Ready to land that offer?
                    </h2>
                    <p style={{ fontSize: "1rem", color: "#6870a6", marginBottom: 36, position: "relative" }}>
                        Join thousands of engineers who practice smarter with PrepWise.
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: 12, position: "relative", flexWrap: "wrap" }}>
                        <Link href="/sign-up" style={{
                            padding: "13px 32px", borderRadius: 12,
                            background: "#f0f0fa", color: "#07070f",
                            fontSize: "0.9375rem", fontWeight: 600, textDecoration: "none",
                        }}>
                            Start for free
                        </Link>
                        <Link href="#" style={{
                            padding: "13px 32px", borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.15)",
                            color: "#a0a0c0", fontSize: "0.9375rem", textDecoration: "none",
                        }}>
                            View pricing
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                FOOTER
            ══════════════════════════════════════ */}
            <footer style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "28px 48px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                maxWidth: 1200, margin: "0 auto", flexWrap: "wrap", gap: 16,
            }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: "#a89dfc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="#07070f" strokeWidth="2.2" fill="none"/>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4" stroke="#07070f" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                        </svg>
                    </div>
                    <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f0f0fa", letterSpacing: "-0.02em" }}>PrepWise</span>
                </Link>

                <div style={{ display: "flex", gap: 24 }}>
                    {["Privacy", "Terms", "Contact"].map(link => (
                        <Link key={link} href="#" style={{ fontSize: "0.8125rem", color: "#3a3a5a", textDecoration: "none" }}>
                            {link}
                        </Link>
                    ))}
                </div>

                <span style={{ fontSize: "0.8125rem", color: "#3a3a5a" }}>© 2026 PrepWise</span>
            </footer>

        </div>
    )
}