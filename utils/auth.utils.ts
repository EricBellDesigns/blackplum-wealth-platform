import {Session} from "next-auth/core/types";

export function isAuthorized(session: Session, status: string, permissions: string) {
  // Check if session is already initialized
  if (status !== "loading") {
    // Check if session exists
    if (session === null) {
      return false;
    } else {
      // Retrieve user role if available
      const role = session?.user.role;

      // Check if authenticated user has correct permissions
      return role === permissions;
    }
  } else {
    // Return null value
    return null;
  }
}
