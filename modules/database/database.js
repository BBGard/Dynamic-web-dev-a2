import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import Config from "../config/db.js"

const client = new Client(Config);
await client.connect();

export { client };
