// Schedule Page Data Configuration
// Complete event schedule for TechnoHack 2026

type EventType = "general" | "competition" | "break"

interface ScheduleEvent {
    time: string
    event: string
    venue: string
    type: EventType
    category?: string
}

export const scheduleData = {
    day1: {
        date: "January 08, 2026",
        dayName: "Thursday",
        events: [
            { time: "09:00 AM", event: "Registration & Welcome", venue: "Main Hall", type: "general" as const },
            { time: "10:00 AM", event: "Opening Ceremony", venue: "Auditorium", type: "general" as const },
            { time: "11:00 AM", event: "Pocket Cinema", venue: "Seminar Hall", type: "competition" as const, category: "Creative Media" },
            { time: "11:30 AM", event: "Quizzy Bytes", venue: "Lab 2", type: "competition" as const, category: "Technical" },
            { time: "01:00 PM", event: "Lunch Break", venue: "Cafeteria", type: "break" as const },
            { time: "02:00 PM", event: "SQL Murder Mystery", venue: "Lab 3", type: "competition" as const, category: "Technical" },
            { time: "02:00 PM", event: "AIdeaX", venue: "Classroom 5", type: "competition" as const, category: "AI & Innovation" },
            { time: "04:00 PM", event: "BizBuzz Ads", venue: "Seminar Hall", type: "competition" as const, category: "Business" },
            { time: "05:00 PM", event: "Day 1 Wrap-up", venue: "Main Hall", type: "general" as const }
        ] as ScheduleEvent[]
    },
    day2: {
        date: "January 09, 2026",
        dayName: "Friday",
        events: [
            { time: "09:30 AM", event: "Registration", venue: "Main Hall", type: "general" as const },
            { time: "10:00 AM", event: "BizQuest", venue: "Lab 1", type: "competition" as const, category: "Business" },
            { time: "10:00 AM", event: "Decode the BlackBox", venue: "Lab 4", type: "competition" as const, category: "Cyber & Logic" },
            { time: "12:00 PM", event: "WebSprint", venue: "Lab 2", type: "competition" as const, category: "Web Development" },
            { time: "01:00 PM", event: "Lunch Break", venue: "Cafeteria", type: "break" as const },
            { time: "02:00 PM", event: "BGMI Battle", venue: "Online/LAN Setup", type: "competition" as const, category: "Gaming" },
            { time: "02:30 PM", event: "Campusprenuers", venue: "Auditorium", type: "competition" as const, category: "Business" },
            { time: "04:30 PM", event: "Prize Distribution", venue: "Auditorium", type: "general" as const },
            { time: "05:30 PM", event: "Closing Ceremony", venue: "Auditorium", type: "general" as const }
        ] as ScheduleEvent[]
    }
}
