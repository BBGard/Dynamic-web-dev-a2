import { Router } from "https://deno.land/x/oak@v12.3.0/mod.ts";
import sodium from "https://deno.land/x/sodium@0.2.0/basic.ts";
await sodium.ready;

import { login, logout, requireAuthentication, session } from "../middleware/auth.js";
import { getPosts, createPost, votePost, getPostsForMember, toggleHidePost } from "../controllers/posts.js";
import { getMembers, createMember, updateFavoritePosts, getFavoritePosts, getVotedPosts } from "../controllers/members.js";

import {
  loginPage,
  loginScript,
  signUpPage,
  signUpScript,
  profilePage,
  profileScript,
  postBuilder,
  createNewPostPage,
  createNewPostScript,
} from "../middleware/staticServe.js";

const router = new Router();

// Public routes

router.get("/login-page", loginPage); // Login page
router.get("/login.js", loginScript); // Login page script
router.get("/sign-up", signUpPage); // Signup page
router.get("/sign-up.js", signUpScript);  // Signup page script

// Authenticated routes
router.get("/profile", requireAuthentication, profilePage); // Profile page
router.get("/profile.js", requireAuthentication, profileScript);  // Profile script

router.get("/create-new-post", requireAuthentication, createNewPostPage); // Create new post page
router.get("/create-new-post.js", requireAuthentication, createNewPostScript);  // Create new post script

router.post("/myposts", requireAuthentication, getPostsForMember); // Get posts for a particular member route
router.post("/myvotes", requireAuthentication, getVotedPosts); // Get votes for a particular member route

router.post("/newpost", requireAuthentication, createPost); // Create new post route
router.post("/posts/:id/vote", requireAuthentication, votePost); // Add vote to post route
router.post("/posts/:id/hide", requireAuthentication, toggleHidePost); // Toggle hide post route

router.post("/members/:id/favorite", requireAuthentication, updateFavoritePosts); // Update favorite post for a member
router.post("/members/:id/favorites", requireAuthentication, getFavoritePosts); // Get favorites for a member

// Other API routes
router.get("/session", session); // Check if the user is logged in

router.post("/posts", getPosts); // Get posts route

router.get("/members", getMembers); // Get member route
router.post("/new-member", createMember); // Create new member route

router.get("/post-builder.js", postBuilder);  // Post builder - construct posts

router.post("/login", login); // Route to login a user
router.get("/logout", logout)  // Route to logout


export default router;
