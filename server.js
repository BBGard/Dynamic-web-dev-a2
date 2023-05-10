import { Application } from "https://deno.land/x/oak@v12.3.0/mod.ts";

// Import middleware and routes
import { sessionMiddleware } from "./modules/middleware/session.js";
import { router } from "./modules/routes/routes.js"
import { staticFiles } from "./modules/middleware/staticServe.js";


// Auth
// await sodium.ready;

const app = new Application();

// Setup session middleware
app.use(sessionMiddleware);

// Setup routes
app.use(router.routes());
app.use(router.allowedMethods());

// Setup static files middleware
app.use(staticFiles);





// Show connection in terminal
app.addEventListener('listen', () => {
  console.log("Server running on http://localhost:3000/");
})

await app.listen({ port: 3000 });
// deno run --allow-net --allow-env --allow-read server.js
