import { getCurrentUserProfile } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import { AdminProfileForm } from "./ProfileForm"

export default async function AdminProfilePage() {
    const profile = await getCurrentUserProfile()

    if (!profile) {
        redirect("/sign-in")
    }

    const initialValues = {
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        email: profile.email ?? "",
        role: profile.role ?? "admin",
        imageUrl: profile.imageUrl ?? "",
        phone: profile.phone ?? "",
        college: profile.college ?? "",
        course: profile.course ?? "",
        year: profile.year ?? "",
        addressLine1: profile.addressLine1 ?? "",
        addressLine2: profile.addressLine2 ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
        postalCode: profile.postalCode ?? "",
        country: profile.country ?? "",
        bio: profile.bio ?? "",
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Account</p>
                <h1 className="text-3xl sm:text-4xl font-bold font-orbitron text-white">Admin Profile</h1>
                <p className="text-sm text-gray-400 max-w-3xl">
                    Update the details that appear across dashboards and audit trails. Changes sync instantly across the control panel.
                </p>
            </div>

            <AdminProfileForm initialValues={initialValues} />
        </div>
    )
}
