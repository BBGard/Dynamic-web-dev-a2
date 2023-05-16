import { Router, Status } from "https://deno.land/x/oak@v12.3.0/mod.ts";
import sodium from "https://deno.land/x/sodium@0.2.0/basic.ts";
await sodium.ready;
import { loginUser } from "../middleware/auth.js";
import { getPosts } from "../controllers/posts.js";
import { getMembers } from "../controllers/members.js";

export const router = new Router();

// Check if the user is logged in
router.get("/session", async (context) => {
  // session.get returns null if the value isn't there
  const loggedIn = await context.state.session.get("user");
  console.log("Checking sesion:");
  console.log(loggedIn);
  context.response.body = { username: loggedIn };
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


router.get("/posts", getPosts); // Posts route
router.get("/members", getMembers); // Member route



//----------------------------- OLD CRAP ---------------------------------------
// Users route
router.post("/users", async (context) => {
  // create a new user
});

// Users by id route
router.get("/users/:id", async (context) => {
  // retrieve a user by id
});

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
