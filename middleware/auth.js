import sodium from "https://deno.land/x/sodium@0.2.0/basic.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";


// Generate a random 32-byte salt for password hashing
const salt = sodium.crypto_pwhash_SALTBYTES;
const passwordSalt = sodium.randombytes_buf(salt);

// Hash the password with the given salt
function hashPassword(password) {
  const hash = sodium.crypto_pwhash_str(
    password,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    passwordSalt
  );
  return hash;
}

// Check if a password matches its hashed value
function verifyPassword(password, hash) {
  return sodium.crypto_pwhash_str_verify(hash, password);
}

// Add a new user to the database
export async function addUser(client, username, password) {
  const hashedPassword = hashPassword(password);
  await client.queryObject(
    "INSERT INTO users (username, password) VALUES ($1, $2)",
    username,
    hashedPassword
  );
}

// Get a user by their username
export async function getUserByUsername(client, username) {
  const result = await client.queryObject(
    "SELECT id, username, password FROM users WHERE username = $1",
    username
  );
  return result.rows[0];
}
