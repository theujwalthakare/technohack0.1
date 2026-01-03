"use client"

import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState, FormEvent } from "react"
import Link from "next/link"
import { Mail, Lock, User as UserIcon, Loader2, Github } from "lucide-react"

const getClerkErrorMessage = (err: unknown, fallback: string) => {
    if (err && typeof err === "object" && "errors" in err) {
        const clerkError = err as { errors?: Array<{ message?: string }> }
        return clerkError.errors?.[0]?.message || fallback
    }
    return fallback
}

export function CustomSignUp() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const [code, setCode] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!isLoaded) return

        setIsLoading(true)
        setError("")

        try {
            await signUp.create({
                emailAddress: email,
                password,
                firstName,
                lastName,
            })

            // Send email verification code
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

            setVerifying(true)
        } catch (err: unknown) {
            console.error("Sign up error:", err)
            setError(getClerkErrorMessage(err, "Failed to create account"))
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerify = async (e: FormEvent) => {
        e.preventDefault()
        if (!isLoaded) return

        setIsLoading(true)
        setError("")

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId })
                router.push("/dashboard")
            } else {
                setError("Verification incomplete. Please try again.")
            }
        } catch (err: unknown) {
            console.error("Verification error:", err)
            setError(getClerkErrorMessage(err, "Invalid verification code"))
        } finally {
            setIsLoading(false)
        }
    }

    const handleOAuthSignUp = async (provider: "oauth_google" | "oauth_github") => {
        if (!isLoaded) return

        try {
            await signUp.authenticateWithRedirect({
                strategy: provider,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/dashboard",
            })
        } catch (err: unknown) {
            console.error("OAuth error:", err)
            setError(getClerkErrorMessage(err, "OAuth sign up failed"))
        }
    }

    return (
        <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
                <h1
                    className="text-4xl md:text-5xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2"
                    style={{ textShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}
                >
                    {verifying ? "VERIFY EMAIL" : "JOIN US"}
                </h1>
                <p className="text-gray-400 text-sm">
                    {verifying ? "Enter the code sent to your email" : "Create your account for TechnoHack 2026"}
                </p>
            </div>

            {/* Form Container */}
            <div className="relative">
                {/* Decorative Border */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-lg opacity-50 blur-sm"></div>

                {/* Card */}
                <div className="relative bg-gradient-to-br from-[#0a0a0f] to-[#050508] rounded-lg p-1">
                    <div className="bg-[#0a0a0f] rounded-lg p-8">

                        {!verifying ? (
                            <>
                                {/* OAuth Buttons */}
                                <div className="space-y-3 mb-6">
                                    <button
                                        onClick={() => handleOAuthSignUp("oauth_google")}
                                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-purple-500/30 bg-purple-950/20 hover:bg-purple-950/40 hover:border-purple-400/50 text-white transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Continue with Google
                                    </button>
                                    <button
                                        onClick={() => handleOAuthSignUp("oauth_github")}
                                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-purple-500/30 bg-purple-950/20 hover:bg-purple-950/40 hover:border-purple-400/50 text-white transition-all duration-200"
                                    >
                                        <Github className="w-5 h-5" />
                                        Continue with GitHub
                                    </button>
                                </div>

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-purple-500/20"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-[#0a0a0f] text-gray-500">Or continue with email</span>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Sign Up Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Name Fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                                                First Name
                                            </label>
                                            <div className="relative">
                                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    id="firstName"
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    required
                                                    className="w-full pl-11 pr-4 py-3 bg-[#0f0f14] border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all"
                                                    placeholder="John"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                id="lastName"
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 bg-[#0f0f14] border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full pl-11 pr-4 py-3 bg-[#0f0f14] border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={8}
                                                className="w-full pl-11 pr-4 py-3 bg-[#0f0f14] border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Creating account...
                                            </>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </button>
                                </form>

                                {/* Sign In Link */}
                                <p className="mt-6 text-center text-sm text-gray-400">
                                    Already have an account?{" "}
                                    <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                                        Sign in
                                    </Link>
                                </p>
                            </>
                        ) : (
                            <>
                                {/* Error Message */}
                                {error && (
                                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Verification Form */}
                                <form onSubmit={handleVerify} className="space-y-4">
                                    <div>
                                        <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                                            Verification Code
                                        </label>
                                        <input
                                            id="code"
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-[#0f0f14] border border-purple-500/30 rounded-lg text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all"
                                            placeholder="000000"
                                            maxLength={6}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            "Verify Email"
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setVerifying(false)}
                                        className="w-full text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        ← Back to sign up
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Decorative Elements */}
            <div className="mt-8 flex items-center justify-center gap-4">
                <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-purple-500/50"></div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Secure Registration</p>
                <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
            </div>
        </div>
    )
}
