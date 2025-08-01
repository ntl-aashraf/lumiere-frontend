function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

function validateUserName(username) {
  const re = /^[a-zA-Z0-9_]{3,}$/; // At least 3 characters, alphanumeric and underscores allowed
  return re.test(username);
}

function validatePassword(password) {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // At least 8 characters, one uppercase, one lowercase, one number, and one special character
  return re.test(password);
}

export { validateEmail, validateUserName, validatePassword };
