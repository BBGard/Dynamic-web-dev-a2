import { Router, Status } from "https://deno.land/x/oak@v12.3.0/mod.ts";
import sodium from "https://deno.land/x/sodium@0.2.0/basic.ts";
await sodium.ready;
import { loginUser, requireAuthentication } from "../middleware/auth.js";
import { getPosts, createPost } from "../controllers/posts.js";
import { getMembers, createMember } from "../controllers/members.js";
import { client } from "../database/database.js";
import { createNewPostPage, createNewPostScript, loginPage, loginScript, profilePage, profileScript, signUpPage, signUpScript } from "../middleware/staticServe.js";

import {send} from "https://deno.land/x/oak@v7.4.1/mod.ts";


export const router = new Router();

// Check if the user is logged in
router.get("/session", async (context) => {
  // session.get returns null if the value isn't there
  const loggedInUser = await context.state.session.get("user");
  let userId = null;

  console.log(`loggedInUser: ${loggedInUser}`);
  // Move this?
  if(loggedInUser) {
    console.log("getting member crap");
    const member = await client.queryObject("SELECT member_id FROM members WHERE username = $1", [loggedInUser]);

    console.log(`member heere: ${member}`);
    if (member.rows.length > 0) {
      userId = member.rows[0].member_id;
      console.log(`user id: ${userId}`);
    }
    else {
      console.log("error?");
    }
  }

  console.log("Checking session:");
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
// router.get("/login", async (context) => {
//   await send(context, "/login.html", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// });
// // Script
// router.get("/login.js", async (context) => {
//   await send(context, "/login.js", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// });

// // Signup form
// router.get("/sign-up", async (context) => {
//   await send(context, "/sign-up.html", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// });
// // Script
// router.get("/sign-up.js", async (context) => {
//   await send(context, "/sign-up.js", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// });

// // Profile page
// router.get("/profile", requireAuthentication, async (context) => {
//   await send(context, "/profile.html", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// });
// // Script
// router.get("/profile.js", requireAuthentication, async (context) => {
//   await send(context, "/profile.js", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// });

// // Create new post form
// router.get("/create-new-post", requireAuthentication, async (context) => {
//   console.log("Create new post");
//   await send(context, "/create-new-post.html", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// });
// // Script
// router.get("/create-new-post.js", requireAuthentication, async (context) => {
//   await send(context, "/create-new-post.js", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// });

router.get("/login", loginPage);
router.get("/login.js", loginScript);
router.get("/sign-up", signUpPage);
router.get("/sign-up.js", signUpScript);
router.get("/profile", requireAuthentication, profilePage);
router.get("/profile.js", requireAuthentication, profileScript);
router.get("/create-new-post", createNewPostPage);
router.get("/create-new-post.js", createNewPostScript);
router.get("/posts", getPosts); // Get posts route
router.get("/members", getMembers); // Member route
router.post("/new-member", createMember); // Create new member route
router.post("/posts", requireAuthentication, createPost); // Create new post route


export default router;
