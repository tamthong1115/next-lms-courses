export function getUserInitial(user: { name?: string | null; email: string }): string {
  if (user.name && user.name.trim().length > 0) {
    return user.name.trim()[0].toUpperCase();
  }
  return user.email.trim()[0].toUpperCase();
}

export function getUserName(user: { name?: string | null; email: string }): string {
  if (user.name && user.name.trim().length > 0) {
    return user.name.trim();
  }
  const emailParts = user.email.split('@');
  if (emailParts.length > 0) {
    return emailParts[0];
  }
  return 'User';
}
