import { Schema, model, models } from "mongoose";

const EventSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },

    // Logistics
    dateTime: { type: Date, required: true },
    venue: { type: String, required: true },
    price: { type: Number, default: 0 },
    teamSize: { type: Number, default: 1 },
    mode: { type: String, default: "Offline" }, // "Offline" | "Online" | "Mobile"

    // Prizes
    firstPrize: { type: Number, default: 2000 },
    secondPrize: { type: Number, default: 1000 },
    certificates: { type: Boolean, default: true },

    // Coordination
    coordinatorName: { type: String, required: true },
    coordinatorPhone: { type: String, required: true },
    whatsappLink: { type: String },

    // Status
    isPublished: { type: Boolean, default: false },

    // Additional Info
    rules: { type: String }, // For detailed rules, judging criteria, structure

    createdAt: { type: Date, default: Date.now }
});

// Define TypeScript Inference
export interface Event {
    _id: string;
    title: string;
    slug: string;
    description: string;
    image: string;
    category: string;
    dateTime: Date;
    venue: string;
    price: number;
    teamSize: number;
    mode: string;
    firstPrize: number;
    secondPrize: number;
    certificates: boolean;
    coordinatorName: string;
    coordinatorPhone: string;
    whatsappLink?: string;
    isPublished: boolean;
    rules?: string;
    createdAt: Date;
}

const Event = models.Event || model("Event", EventSchema);

export default Event;
