import { ScheduleHero } from "@/components/schedule/ScheduleHero"
import { DayTimeline } from "@/components/schedule/DayTimeline"
import { scheduleData } from "@/lib/config/scheduleData"

export default function SchedulePage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <ScheduleHero />

            {/* Schedule Content */}
            <section className="py-12 px-4 bg-background">
                <div className="max-w-5xl mx-auto">
                    {/* Day 1 */}
                    <DayTimeline
                        dayNumber={1}
                        date={scheduleData.day1.date}
                        dayName={scheduleData.day1.dayName}
                        events={scheduleData.day1.events}
                    />

                    {/* Day 2 */}
                    <DayTimeline
                        dayNumber={2}
                        date={scheduleData.day2.date}
                        dayName={scheduleData.day2.dayName}
                        events={scheduleData.day2.events}
                    />

                    {/* Note */}
                    <div className="mt-8 p-6 rounded-lg bg-gradient-to-br from-cyan-950/20 to-purple-950/20 border border-cyan-500/20">
                        <p className="text-sm text-gray-400 text-center">
                            <span className="text-cyan-400 font-semibold">Note:</span> Schedule is subject to change. Please check for updates regularly.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
