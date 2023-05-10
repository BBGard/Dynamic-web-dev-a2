import {send} from "https://deno.land/x/oak@v7.4.1/mod.ts";

export async function staticFiles(context) {
  const urlPathname = context.request.url.pathname;

  // Login page
  if (urlPathname === "/login") {
    await send(context, "/login.html", {
      root: `${Deno.cwd()}/front-end`,
    });
  } else {
    // Home page
    await send(context, urlPathname, {
      root: `${Deno.cwd()}/front-end`,
      index: "index.html",
    });
  }
}
