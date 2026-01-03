export function RouteLoadingScreen({ label = "Rendering" }: { label?: string }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="flex flex-col items-center gap-4 text-white">
                <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-cyan-400 border-l-cyan-400 animate-spin shadow-[0_0_25px_rgba(34,211,238,0.35)]" />
                <div className="flex flex-col items-center text-xs uppercase tracking-[0.4em] text-white/70">
                    <span>{label}</span>
                    <span className="text-[10px] tracking-[0.6em] text-cyan-200/80">Please wait</span>
                </div>
            </div>
        </div>
    )
}
