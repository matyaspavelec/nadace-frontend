// Sdílené validátory pro formuláře.
// Vrací string s chybou, nebo null pokud je vstup OK.

export const MIN_PASSWORD_LENGTH = 8;

export function validatePassword(password) {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return `Heslo musí mít alespoň ${MIN_PASSWORD_LENGTH} znaků.`;
  }
  return null;
}

export function validatePasswordPair(password, confirm) {
  if (password !== confirm) {
    return 'Hesla se neshodují.';
  }
  return validatePassword(password);
}
