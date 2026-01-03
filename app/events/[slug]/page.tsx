import { getAllEvents, getEventBySlug } from "@/lib/actions/event.actions";
import { getRegistrationStatus } from "@/lib/actions/user.actions";
import { getPaymentSettings } from "@/lib/actions/settings.actions";
import { PageContainer } from "@/components/shared/PageContainer";
import { Calendar, MapPin, Users, User, DollarSign, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RegisterButton } from "@/components/events/RegisterButton";
import { MobileActionBar } from "@/components/shared/MobileActionBar";
import Link from "next/link";

// Dynamic metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    if (!event) return { title: 'Not Found' };

    return {
        title: `${event.title} | TechnoHack 2026`,
        description: event.description,
    };
}

export default async function EventDetailsPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const [event, events] = await Promise.all([
        getEventBySlug(slug),
        getAllEvents()
    ]);

    if (!event) {
        notFound();
    }

    const orderedEvents = events.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    const currentIndex = orderedEvents.findIndex((entry) => entry.slug === slug);
    const prevEvent = currentIndex > 0 ? orderedEvents[currentIndex - 1] : null;
    const nextEvent = currentIndex >= 0 && currentIndex < orderedEvents.length - 1 ? orderedEvents[currentIndex + 1] : null;

    // Check registration status
    const registration = await getRegistrationStatus(event._id);
    const isRegistered = !!registration;
    const paymentSettings = await getPaymentSettings();

    return (
        <div className="min-h-screen bg-background pb-32 lg:pb-20">
            {/* Hero Header */}
            <div className="relative h-[45vh] md:h-[60vh] w-full">
                <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

                <div className="absolute bottom-0 w-full">
                    <PageContainer className="pb-10">
                        <span className="inline-block px-3 py-1 bg-primary/20 border border-primary text-primary rounded-full text-sm font-bold mb-4">
                            {event.category}
                        </span>
                        <h1 className="text-4xl md:text-7xl font-bold font-orbitron mb-4 text-white">
                            {event.title}
                        </h1>
                    </PageContainer>
                </div>
            </div>

            {(prevEvent || nextEvent) && (
                <PageContainer className="pt-8">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        {prevEvent ? (
                            <Link
                                href={`/events/${prevEvent.slug}`}
                                className="group flex flex-1 min-w-[160px] items-center gap-3 rounded-2xl px-3 py-2 text-left text-white/80 hover:bg-white/5 transition"
                            >
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 text-white/70 group-hover:text-white">
                                    <ArrowLeft className="w-4 h-4" />
                                </span>
                                <span>
                                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Previous</p>
                                    <p className="text-sm font-semibold text-white">{prevEvent.title}</p>
                                </span>
                            </Link>
                        ) : (
                            <div className="flex-1" />
                        )}

                        {nextEvent ? (
                            <Link
                                href={`/events/${nextEvent.slug}`}
                                className="group flex flex-1 min-w-[160px] items-center justify-end gap-3 rounded-2xl px-3 py-2 text-right text-white/80 hover:bg-white/5 transition"
                            >
                                <span>
                                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Next</p>
                                    <p className="text-sm font-semibold text-white">{nextEvent.title}</p>
                                </span>
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 text-white/70 group-hover:text-white">
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </Link>
                        ) : (
                            <div className="flex-1" />
                        )}
                    </div>
                </PageContainer>
            )}

            <PageContainer className="pt-10 lg:pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Description */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                About Event
                            </h2>
                            <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                                {event.description}
                            </div>
                        </section>

                        {/* Structure/Rules */}
                        {event.rules && (
                            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <h2 className="text-2xl font-bold text-white mb-4">Structure & Rules</h2>
                                <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap text-sm">
                                    {event.rules}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar / Info Card */}
                    <div className="space-y-6">
                        <div className="bg-card border border-white/10 rounded-xl p-6 lg:sticky lg:top-24">
                            <div className="space-y-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <Calendar className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Date & Time</p>
                                        <p className="font-semibold text-white">
                                            {new Date(event.dateTime).toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Venue</p>
                                        <p className="font-semibold text-white">{event.venue}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Users className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Team Size</p>
                                        <p className="font-semibold text-white">
                                            {event.teamSize === 1 ? 'Individual Entry' : `${event.teamSize} Members / Team`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <DollarSign className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Registration Fee</p>
                                        <p className="font-semibold text-white">
                                            {event.price === 0 ? 'Free' : `₹${event.price}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <RegisterButton
                                        event={{ _id: event._id, title: event.title, teamSize: event.teamSize, price: event.price }}
                                        isRegistered={isRegistered}
                                        paymentSettings={paymentSettings}
                                    />
                                </div>

                                {event.whatsappLink && (
                                    <a
                                        href={event.whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 py-3 rounded-lg font-bold hover:bg-[#25D366]/20 transition-all"
                                    >
                                        Join WhatsApp Group
                                    </a>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <h4 className="text-sm font-semibold text-white mb-4">Event Coordinator</h4>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/10 p-2 rounded-full">
                                        <User className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{event.coordinatorName}</p>
                                        <p className="text-sm text-muted-foreground">{event.coordinatorPhone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </PageContainer>

            <MobileActionBar
                title="Ready to participate?"
                subtitle={event.price === 0 ? "Free entry" : `Registration fee • ₹${event.price}`}
            >
                <div className="flex items-center gap-4">
                    <div className="flex flex-col text-white/90">
                        <span className="text-[11px] uppercase tracking-[0.3em] text-gray-400">Team Size</span>
                        <span className="text-lg font-semibold">{event.teamSize === 1 ? "Solo" : `${event.teamSize} Members`}</span>
                    </div>
                    <div className="flex-1">
                        <RegisterButton
                            event={{ _id: event._id, title: event.title, teamSize: event.teamSize, price: event.price }}
                            isRegistered={isRegistered}
                            paymentSettings={paymentSettings}
                            variant="compact"
                            className="w-full"
                            buttonLabel={isRegistered ? "Registered" : "Register"}
                        />
                    </div>
                </div>
            </MobileActionBar>
        </div>
    );
}
