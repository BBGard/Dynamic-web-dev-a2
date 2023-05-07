import { Application } from "https://deno.land/x/oak@v12.3.0/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// Import middleware and routes
import { sessionMiddleware } from "./middleware/session.js";
import { router } from "./routes/routes.js"
import { staticServe } from "./middleware/staticServe.js";


// Auth
// await sodium.ready;

const app = new Application();

// Setup middleware
app.use(sessionMiddleware);
app.use(staticServe);

// Setup routes
app.use(router.routes());
app.use(router.allowedMethods());

// Connect to database
const client = new Client({
  user: "incense",
  database: "itech3108_30399545_a2",
  hostname: "localhost",
  password: "pword123",
  port: 5432,
});

await client.connect(); // DB


// Show connection in terminal
app.addEventListener('listen', () => {
  console.log("Server running on http://localhost:3000/");
})

await app.listen({ port: 3000 });
// deno run --allow-net --allow-env --allow-read server.js
