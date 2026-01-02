import { AboutHero } from "@/components/about/AboutHero"
import { QuickStats } from "@/components/about/QuickStats"
import { MissionVision } from "@/components/about/MissionVision"
import { EventCategories } from "@/components/about/EventCategories"
import { ContactInfo } from "@/components/about/ContactInfo"

export default function AboutPage() {
    return (
        <div className="flex flex-col">
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
        </div>
    )
}
