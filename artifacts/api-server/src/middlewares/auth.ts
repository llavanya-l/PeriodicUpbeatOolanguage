import { clerkClient, getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

export type PortalRole = "user" | "admin";

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: PortalRole;
};

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthenticatedUser;
    }
  }
}

function readRole(publicMetadata: Record<string, unknown>): PortalRole {
  return publicMetadata.role === "admin" ? "admin" : "user";
}

async function loadAuthenticatedUser(req: Request): Promise<AuthenticatedUser | null> {
  const { userId } = getAuth(req);
  if (!userId) return null;

  const user = await clerkClient.users.getUser(userId);
  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    "";

  return {
    id: userId,
    email,
    role: readRole(user.publicMetadata),
  };
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const user = await loadAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  req.authUser = user;
  next();
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const user = await loadAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (user.role !== "admin") {
    res.status(403).json({ error: "Administrator access required" });
    return;
  }

  req.authUser = user;
  next();
}