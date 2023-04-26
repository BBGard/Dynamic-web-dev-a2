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

// Setup users

const pwords = ["mypassword123", "bossman69", "elchapo456", "password"];
let users = [
  {
    username: "ben",
    password: null,
  },
  {
    username: "adam",
    password: null,
  },
  {
    username: "julie",
    password: null,
  },
  {
    username: "crystal",
    password: null,
  },
];

// Hash passwords
for(let i=0; i<users.length; i++) {
  // Hash pword
  const p_hash = sodium.crypto_pwhash_str(pwords[i],
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE
  );

  console.log(`user is: ${users[i].username}`);
  // add to user
  users[i].password = p_hash;
  console.log(users[i].username);
  console.log(users[i].password);
}

await client.queryObject`INSERT INTO members (username, password_hash, incense_points) VALUES(${users[0].username}, ${users[0].password}, 10);`;
await client.queryObject`INSERT INTO members (username, password_hash, incense_points) VALUES(${users[1].username}, ${users[1].password}, 5);`;
await client.queryObject`INSERT INTO members (username, password_hash, incense_points) VALUES(${users[2].username}, ${users[2].password}, 2);`;
await client.queryObject`INSERT INTO members (username, password_hash, incense_points) VALUES(${users[3].username}, ${users[3].password}, 6);`;
