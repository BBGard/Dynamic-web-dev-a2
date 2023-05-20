import { send } from "https://deno.land/x/oak@v7.4.1/mod.ts";

export async function staticFiles(context) {
  const urlPathname = context.request.url.pathname;

  // Home page
  await send(context, urlPathname, {
    root: `${Deno.cwd()}/front-end`,
    index: "index.html",
  });
}

// Login/signup page
export async function loginPage(context) {
  await send(context, "/login.html", {
    root: `${Deno.cwd()}/modules/views`,
  });
}

// Login Script
export async function loginScript(context) {
  await send(context, "/login.js", {
    root: `${Deno.cwd()}/modules/views`,
  });
}

// Signup page
export async function signUpPage(context) {
  await send(context, "/sign-up.html", {
    root: `${Deno.cwd()}/modules/views`,
  });
}
// Signup Script
export async function signUpScript(context) {
  await send(context, "/sign-up.js", {
    root: `${Deno.cwd()}/modules/views`,
  });
}

// Profile page
export async function profilePage(context) {
  await send(context, "/profile.html", {
    root: `${Deno.cwd()}/modules/views`,
  });
}

// Profile Script
export async function profileScript(context) {
  await send(context, "/profile.js", {
    root: `${Deno.cwd()}/modules/views`,
  });
}

// Post builder
export async function postBuilder(context) {
  await send(context, "/post-builder.js", {
    root: `${Deno.cwd()}/modules/views`,
  });
}

// Create new post form
export async function createNewPostPage(context) {
  await send(context, "/create-new-post.html", {
    root: `${Deno.cwd()}/modules/views`,
  });
}

// Create new post script
export async function createNewPostScript(context) {
  await send(context, "/create-new-post.js", {
    root: `${Deno.cwd()}/modules/views`,
  });
}
