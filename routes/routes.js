import { Router, Status } from "https://deno.land/x/oak@v12.3.0/mod.ts";
import sodium from "https://deno.land/x/sodium@0.2.0/basic.ts";
await sodium.ready;


export const router = new Router();

// DELETE ME TESTING///////////////////////////////////////////
const users = [
  {
    username: "ben",
    password: sodium.crypto_pwhash_str("mypassword123",
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE)
  },
  {
    username: "adam",
    password: sodium.crypto_pwhash_str("bossman69",
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE)
  }
];
////////////////////////////////////////////////////////////////

router.get('/', async (context) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/front-end`,
      index: "index.html",
    });
  } catch {
    context.throw(Status.InternalServerError);
  }
});

router.post("/users", async (context) => {
  // create a new user
});

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

// Check if the user is logged in
router.get('/session', async (context) => {
  // session.get returns null if the value isn't there
  const loggedIn = await context.state.session.get('user');
  context.response.body = { username: loggedIn };
});

// TODO add logout route
// router.get('/login', async (context) => {
//   context.response.body = await Deno.readTextFile('./front-end/src/views/login.html');
//   context.response.headers.set("Content-Type", "text/html");
// });

// Route to login-form page
router.get('/login-form', async (context) => {
  // console.log("Requested login page");
  try {
    await context.send({
      root: `${Deno.cwd()}/front-end/src/views`,
      path: "login.html",
    });
  } catch (error) {
    console.log(error);
    context.response.body = "Error serving login page";
    context.response.status = 500;
  }
});

// Route to actual login
router.post("/login", async (context) => {
  // this will automatically be decoded JSON if that's what the client sends
  const fromClient = await context.request.body().value;

  // Find the user with a matching username, and check if their password
  // matches.
  for(let u of users) {
    if(u.username === fromClient.username) {
      const match = sodium.crypto_pwhash_str_verify(u.password, fromClient.password);
      if(match) {
        // We're in!
        context.response.body = {success: true, username: u.username};

        // Store a value in the session saying that we're logged in
        // This will be managed transparently using a session cookie
        await context.state.session.set('user', u.username);
        return;
      } else {
        // password didn't match
        context.response.body = {success: false, message: "Bad password"}
        return;
      }
    }
  }
  context.response.body = {success: false, message: "User not found"};
});



export default router;
