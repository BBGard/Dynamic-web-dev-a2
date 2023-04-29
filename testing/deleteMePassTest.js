/*
  Note, for this to work you'll need to setup the database using:
  ITECH3108_30399545_a2.sql
  Simply copy and paste the file into a psql prompt
*/

// Connect to the database
import { Client } from "https://deno.land/x/postgres/mod.ts";
import sodium from "https://deno.land/x/sodium/basic.ts";

const client = new Client({
  user: "incense",
  database: "itech3108_30399545_a2",
  hostname: "localhost",
  password: "pword123",
  port: 5432,
});

await client.connect(); // DB
await sodium.ready; // Auth

const username = prompt("Username?");
const password = prompt("Password?");

// Using the template tag to handle parameter replacement
// Note we're not using parentheses
const results = await client.queryObject`SELECT
    username, password_hash
    FROM members WHERE username=${username}`;

if (!results.rows.length) {
  console.log("Not found!");
} else {
  // We have a user
  const db_user = results.rows[0];
  console.log('db user:');
  console.log(db_user);

  // Check that the password matches
  const matches = sodium.crypto_pwhash_str_verify(
    db_user.password_hash,
    password,
  );

  if (!matches) {
    console.log("Incorrect password");
  } else {
    console.log(`Password matches! Welcome ${db_user.username}`);
  }
}
