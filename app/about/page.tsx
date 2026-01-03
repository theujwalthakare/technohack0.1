import { AboutHero } from "@/components/about/AboutHero"
import { QuickStats } from "@/components/about/QuickStats"
import { MissionVision } from "@/components/about/MissionVision"
import { EventCategories } from "@/components/about/EventCategories"
import { ContactInfo } from "@/components/about/ContactInfo"
import { MobileActionBar } from "@/components/shared/MobileActionBar"

export default function AboutPage() {
    return (
        <div className="flex flex-col pb-32 lg:pb-0">
            {/* 1. Hero Section */}
            <AboutHero />

            {/* 2. Quick Stats */}
            <QuickStats />

            {/* 3. Mission & Vision */}
            <MissionVision />

            {/* 4. Event Categories */}
            <EventCategories />

            {/* 5. Contact Information */}
            <ContactInfo />

            <MobileActionBar
                title="Talk to our coordinators"
                subtitle="Tap to jump to the contact block or browse every event."
                actions={[
                    { label: "Contact Info", href: "/about#contact" },
                    { label: "All Events", href: "/events", variant: "secondary" }
                ]}
            />
        </div>
    )
}
