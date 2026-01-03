import dotenv from "dotenv"
import path from "path"

const envPath = path.resolve(process.cwd(), ".env.local")
console.log(`Loading env from: ${envPath}`)
dotenv.config({ path: envPath })

async function main() {
    try {
        const { seedEvents } = await import("@/lib/actions/event.actions")
        const result = await seedEvents()
        console.log("Events seeded:", result)
        process.exit(0)
    } catch (error) {
        console.error("Failed to seed events:", error)
        process.exit(1)
    }
}

main()
