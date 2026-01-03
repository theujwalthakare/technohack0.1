import { getAllEvents } from "@/lib/actions/event.actions";
import { PageContainer } from "@/components/shared/PageContainer";
import { EventCard } from "@/components/events/EventCard";
import { MobileActionBar } from "@/components/shared/MobileActionBar";

// Force dynamic rendering to avoid MongoDB connection during build
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EventsPage() {
    const events = await getAllEvents();

    return (
        <div className="min-h-screen bg-background pb-32 lg:pb-20 pt-10">
            <PageContainer>
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
                        All Events
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Browse through our wide range of technical and non-technical events.
                        Compete, Win, and Earn Glory.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.length === 0 ? (
                        <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-xl">
                            <p className="text-xl text-muted-foreground">No events published yet.</p>
                        </div>
                    ) : (
                        events.map((event) => (
                            <EventCard key={event._id} event={{
                                ...event,
                                dateTime: new Date(event.dateTime).toISOString()
                            }} />
                        ))
                    )}
                </div>
            </PageContainer>

            <MobileActionBar
                title="Need help choosing?"
                subtitle="Filter by category on desktop or tap schedule for timing details."
                actions={[
                    { label: "View Schedule", href: "/schedule" },
                    { label: "Contact Team", href: "/about", variant: "secondary" }
                ]}
            />
        </div>
    );
}
