import { Application, Router, Status } from "https://deno.land/x/oak@v12.3.0/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions@v4.1.4/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import sodium from "https://deno.land/x/sodium@0.2.0/basic.ts";

// Auth
await sodium.ready;

const app = new Application();
const router = new Router();

// Setup session middleware
app.use(Session.initMiddleware());

// Connect to database
const client = new Client({
  user: "incense",
  database: "itech3108_30399545_a2",
  hostname: "localhost",
  password: "pword123",
  port: 5432,
});

await client.connect(); // DB


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
router.get('/api/session', async (context) => {
  // session.get returns null if the value isn't there
  const loggedIn = await context.state.session.get('user');
  context.response.body = { username: loggedIn };
});

// TODO add logout route
// router.get('/login', async (context) => {
//   context.response.body = await Deno.readTextFile('./front-end/src/views/login.html');
//   context.response.headers.set("Content-Type", "text/html");
// });

// Route to login page
router.get('/login', async (context) => {
  console.log("Requested login");
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

router.get("/login-user", async (ctx) => {
  // await ctx.state.session.set("name", "Cam");
  // ctx.response.body = `Logged in! <a href="/">Now go back to /</a><br><a href="/logout">Logout</a>`;
  // ctx.response.type = "html";
});

// Oak router middleware
app.use(router.routes());
app.use(router.allowedMethods());



// Oak's built-in static serving
// This serves up our index.html as the default page
app.use(async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/front-end`,
      index: "index.html",
    });
  } catch {
    next();
  }
});

// // Serves up the login page
// app.use(async (context) => {
//   if (context.request.url.pathname === "/login") {
//     console.log("REquested login");
//     await context.send({
//       root: `${Deno.cwd()}/front-end/src/views`,
//       path: "login.html",
//     });
//   }
// });


// deno run --allow-net --allow-env --allow-read server.js
console.log("Server running on http://localhost:3000/");

await app.listen({ port: 3000 });
