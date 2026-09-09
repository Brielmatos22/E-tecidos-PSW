export function isValidEmail(email) {
    if (typeof email !== "string") {
        return false;
    }

    const normalizedEmail = email.trim();
    const atIndex = normalizedEmail.indexOf("@");
    const domain = normalizedEmail.slice(atIndex + 1);

    return atIndex > 0
        && atIndex === normalizedEmail.lastIndexOf("@")
        && !normalizedEmail.includes(" ")
        && domain.includes(".")
        && !domain.startsWith(".")
        && !domain.endsWith(".");
}

export function isValidPassword(password) {
    if (typeof password !== "string" || password.length < 8) {
        return false;
    }

    return !password.includes(" ")
        && /[A-Z]/.test(password)
        && /[a-z]/.test(password)
        && /\d/.test(password);
}

export default [isValidEmail, isValidPassword];