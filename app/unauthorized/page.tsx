import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/40 flex items-center justify-center">
                        <Shield className="w-12 h-12 text-red-400" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-4">
                    ACCESS DENIED
                </h1>

                {/* Message */}
                <p className="text-gray-400 mb-2">
                    You don&apos;t have permission to access this area.
                </p>
                <p className="text-sm text-gray-500 mb-8">
                    This section is restricted to authorized administrators only.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-200"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-cyan-500/30 hover:border-cyan-400/50 text-white font-semibold rounded-lg transition-all duration-200"
                    >
                        Go to Dashboard
                    </Link>
                </div>

                {/* Help Text */}
                <div className="mt-12 p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                    <p className="text-xs text-gray-500">
                        If you believe you should have access, please contact the system administrator.
                    </p>
                </div>
            </div>
        </div>
    )
}
