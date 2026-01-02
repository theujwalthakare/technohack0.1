import { cn } from "@/lib/utils"

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
    return (
        <div
            className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full", className)}
            {...props}
        >
            {children}
        </div>
    )
}
