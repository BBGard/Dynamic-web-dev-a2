import { send } from "https://deno.land/x/oak@v7.4.1/mod.ts";

// Serves the requested static file from modules/views
async function serveStaticFile(context, filename) {
  await send(context, `/${filename}`, {
    root: `${Deno.cwd()}/modules/views`,
  });
}

// Homepage route
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
  await serveStaticFile(context, "login.html");
}

// Login Script
export async function loginScript(context) {
  await serveStaticFile(context, "login.js");
}

// Signup page
export async function signUpPage(context) {
  await serveStaticFile(context, "sign-up.html");
}

// Signup Script
export async function signUpScript(context) {
  await serveStaticFile(context, "sign-up.js");
}

// Profile page
export async function profilePage(context) {
  await serveStaticFile(context, "profile.html");
}

// Profile Script
export async function profileScript(context) {
  await serveStaticFile(context, "profile.js");
}

// Post builder
export async function postBuilder(context) {
  await serveStaticFile(context, "post-builder.js");
}

// Create new post form
export async function createNewPostPage(context) {
  await serveStaticFile(context, "create-new-post.html");
}

// Create new post script
export async function createNewPostScript(context) {
  await serveStaticFile(context, "create-new-post.js");
}


// // Login/signup page
// export async function loginPage(context) {
//   await send(context, "/login.html", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// }

// // Login Script
// export async function loginScript(context) {
//   await send(context, "/login.js", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// }

// // Signup page
// export async function signUpPage(context) {
//   await send(context, "/sign-up.html", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// }
// // Signup Script
// export async function signUpScript(context) {
//   await send(context, "/sign-up.js", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// }

// // Profile page
// export async function profilePage(context) {
//   await send(context, "/profile.html", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// }

// // Profile Script
// export async function profileScript(context) {
//   await send(context, "/profile.js", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// }

// // Post builder
// export async function postBuilder(context) {
//   await send(context, "/post-builder.js", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// }

// // Create new post form
// export async function createNewPostPage(context) {
//   await send(context, "/create-new-post.html", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// }

// // Create new post script
// export async function createNewPostScript(context) {
//   await send(context, "/create-new-post.js", {
//     root: `${Deno.cwd()}/modules/views`,
//   });
// }
