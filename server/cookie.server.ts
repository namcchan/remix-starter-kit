import { createCookieSessionStorage } from "@remix-run/node";

const sessionSecret = process.env.VITE_SECRECT ?? "your-session-secret";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "session",
      secure: process.env.NODE_ENV === "production",
      secrets: [sessionSecret],
      sameSite: "lax",
      path: "/",
      httpOnly: true,
    },
  });

export const getUid = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie") ?? "");
  return session.get("uid") || "";
};
