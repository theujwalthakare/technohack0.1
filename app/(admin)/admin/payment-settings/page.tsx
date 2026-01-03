import Image from "next/image"
import { updatePaymentSettings, getPaymentSettings } from "@/lib/actions/settings.actions"

export default async function PaymentSettingsPage() {
    const settings = await getPaymentSettings()

    return (
        <div className="space-y-8">
            <header className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Payments</p>
                <h1 className="text-4xl font-bold font-orbitron text-white">Payment Settings</h1>
                <p className="text-sm text-gray-400 max-w-2xl">
                    Configure the default UPI recipient, QR code, and helper copy that participants see in the registration modal. Changes apply instantly across all event pages.
                </p>
            </header>

            <section className="rounded-2xl border border-white/10 bg-[#06060d] p-6">
                <form action={updatePaymentSettings} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="receiverName" className="text-sm font-semibold text-white">Receiver Name</label>
                            <input
                                id="receiverName"
                                name="receiverName"
                                type="text"
                                defaultValue={settings.receiverName}
                                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                                placeholder="TechnoHack Team"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="upiId" className="text-sm font-semibold text-white">UPI ID</label>
                            <input
                                id="upiId"
                                name="upiId"
                                type="text"
                                defaultValue={settings.upiId}
                                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none font-mono"
                                placeholder="example@upi"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="instructions" className="text-sm font-semibold text-white">Helper Text</label>
                        <textarea
                            id="instructions"
                            name="instructions"
                            defaultValue={settings.instructions ?? ""}
                            rows={3}
                            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                            placeholder="Any important instructions that appear in the participant modal"
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white">QR Code Image</label>
                            <input
                                type="file"
                                name="qrImage"
                                accept="image/png,image/jpeg"
                                className="text-sm text-gray-300 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-500/20 file:px-4 file:py-2 file:text-cyan-200 hover:file:bg-cyan-500/30"
                            />
                            <p className="text-xs text-gray-500">Upload a square PNG/JPG under 3MB.</p>
                            <input type="hidden" name="currentQr" value={settings.qrImageUrl ?? ""} />
                            <label className="flex items-center gap-2 text-xs text-gray-300">
                                <input type="checkbox" name="removeQr" className="rounded border-white/20 bg-transparent" />
                                Remove existing QR image
                            </label>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-center">
                            {settings.qrImageUrl ? (
                                <Image
                                    src={settings.qrImageUrl}
                                    alt="Current QR"
                                    width={192}
                                    height={192}
                                    className="h-48 w-48 object-contain"
                                    sizes="192px"
                                    unoptimized
                                />
                            ) : (
                                <p className="text-sm text-gray-500">No QR uploaded yet</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-cyan-400 hover:to-purple-400"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}
