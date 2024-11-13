import { createMiddleware } from "hono/factory";

/*
 * Cache middleware
 *
 * @param seconds - The number of seconds to cache
 */
export function cache(seconds: number) {
  return createMiddleware(async (c, next) => {
    if (!c.req.path.match(/\.[a-zA-Z0-9]+$/) || c.req.path.endsWith(".data")) {
      return next();
    }

    await next();

    if (!c.res.ok) {
      return;
    }

    c.res.headers.set("cache-control", `public, max-age=${seconds}`);
  });
}

// export function authenticate() {
//   return createMiddleware(async (c, next) => {
//     if (c.req.path.startsWith("/api")) {
//       return next();
//     }
//
//     const session = await getSession(c.req.header("Cookie") ?? "");
//
//     const token = session.get("token");
//     let isAuthorized = false;
//     let uid = session.get("uid");
//     if (token) {
//       const userRepository = new UserRepository();
//       const userService = new UserService(userRepository);
//
//       const response = await userService.verifyToken(token);
//       uid = response.uid;
//       isAuthorized = response.success;
//     }
//
//     if (!c.req.path.startsWith("/login") && !isAuthorized) {
//       const loginUrl = "/login";
//
//       if (c.req.header("Accept")?.includes("text/html")) {
//         const cookie = await destroySession(session);
//
//         return new Response(null, {
//           status: 302,
//           headers: {
//             Location: loginUrl,
//             "Set-Cookie": cookie,
//           },
//         });
//       }
//       return new Response(null, {
//         status: 204,
//         statusText: "No Content",
//         headers: {
//           "X-Remix-Redirect": loginUrl,
//           "X-Remix-Status": "302",
//         },
//       });
//     }
//
//     if (c.req.path.startsWith("/login") && isAuthorized) {
//       return c.redirect(defaultAuthorizedPage);
//     }
//     if (!session.get("uid") && uid) {
//       session.set("uid", uid);
//       await commitSession(session);
//     }
//     await next();
//   });
// }
