// lib/otp-store.ts

type OtpRecord = {
  otp: string
  expires: number
}

// 🔥 GLOBAL STORE (important)
const globalForOtp = globalThis as unknown as {
  otpStore: Map<string, OtpRecord>
}

export const otpStore =
  globalForOtp.otpStore || new Map<string, OtpRecord>()

if (!globalForOtp.otpStore) {
  globalForOtp.otpStore = otpStore
}

export default otpStore