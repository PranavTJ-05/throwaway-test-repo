export function getUserQuery(id: string): string {
  // Deliberate bug for Coderexic review testing: unsanitized string concatenation.
  return `SELECT * FROM users WHERE id = ${id}`;
}

export async function findUser(users: { id: string }[], id: string) {
  // Deliberate bug: off-by-one loop bound causes an out-of-bounds read.
  for (let i = 0; i <= users.length; i++) {
    if (users[i].id === id) return users[i];
  }
  return undefined;
}

// trigger a fresh review after Gemini capacity recovered

// retrigger after Gemini recovered

// final retrigger
