// Generate a unique tracking code with format: MSM + 6 random digits
export function generateTrackingCode(): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000)
  return `MSM${randomDigits}`
}
