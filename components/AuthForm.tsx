"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "@/components/FormField"
import { useRouter } from "next/navigation"

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"

import { signIn, signUp } from "@/lib/actions/auth.action"

type FormType = "sign-in" | "sign-up"

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    })
}

const AuthForm = ({ type }: { type: FormType }) => {

    const router = useRouter()
    const formSchema = authFormSchema(type)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {

            if (type === "sign-up") {

                const { name, email, password } = values

                const userCredentials = await createUserWithEmailAndPassword(auth, email, password)

                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password,
                })

                if (!result?.success) {
                    toast.error(result?.message)
                    return
                }

                toast.success("Account created successfully. Please sign in.")
                router.push("/sign-in")

            } else {

                const { email, password } = values

                const userCredential = await signInWithEmailAndPassword(auth, email, password)

                const idToken = await userCredential.user.getIdToken()

                if (!idToken) {
                    toast.error("Sign in failed")
                    return
                }

                await signIn({
                    email,
                    idToken,
                })

                toast.success("Signed in successfully.")
                router.push("/dashboard")

            }

        } catch (error) {
            console.log(error)
            toast.error(`There was an error: ${error}`)
        }
    }

    const isSignIn = type === "sign-in"

    return (
        <div className="card-border lg:min-w-[520px]">
            <div className="card flex flex-col gap-7 py-12 px-10">

                {/* ── Logo + brand ── */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex flex-row gap-2.5 items-center">
                        <Image
                            src="/logo.svg"
                            alt="PrepWise logo"
                            height={32}
                            width={38}
                        />
                        <span
                            className="text-primary-100"
                            style={{ fontSize: "1.35rem", fontWeight: 700, letterSpacing: "-0.02em" }}
                        >
                            PrepWise
                        </span>
                    </div>

                    {/* eyebrow pill */}
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "rgba(168,157,252,0.12)",
                            border: "1px solid rgba(168,157,252,0.25)",
                            borderRadius: "20px",
                            padding: "4px 14px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            color: "#a89dfc",
                            letterSpacing: "0.04em",
                        }}
                    >
                        <span
                            style={{
                                width: 6, height: 6, borderRadius: "50%",
                                background: "#a89dfc", display: "inline-block",
                            }}
                        />
                        AI-Powered Interview Coach
                    </div>
                </div>

                {/* ── Heading ── */}
                <div className="flex flex-col gap-1 text-center">
                    <h2 style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.025em", color: "#f0f0fa" }}>
                        {isSignIn ? "Welcome back" : "Create your account"}
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "#6870a6", marginTop: 2 }}>
                        {isSignIn
                            ? "Sign in to continue your interview prep"
                            : "Start practicing with AI-powered interviews"}
                    </p>
                </div>

                {/* ── Form ── */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-5 form"
                    >
                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                label="Full name"
                                placeholder="Your name"
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="you@example.com"
                            type="email"
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="••••••••"
                            type="password"
                        />

                        {isSignIn && (
                            <div className="flex justify-end" style={{ marginTop: "-8px" }}>
                                <span style={{ fontSize: "0.8125rem", color: "#a89dfc", cursor: "pointer" }}>
                                    Forgot password?
                                </span>
                            </div>
                        )}

                        <Button className="btn" type="submit" style={{ marginTop: "4px" }}>
                            {isSignIn ? "Sign in" : "Create account"}
                        </Button>
                    </form>
                </Form>

                {/* ── Divider ── */}
                <div className="flex items-center gap-3">
                    <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
                    <span style={{ fontSize: "0.75rem", color: "#6870a6", whiteSpace: "nowrap" }}>
                        or continue with
                    </span>
                    <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
                </div>

                {/* ── Google OAuth button ── */}
                <button
                    type="button"
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        minHeight: "48px",
                        borderRadius: "14px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#f0f0fa",
                        fontSize: "0.9375rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "background 0.2s, border-color 0.2s",
                        fontFamily: "inherit",
                        marginTop: "-8px",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.09)"
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </button>

                {/* ── Footer link ── */}
                <p className="text-center" style={{ fontSize: "0.875rem", color: "#6870a6" }}>
                    {isSignIn ? "Don't have an account?" : "Already have an account?"}
                    {" "}
                    <Link
                        href={!isSignIn ? "/sign-in" : "/sign-up"}
                        style={{ color: "#a89dfc", fontWeight: 600 }}
                    >
                        {!isSignIn ? "Sign in" : "Sign up free"}
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default AuthForm