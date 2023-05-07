import { Application } from "https://deno.land/x/oak@v12.3.0/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// Import middleware and routes
import { sessionMiddleware } from "./middleware/session.js";
import { router } from "./routes/routes.js"


// Auth
// await sodium.ready;

const app = new Application();
// const router = new Router();

// Setup session middleware
// app.use(Session.initMiddleware());
app.use(sessionMiddleware);

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
  } catch (e){
    // next();
    console.log(e);
  }
});

// deno run --allow-net --allow-env --allow-read server.js
console.log("Server running on http://localhost:3000/");

await app.listen({ port: 3000 });
