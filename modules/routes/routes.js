import { Router, Status } from "https://deno.land/x/oak@v12.3.0/mod.ts";
import sodium from "https://deno.land/x/sodium@0.2.0/basic.ts";
await sodium.ready;
import { loginUser, requireAuthentication } from "../middleware/auth.js";
import { getPosts, createPost, votePost, getPostsForMember, toggleHidePost } from "../controllers/posts.js";
import { getMembers, createMember, updateFavoritePosts, getFavoritePosts, getVotedPosts } from "../controllers/members.js";
import { client } from "../database/database.js";
import { createNewPostPage, createNewPostScript, loginPage, loginScript,
  postBuilder,
  profilePage, profileScript, signUpPage, signUpScript } from "../middleware/staticServe.js";

import {send} from "https://deno.land/x/oak@v7.4.1/mod.ts";


export const router = new Router();

// Check if the user is logged in
router.get("/session", async (context) => {
  // session.get returns null if the value isn't there
  const loggedInUser = await context.state.session.get("user");
  let userId = null;

  // console.log(`loggedInUser: ${loggedInUser}`);
  // Move this?
  if(loggedInUser) {
    // console.log("getting member crap");
    const member = await client.queryObject("SELECT member_id FROM members WHERE username = $1", [loggedInUser]);

    // console.log(`member here: ${member}`);
    if (member.rows.length > 0) {
      userId = member.rows[0].member_id;
      // console.log(`user id: ${userId}`);
    }
    else {
      console.log("error?");
    }
  }

  // console.log("Checking session:");
  // console.log(loggedInUser);
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


router.get("/login", loginPage);
router.get("/login.js", loginScript);
router.get("/sign-up", signUpPage);
router.get("/sign-up.js", signUpScript);
router.get("/profile", requireAuthentication, profilePage);
router.get("/profile.js", requireAuthentication, profileScript);
router.get("/post-builder.js", postBuilder);
router.get("/create-new-post", requireAuthentication, createNewPostPage);
router.get("/create-new-post.js", requireAuthentication, createNewPostScript);
router.get("/posts", getPosts); // Get posts route
router.post("/myposts", requireAuthentication, getPostsForMember); // Get posts for a particular member route
router.post("/myvotes", requireAuthentication, getVotedPosts); // Get posts for a particular member route
router.get("/members", getMembers); // Member route
router.post("/new-member", createMember); // Create new member route
router.post("/posts", requireAuthentication, createPost); // Create new post route
router.post("/posts/:id/vote", requireAuthentication, votePost); // voteRoute
router.post("/posts/:id/hide", requireAuthentication, toggleHidePost); // hide post route
router.post("/members/:id/favorite", requireAuthentication, updateFavoritePosts); // update favorite
router.post("/members/:id/favorites", requireAuthentication, getFavoritePosts); // get favorites



export default router;
