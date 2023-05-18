import {send} from "https://deno.land/x/oak@v7.4.1/mod.ts";

export async function staticFiles(context) {
  const urlPathname = context.request.url.pathname;

  // console.log(`here: ${urlPathname}`);
    // Home page
    await send(context, urlPathname, {
      root: `${Deno.cwd()}/front-end`,
      index: "index.html",
    });

}

// export async function home(context) {
//   await send(context, "/", {
//     root: `${Deno.cwd()}/front-end`,
//     index: "index.html",
//   });
// }

// Login/signup page
export async function loginPage(context) {
  await send(context, "/login.html", {
    root: `${Deno.cwd()}/modules/views`,
  });

};
// Script
export async function loginScript(context) {
  await send(context, "/login.js", {
    root: `${Deno.cwd()}/modules/views`,
  });
};

// Signup form
export async function signUpPage(context) {
  await send(context, "/sign-up.html", {
    root: `${Deno.cwd()}/modules/views`,
  });
};
// Script
export async function signUpScript(context) {
  await send(context, "/sign-up.js", {
    root: `${Deno.cwd()}/modules/views`,
  });
};

// Profile page
// router.get("/profile", requireAuthentication, async (context) => {
export async function profilePage(context) {
  await send(context, "/profile.html", {
    root: `${Deno.cwd()}/modules/views`,
  });
};
// Script
// router.get("/profile.js", requireAuthentication, async (context) => {
export async function profileScript(context) {

  await send(context, "/profile.js", {
    root: `${Deno.cwd()}/modules/views`,
  });
};

// Create new post form
// router.get("/create-new-post", requireAuthentication, async (context) => {
export async function createNewPostPage(context) {

  // console.log("Create new post");
  await send(context, "/create-new-post.html", {
    root: `${Deno.cwd()}/modules/views`,
  });
};
// Script
// router.get("/create-new-post.js", requireAuthentication, async (context) => {
export async function createNewPostScript(context) {

  await send(context, "/create-new-post.js", {
    root: `${Deno.cwd()}/modules/views`,
  });
};
