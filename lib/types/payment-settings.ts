export type PaymentSettingsData = {
    upiId: string
    receiverName: string
    qrImageUrl?: string | null
    instructions?: string | null
}
