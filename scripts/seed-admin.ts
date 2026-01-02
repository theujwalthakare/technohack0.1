
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
console.log(`Loading env from: ${envPath}`);
dotenv.config({ path: envPath });

/**
 * Script to promote a user to admin by email.
 * Usage: npx tsx scripts/seed-admin.ts <email>
 */
async function seedAdmin() {
    const email = process.argv[2];

    if (!email) {
        console.error("Please provide an email address.");
        console.error("Usage: npx tsx scripts/seed-admin.ts <email>");
        process.exit(1);
    }

    try {
        // Ensure MONGODB_URI is available
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI not found in environment variables");
        }

        console.log(`Connecting to database...`);

        // Dynamic imports to ensure env vars are loaded first
        const { connectToDatabase } = await import("../lib/db");
        const { User } = await import("../lib/models/user.model");

        await connectToDatabase();

        console.log(`Looking for user with email: ${email}`);
        const user = await User.findOne({ email: email });

        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        console.log(`User found: ${user.firstName} ${user.lastName} (${user.role})`);

        if (user.role === 'admin' || user.role === 'superadmin') {
            console.log("User is already an admin.");
        } else {
            console.log("Promoting user to admin...");
            user.role = 'admin';
            await user.save();
            console.log("User successfully promoted to admin!");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
}

seedAdmin();
