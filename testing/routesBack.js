import { Router, Status } from "https://deno.land/x/oak@v12.3.0/mod.ts";
import sodium from "https://deno.land/x/sodium@0.2.0/basic.ts";
await sodium.ready;
import { loginUser, requireAuthentication } from "../middleware/auth.js";
import { getPosts, createPost } from "../controllers/posts.js";
import { getMembers } from "../controllers/members.js";
import { client } from "../database/database.js";

import {send} from "https://deno.land/x/oak@v7.4.1/mod.ts";


export const router = new Router();

// Check if the user is logged in
router.get("/session", async (context) => {
  // session.get returns null if the value isn't there
  const loggedInUser = await context.state.session.get("user");
  let userId = null;

  // Move this?
  if(loggedInUser) {
    const member = await client.queryObject("SELECT member_id FROM members WHERE username = $1", [loggedInUser]);
    if (member.rows.length > 0) {
      userId = member.rows[0].member_id;
      console.log(`user id: ${userId}`);
    }
  }

  console.log("Checking sesion:");
  console.log(loggedInUser);
  context.response.body = { username: loggedInUser, id: userId };
});

// Route to login a user
router.post("/auth", async (context) => {
  const clientCredentials = await context.request.body().value;

  // Attempt login
  const result = await loginUser(
    clientCredentials.username,
    clientCredentials.password
  );

  if (result.success) {
    // Logged in
    context.response.body = result;

    // Set cookie
    await context.state.session.set("user", result.username);
    return;

  } else {
    // Error
    context.response.body = result;
    return;
  }

});

// Login/signup page
router.get("/login", async (context) => {
  await send(context, "/login.html", {
    root: `${Deno.cwd()}/modules/views`,
  });
});
// Script
router.get("/login.js", async (context) => {
  await send(context, "/login.js", {
    root: `${Deno.cwd()}/modules/views`,
  });
});

// Signup form
router.get("/sign-up", async (context) => {
  await send(context, "/sign-up.html", {
    root: `${Deno.cwd()}/modules/views`,
  });
});
// Script
router.get("/sign-up.js", async (context) => {
  await send(context, "/sign-up.js", {
    root: `${Deno.cwd()}/modules/views`,
  });
});

// Create new post form
router.get("/create-new-post", requireAuthentication, async (context) => {
  console.log("Create new post");
  await send(context, "/create-new-post.html", {
    root: `${Deno.cwd()}/modules/views`,
  });
});
// Script
router.get("/create-new-post.js", requireAuthentication, async (context) => {
  await send(context, "/create-new-post.js", {
    root: `${Deno.cwd()}/modules/views`,
  });
});

router.get("/posts", getPosts); // Posts route
router.get("/members", getMembers); // Member route
router.post("/posts", requireAuthentication, createPost);



// Setup routes
// Homepage
// Add a route to the root URL that retrieves a variable from the session
// router.get("/", async (ctx) => {
//   if (await ctx.state.session.get("name") === undefined) {
//     //ctx.response.body = `<a href="/login">Login</a>`;
//     console.log("No user logged in");
//   } else {
//     //ctx.response.body = `<p>Logged in as:
//      // ${await ctx.state.session.get("name")}</p>`;
//      console.log("User logged in");
//   }
//   ctx.response.type = "html";
//   ctx.response.headers.set("Cache-Control", "no-store, max-age=0");
// });

// router.get("/login", (context) => {
//   context.response.body = "Login";
// });
// router.get("/signup", (context) => {
//   context.response.body = "Signup";
// });

// TODO add logout route
// router.get('/login', async (context) => {
//   context.response.body = await Deno.readTextFile('./front-end/src/views/login.html');
//   context.response.headers.set("Content-Type", "text/html");
// });

export default router;
