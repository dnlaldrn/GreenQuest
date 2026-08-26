/**
 * Global Input Sanitizers and Anti-Spam Validation Utilities for GreenQuest
 */

/**
 * Limits any consecutive identical characters to at most `maxConsecutive` (default 3).
 * Example: "ssssssss" -> "sss", "eeeeee" -> "eee", "111111" -> "111"
 */
export function limitConsecutiveChars(str, maxConsecutive = 3) {
  if (typeof str !== "string") return "";
  const regex = new RegExp(`(.)\\1{${maxConsecutive},}`, "gi");
  return str.replace(regex, (match, char) => char.repeat(maxConsecutive));
}

/**
 * Sanitizes input that should only contain alphabetical letters, spaces, hyphens, and apostrophes.
 * Strips all digits (0-9) and special symbols. Limits consecutive identical characters to 3.
 */
export function sanitizeTextOnly(val, maxLength = 40, maxConsecutive = 3) {
  if (typeof val !== "string") return "";
  // Keep only letters, spaces, hyphens, apostrophes, and periods
  let cleaned = val.replace(/[^a-zA-Z\s\-'.]/g, "");
  // Limit consecutive repeating chars
  cleaned = limitConsecutiveChars(cleaned, maxConsecutive);
  return cleaned.slice(0, maxLength);
}

/**
 * Sanitizes input that can contain letters, numbers, spaces, and standard punctuation.
 * Limits consecutive identical characters to 3.
 */
export function sanitizeAlphanumeric(val, maxLength = 100, maxConsecutive = 3) {
  if (typeof val !== "string") return "";
  let cleaned = val.replace(/[^a-zA-Z0-9\s\-.,'!?#&()/@:;]/g, "");
  cleaned = limitConsecutiveChars(cleaned, maxConsecutive);
  return cleaned.slice(0, maxLength);
}

/**
 * Sanitizes integer numeric input.
 * Strips all non-digit characters.
 */
export function sanitizeInteger(val, maxLength = 7, allowNegative = false) {
  if (typeof val !== "string" && typeof val !== "number") return "";
  const str = String(val);
  let cleaned = "";
  if (allowNegative && str.startsWith("-")) {
    cleaned = "-" + str.slice(1).replace(/\D/g, "");
  } else {
    cleaned = str.replace(/\D/g, "");
  }
  // Limit repeating identical digits to 3
  cleaned = limitConsecutiveChars(cleaned, 3);
  return cleaned.slice(0, maxLength);
}

/**
 * Sanitizes email address inputs.
 * Strips whitespace and characters invalid in email addresses.
 */
export function sanitizeEmail(val, maxLength = 80) {
  if (typeof val !== "string") return "";
  let cleaned = val.replace(/\s+/g, "").replace(/[^a-zA-Z0-9@._+\-]/g, "");
  cleaned = limitConsecutiveChars(cleaned, 3);
  return cleaned.slice(0, maxLength);
}

/**
 * Sanitizes password fields (enforces anti-spam repeating char limits and maxLength).
 */
export function sanitizePassword(val, maxLength = 64) {
  if (typeof val !== "string") return "";
  let cleaned = limitConsecutiveChars(val, 3);
  return cleaned.slice(0, maxLength);
}

/**
 * Validates standard email address format.
 */
export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
