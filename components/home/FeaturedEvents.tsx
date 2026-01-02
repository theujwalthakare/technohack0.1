import { getAllEvents } from "@/lib/actions/event.actions"
import { EventCard } from "@/components/events/EventCard"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { homePageData } from "@/lib/config/homePageData"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export async function FeaturedEvents() {
    const allEvents = await getAllEvents()
    const featuredEvents = allEvents.filter(event =>
        homePageData.featuredEventSlugs.includes(event.slug)
    )

    return (
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <SectionHeader
                    title="Featured Competitions"
                    subtitle="Showcase your skills in these premier events"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {featuredEvents.map((event, index) => (
                        <div
                            key={event._id}
                            style={{ animationDelay: `${index * 0.1}s` }}
                            className="animate-fadeIn"
                        >
                            <EventCard event={event} />
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/events"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all group"
                    >
                        View All Events
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
