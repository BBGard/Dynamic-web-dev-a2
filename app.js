import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

// Setup routes
// Homepage
router.get("/", (context) => {
   context.request.url.pathname;
});

// router.get("/login", (context) => {
//   context.response.body = "Login";
// });
// router.get("/signup", (context) => {
//   context.response.body = "Signup";
// });

app.use(router.routes());
app.use(router.allowedMethods());

// deno run --allow-net --allow-env app.js
console.log("Server running on http://localhost:3000/");

await app.listen({ port: 3000 });
