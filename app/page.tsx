import { Hero } from "@/components/home/Hero"
import { StatsStrip } from "@/components/home/StatsStrip"
import { FeaturedEvents } from "@/components/home/FeaturedEvents"

import { SchedulePreview } from "@/components/home/SchedulePreview"
import { WhyParticipate } from "@/components/home/WhyParticipate"
import { SponsorsStrip } from "@/components/home/SponsorsStrip"
import { FinalCTA } from "@/components/home/FinalCTA"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section - Identity + Impact */}
      <Hero />

      {/* 2. Stats Strip - Credibility Boost */}
      <StatsStrip />

      {/* 3. Featured Events - Main Conversion Engine */}
      <FeaturedEvents />

      {/* 4. Event Categories - Fast Navigation */}


      {/* 5. Schedule Preview - Trust & Planning */}
      <SchedulePreview />

      {/* 6. Why Participate - Emotional Justification */}
      <WhyParticipate />

      {/* 7. Sponsors/Organizers - Authority */}
      <SponsorsStrip />

      {/* 8. Final CTA - Last Push */}
      <FinalCTA />
    </div>
  )
}
