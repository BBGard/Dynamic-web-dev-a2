import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

// Setup routes
// Homepage
// router.get("/", (context) => {
//    context.request.url.pathname;
// });

// router.get("/login", (context) => {
//   context.response.body = "Login";
// });
// router.get("/signup", (context) => {
//   context.response.body = "Signup";
// });

// Oak router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Oak's built-in static serving
// This serves up our home page
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

// deno run --allow-net --allow-env --allow-read server.js
console.log("Server running on http://localhost:3000/");

await app.listen({ port: 3000 });
