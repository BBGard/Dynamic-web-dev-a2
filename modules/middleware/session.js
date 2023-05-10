import { Session } from "https://deno.land/x/oak_sessions@v4.1.4/mod.ts";

export const sessionMiddleware = Session.initMiddleware();
