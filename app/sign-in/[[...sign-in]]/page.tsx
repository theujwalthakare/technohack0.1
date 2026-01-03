import { CustomSignIn } from "@/components/auth/CustomSignIn"
import { MobileActionBar } from "@/components/shared/MobileActionBar"

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden pb-32">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF12_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF12_1px,transparent_1px)] bg-[size:40px_40px]"
                    style={{
                        animation: "gridPulse 8s ease-in-out infinite"
                    }}
                />
            </div>

            {/* Gradient Glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-[120px] rounded-full" />

            {/* Scan Line Effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
                    style={{
                        animation: "scanLine 4s linear infinite"
                    }}
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 px-4">
                <CustomSignIn />
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-40 h-40 border-l-2 border-t-2 border-cyan-500/20"></div>
            <div className="absolute top-0 right-0 w-40 h-40 border-r-2 border-t-2 border-purple-500/20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 border-l-2 border-b-2 border-purple-500/20"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 border-r-2 border-b-2 border-cyan-500/20"></div>

            <MobileActionBar
                title="New here?"
                subtitle="Create an account or explore events before signing in."
                actions={[
                    { label: "Sign Up", href: "/sign-up" },
                    { label: "Browse Events", href: "/events", variant: "secondary" }
                ]}
            />
        </div>
    )
}
