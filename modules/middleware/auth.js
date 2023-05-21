import sodium from "https://deno.land/x/sodium@0.2.0/basic.ts";
import { client } from "../database/database.js";

await sodium.ready;

// Hash a password using sodium
export async function hashPassword(password) {
  const p_hash = sodium.crypto_pwhash_str(
    password,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE
  );

  return p_hash;
}

// Check if a password matches its hashed value
function verifyPassword(password, hash) {
  return sodium.crypto_pwhash_str_verify(hash, password);
}

// Get a user by their username
export async function getUserByUsername(username) {
  const result = await client.queryObject(
    "SELECT member_id, username, password_hash FROM members WHERE username = $1",
    username
  );

  return result.rows[0];
}

export async function verifyUser(username, password) {
  // Check for username and password hash in db
  const result =
    await client.queryObject`SELECT member_id, username, password_hash FROM members WHERE username=${username}`;
  // User not found error
  if (result.rows.length == 0) {
    return { success: false, message: "User not found" };
  } else if (!verifyPassword(password, result.rows[0].password_hash)) {
    // Wrong pword
    return { success: false, message: "Wrong password" };
  } else {
    // Success, return the username
    return { success: true, username: username };
  }
}

// Checks if a user is authenticated before proceding to next handler
export async function requireAuthentication(context, next) {
  // Retrieve the user session
  const loggedIn = await context.state.session.get("user");

  if (loggedIn) {
    // User is authenticated, proceed to the next middleware or route handler
    await next();
  } else {
    // User is not authenticated, redirect to login page
    context.response.status = 401; // unauthorized
    context.response.body = { error: "Unauthorized" };
    context.response.redirect("/login-page");
    return;
  }
}

// Logs in a user
export async function login(context) {
  const clientCredentials = await context.request.body().value;

  // Attempt login
  const result = await verifyUser(
    clientCredentials.username,
    clientCredentials.password
  );

  if (result.success) {
    // Logged in
    context.response.body = result;

    // Set the session details
    await context.state.session.set("user", result.username);
    return;
  } else {
    // Error, maybe add some mopre to this
    context.response.body = result;
    return;
  }
}

// Logs a user out
export async function logout(context) {
  // Clear the session
  await context.state.session.set("user", undefined);
  // Clear the response body
  context.response.body = {};
  context.response.redirect("/");
}


// Checks if a user is logged in... returns the username and member_id
export async function session(context) {
  const loggedInUser = await context.state.session.get("user");
  let userId = null;

  // Move this?
  if (loggedInUser) {
    const member = await client.queryObject(
      "SELECT member_id FROM members WHERE username = $1",
      [loggedInUser]
    );

    if (member.rows.length > 0) {
      userId = member.rows[0].member_id;
    }
  }

  context.response.body = { username: loggedInUser, id: userId };
}
