import sodium from "https://deno.land/x/sodium@0.2.0/basic.ts";
import { client } from "../database/database.js";

await sodium.ready;

// Generate a random 32-byte salt for password hashing
const salt = sodium.crypto_pwhash_SALTBYTES;
const passwordSalt = sodium.randombytes_buf(salt);

// Hash the password with the given salt
export async function hashPassword(password) {
  // Salt
  // const passwordSalt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);

  // Pepper
  const p_hash = sodium.crypto_pwhash_str(password,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    // passwordSalt
  );
  // console.log(`Hashed: ${p_hash}`);

  return p_hash;
}

// Check if a password matches its hashed value
function verifyPassword(password, hash) {
  return sodium.crypto_pwhash_str_verify(hash, password);
}


// Get a user by their username
export async function getUserByUsername( username) {
  const result = await client.queryObject(
    "SELECT member_id, username, password_hash FROM members WHERE username = $1",
    username
  );

  return result.rows[0];
}

export async function loginUser( username, password) {
  // Check for username and password hash in db
  const result = await client.queryObject
    `SELECT member_id, username, password_hash FROM members WHERE username=${username}`
  ;

  // User not found error
  if(result.rows.length == 0 ) {
    // console.log("User not found");
    return { success: false, message: "User not found" };
  }
  else if(!verifyPassword(password, result.rows[0].password_hash)) {
    // console.log("Wrong pword");
    return { success: false, message: "Wrong password" };
  }
  else {
    // console.log("All good");
    return { success: true, username:username };
  }

}

export const requireAuthentication = async (context, next) => {
  // Retrieve the user session
  const loggedIn = await context.state.session.get("user");

  if (loggedIn) {
    // User is authenticated, proceed to the next middleware or route handler
    await next();
  } else {
    // User is not authenticated, redirect to login or show an error page
    console.log("your not supposed to be here, redirecting");
    // User is not authenticated, return 401 Unauthorized status
    context.response.status = 401;
    context.response.body = { "error": "Unauthorized" };
    context.response.redirect("/login");

  }
};
