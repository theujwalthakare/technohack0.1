// Home Page Data Configuration
// Centralized data for home page sections - easy to update for future editions

export const homePageData = {
    stats: [
        { label: "Events", value: "10", icon: "trophy" },
        { label: "Prize Pool", value: "₹30K", icon: "award" },
        { label: "Departments", value: "4", icon: "building" },
        { label: "Days", value: "2", icon: "calendar" }
    ],

    featuredEventSlugs: [
        "websprint",
        "sql-murder-mystery",
        "bgmi",
        "campusprenuers"
    ],

    categories: [
        { name: "Technical", slug: "Technical", icon: "code", color: "cyan" },
        { name: "Management", slug: "Management", icon: "briefcase", color: "purple" },
        { name: "Gaming", slug: "Gaming", icon: "gamepad", color: "pink" },
        { name: "Cultural", slug: "Cultural", icon: "palette", color: "orange" }
    ],

    schedule: {
        day1: {
            date: "Jan 08, 2026",
            highlights: [
                { time: "11:00 AM", event: "Pocket Cinema", venue: "Seminar Hall" },
                { time: "11:30 AM", event: "Quizzy Bytes", venue: "Lab 2" },
                { time: "02:00 PM", event: "SQL Murder Mystery", venue: "Lab 3" },
                { time: "02:00 PM", event: "AldeaX", venue: "Classroom 5" }
            ]
        },
        day2: {
            date: "Jan 09, 2026",
            highlights: [
                { time: "10:00 AM", event: "BizQuest", venue: "Lab 1" },
                { time: "10:00 AM", event: "Decode the BlackBox", venue: "Lab 4" },
                { time: "12:00 PM", event: "WebSprint", venue: "Lab 2" },
                { time: "02:00 PM", event: "BGMI Tournament", venue: "Online/LAN" }
            ]
        }
    },

    benefits: [
        {
            title: "Skill Building",
            description: "Hands-on experience with real-world challenges",
            icon: "brain"
        },
        {
            title: "Certificates",
            description: "Official participation & winner certificates",
            icon: "award"
        },
        {
            title: "Networking",
            description: "Connect with 5000+ students & industry experts",
            icon: "users"
        },
        {
            title: "Recognition",
            description: "Showcase your talent on a big platform",
            icon: "star"
        },
        {
            title: "Prizes & Fun",
            description: "Win exciting prizes while having fun",
            icon: "gift"
        }
    ],

    organizers: {
        college: "K.V.N. Naik College",
        location: "Nashik, Maharashtra",
        departments: ["Computer Science", "BBA", "B.Com", "IT"]
    }
}
