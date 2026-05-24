import type { User } from "@src/entities/user";

export const formatUserEmail = (user: User) => {
  if (user.pendingEmail) {
    return `${user.email} → ${user.pendingEmail}`;
  }

  return user.email;
};

export const isUserEmailVerified = (user: User) => Boolean(user.emailVerifiedAt);
