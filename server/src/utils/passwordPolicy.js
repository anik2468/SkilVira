export const PASSWORD_REQUIREMENT_MESSAGE =
  "Password must be at least 8 characters, start with an uppercase letter, and contain at least one special character.";

export const isStrongPassword = (value) => {
  const password = String(value || "");
  return password.length >= 8 && /^[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);
};
