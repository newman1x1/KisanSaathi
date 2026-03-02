export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function getOTPExpiry(): number {
  // Change this line from 10 * 60 * 1000
  return Date.now() + 8 * 60 * 60 * 1000 // (This is now 8 hours)
}

