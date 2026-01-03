"use server"

import { connectToDatabase } from "@/lib/db"
import Event from "@/lib/models/event.model"
import { Event as EventType } from "@/lib/models/event.model"

// Seed function to execute manually if needed
export async function seedEvents() {
    await connectToDatabase();

    // Clear existing to avoid duplicates during dev
    await Event.deleteMany({});

    const realEvents = [
        // --- Day 1: January 08, 2026 ---
        {
            title: "Pocket Cinema",
            slug: "pocket-cinema",
            description: "A short-film competition encouraging storytelling, creativity, and technical filmmaking skills within a limited duration (5-8 minutes).",
            rules: `● Rules:
- Film duration must be minimum 5 minutes and maximum 8 minutes.
- Content must be original and created by the participant/team.
- Films should not contain offensive or inappropriate material.
- Participants can submit individual or team entries.
- Submissions should be in a common video format (MP4/MOV).
- All participants must be present on the competition day.
- Decision of the judges will be final.

● Topics:
1) Life after failure
2) Exploring Nashik
3) Horror content
4) Comedy content
5) Violence of a Sexual Nature`,
            image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1000&auto=format&fit=crop",
            category: "Creative Media",
            dateTime: new Date("2026-01-08T11:00:00"),
            venue: "Seminar Hall",
            price: 50,
            teamSize: 5,
            mode: "Offline",
            firstPrize: 2000,
            secondPrize: 1000,
            certificates: true,
            coordinatorName: "Somvanshi Akshay",
            coordinatorPhone: "9699818382",
            whatsappLink: "https://chat.whatsapp.com/LcHtOwEY3d9L9DnS3EzcI3",
            isPublished: true
        },
        {
            title: "Quizzy Bytes",
            slug: "quizzy-bytes",
            description: "A high-speed technical quiz designed to test programming knowledge, aptitude, and visual intelligence through three increasingly challenging rounds.",
            rules: `● Game Structure:
Round 1: 50 Questions (20 Mins)
Round 2: 30 Questions (10 Mins)
Round 3: 25 Questions (10 Mins)

● Gameplay Details:
- Single-player mode
- Played on PC
- Each question has its own time limit
- All questions are MCQs and fill in the blanks

● Topics:
- Programming Languages (C, Java, basics, logic)
- Aptitude & Intelligence
- Image Identification (logos, symbols, visual clues)`,
            image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b",
            category: "Technical",
            dateTime: new Date("2026-01-08T11:30:00"),
            venue: "Lab 2",
            price: 50,
            teamSize: 1,
            mode: "Offline",
            firstPrize: 2000,
            secondPrize: 1000,
            certificates: true,
            coordinatorName: "Vaibhav Shinde",
            coordinatorPhone: "7709779569",
            whatsappLink: "https://chat.whatsapp.com/CnPiNurLhe2LnHtHz8EBsr",
            isPublished: true
        },
        {
            title: "SQL Murder Mystery",
            slug: "sql-murder-mystery",
            description: "A detective-style SQL challenge where participants solve crimes by querying databases and uncovering hidden clues.",
            rules: `● Levels:
1. The Vanishing Briefcase
2. The Stolen Sound
3. The Midnight Masquerade Murder
4. The Silicon Sabotage

● Gameplay Details:
- Participants can make a group of 3
- Play the role of detective.
- Participants are allowed to bring cheatsheets (Sheet covering only one side of an A4 paper).`,
            image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=1000&auto=format&fit=crop",
            category: "Technical",
            dateTime: new Date("2026-01-08T14:00:00"),
            venue: "Lab 3",
            price: 50,
            teamSize: 3,
            mode: "Offline",
            firstPrize: 2000,
            secondPrize: 1000,
            certificates: true,
            coordinatorName: "Ghoshal Shreya",
            coordinatorPhone: "8488890300",
            whatsappLink: "https://chat.whatsapp.com/GKkoiIAoyqR8O1fSi3WSSa",
            isPublished: true
        },
        {
            title: "AIdeaX",
            slug: "aideax",
            description: "An AI idea presentation event focusing on innovative, feasible AI-based solutions without mandatory coding.",
            rules: `● Round – AI Idea Presentation (5 Mins)

● Gameplay Details:
- Individual or team participation (Max 2 members)
- Offline, classroom-based
- PPT or PDF presentation allowed
- Use of AI concepts is mandatory (ML / NLP / Computer Vision, etc.)
- No ready-made or previously implemented projects
- Coding or implementation not compulsory

● Presentation Must Include:
- Title of the AI Idea
- Problem Statement
- Proposed AI Solution
- AI Concept Used
- Target Users / Beneficiaries
- Advantages of the Solution
- Future Scope`,
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
            category: "AI & Innovation",
            dateTime: new Date("2026-01-08T14:00:00"),
            venue: "Classroom 5",
            price: 50,
            teamSize: 2,
            mode: "Offline",
            firstPrize: 2000,
            secondPrize: 1000,
            certificates: true,
            coordinatorName: "Omkar Pardeshi",
            coordinatorPhone: "8788241544",
            whatsappLink: "https://chat.whatsapp.com/K5yBWY26TscKs3RWyUXz6l",
            isPublished: true
        },
        {
            title: "BizBuzz Ads",
            slug: "bizbuzz-ads",
            description: "Teams create and present advertisement reels conveying a clear management or marketing concept.",
            rules: `● Scoring (Total 40 marks):
- Marketing Strategy: 10
- Creativity: 10
- Presentation: 20

● Rules:
- No vulgar, offensive, or political content.
- Ad should convey a clear management message.
- Advertisement reels are to be made at home and presented during the competition.
- Explanation time: 2 minutes.

● Team Rules:
- Maximum 3-5 members per team.`,
            image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b",
            category: "Business",
            dateTime: new Date("2026-01-09T12:00:00"),
            venue: "Seminar Hall",
            price: 50,
            teamSize: 5,
            mode: "Offline",
            firstPrize: 2000,
            secondPrize: 1000,
            certificates: true,
            coordinatorName: "Rutuja Nikam",
            coordinatorPhone: "7760277393",
            whatsappLink: "https://chat.whatsapp.com/LsCY8KADIf8HcsIKCtJKdp",
            isPublished: true
        },

        // --- Day 2: January 09, 2026 ---
        {
            title: "BizQuest",
            slug: "bizquest",
            description: "An inter-college online business quiz covering management basics, visual identification, and case studies.",
            rules: `1. Mode of Quiz: Online through designated app/platform.
2. Eligibility: BBA / BBA(CA) / B.Com students. Individual participation.
3. Device: Participants must use one device per team.
4. Rounds:
   - Round 1: BizBasics (Online MCQ)
   - Round 2: Thinkfast (Visual / Rapid Response)
   - Round 3: Managers Desk (Case Study / Decision making)
5. No cheating (Internet, ChatGPT, etc. prohibited).`,
            image: "/images/quiz.png",
            category: "Business",
            dateTime: new Date("2026-01-09T10:00:00"),
            venue: "Lab 1",
            price: 50,
            teamSize: 1,
            mode: "Online",
            firstPrize: 2000,
            secondPrize: 1000,
            certificates: true,
            coordinatorName: "Pratap Jagtap",
            coordinatorPhone: "9325354627",
            whatsappLink: "https://chat.whatsapp.com/EJqp2DvVcR84qumEg2cyCm",
            isPublished: true
        },
        {
            title: "Decode the BlackBox",
            slug: "decode-the-blackbox",
            description: "Participants interact with a mysterious system and deduce its internal logic using minimal probes.",
            rules: `● Gameplay Details:
- Solo event.
- Figure out the backend code of the machine.
- You'll be provided chance/probes to interact with it.
- The less probes you used, the better the scores!`,
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
            category: "Cyber & Logic",
            dateTime: new Date("2026-01-09T10:00:00"),
            venue: "Lab 4",
            price: 50,
            teamSize: 1,
            mode: "Offline",
            firstPrize: 2000,
            secondPrize: 1000,
            certificates: true,
            coordinatorName: "Pratyush Jadhav",
            coordinatorPhone: "7387249303",
            whatsappLink: "https://chat.whatsapp.com/C4ypEUDdF3X9iZQZ8rUFjP",
            isPublished: true
        },
        {
            title: "WebSprint",
            slug: "websprint",
            description: "A frontend development sprint using HTML, CSS & JavaScript only—no frameworks allowed.",
            rules: `🔹 Round 1 – Rapid Redesign (20 Minutes)
🔹 Round 2 – Web Replica (60 Minutes)

● Gameplay Details:
- Individual participation
- PC-based competition
- Only HTML, CSS & JavaScript allowed
- No frameworks or libraries
- Internet usage not permitted

● Judging Criteria:
- Accuracy & visual similarity
- Layout and alignment
- Colors, fonts, and spacing
- CSS animations & transitions
- Clean and structured code`,
            image: "https://images.unsplash.com/photo-1547658719-da2b51169166",
            category: "Web Development",
            dateTime: new Date("2026-01-09T12:00:00"),
            venue: "Lab 2",
            price: 50,
            teamSize: 1,
            mode: "Offline",
            firstPrize: 2000,
            secondPrize: 1000,
            certificates: true,
            coordinatorName: "Vishal Yadav",
            coordinatorPhone: "7498494137",
            whatsappLink: "https://chat.whatsapp.com/JVVdyxFeK1V4rXxEEslUyS",
            isPublished: true
        },
        {
            title: "BGMI Battle",
            slug: "bgmi",
            description: "A competitive BGMI tournament testing reflexes, strategy, and survival instincts across multiple maps.",
            rules: `🪂 Round 1: RONDO MAP (45 Mins)
🔫 Round 2: MIRAMAR (45 Mins)
🏆 Round 3: ERANGEL (30 Mins)

● Details:
- Valid for Solo, Duo, or Squad.
- Played on mobile devices (Android/iOS).
- Speed + Accuracy = Survival.`,
            image: "/images/bgmi.png",
            category: "Gaming",
            dateTime: new Date("2026-01-09T14:00:00"),
            venue: "Online/LAN Setup",
            price: 50,
            teamSize: 4,
            mode: "Mobile",
            firstPrize: 2000,
            secondPrize: 1000,
            certificates: true,
            coordinatorName: "Vedant Raikar",
            coordinatorPhone: "7875872264",
            whatsappLink: "https://chat.whatsapp.com/InHQy1cixVQLj11f1MLHgx",
            isPublished: true
        },
        {
            title: "Campusprenuers",
            slug: "campusprenuers",
            description: "A startup-style competition where participants pitch business ideas, models, and financial strategies.",
            rules: `● Stages:
Stage 1: Idea Submission (Problem, Solution, Revenue, etc.)
Stage 2: Detailed Business Plan (Marketing, Financials, SWOT)
Stage 3: Q&A Round

● Evaluation (20 Marks Total):
- Clarity: 5
- Presentation: 5
- Innovation: 5
- Financial Understanding: 5

● Rules:
- Min 1 student, Max 5 students.
- Lang: Marathi, English, Hindi.
- PPT presentation OR Business Model.`,
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
            category: "Business",
            dateTime: new Date("2026-01-09T14:00:00"),
            venue: "Auditorium",
            price: 50,
            teamSize: 5,
            mode: "Offline",
            firstPrize: 2000,
            secondPrize: 1000,
            certificates: true,
            coordinatorName: "Amit Gaikwad",
            coordinatorPhone: "9579603636",
            whatsappLink: "https://chat.whatsapp.com/F4mCdqx6strGleNC9ZUl2T",
            isPublished: true
        }
    ];

    await Event.insertMany(realEvents);
    return { message: `Seeded successfully with ${realEvents.length} events` };
}

export async function getAllEvents() {
    await connectToDatabase();
    const events = await Event.find({ isPublished: true }).sort({ dateTime: 1 }).lean();
    return events.map(event => ({ ...event, _id: event._id.toString() })) as EventType[];
}

export async function getEventBySlug(slug: string) {
    await connectToDatabase();
    const event = await Event.findOne({ slug }).lean();
    if (!event) return null;
    return { ...event, _id: event._id.toString() } as EventType;
}
