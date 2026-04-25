/**
 * TNA Validator
 * Validates the format of a Temporary National Address code.
 * Accepted Examples: "TNA-1234-ABCD", "TNA1234ABCD"
 */
export function isValidTNA(code: string): boolean {
    if (!code) return false;
    const cleanCode = code.trim().toUpperCase();
    const regex = /^TNA(?:-|)?\d{4}(?:-|)?[A-Z]{4}$/;
    return regex.test(cleanCode);
}