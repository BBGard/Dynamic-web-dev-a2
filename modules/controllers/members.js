import { client } from "../database/database.js";
import { hashPassword } from "../middleware/auth.js";

// Get member names from the db
export async function getMembers(context) {
  const results =
    await client.queryObject`SELECT members.member_id, members.username FROM members`;

  // Map members to an array
  context.response.body = results.rows.map((r) => ({
    ...r,
    _url: `/members/${r.member_id}`,
  })); // Add a new url to the member on the end
}

// Adds a new user to the database
export async function createMember(context) {
  try {
    const clientCredentials = await context.request.body().value;

    const hashedPassword = await hashPassword(clientCredentials.password);
    // console.log(`Hashed_here: ${hashedPassword}`);

    await client.queryObject`INSERT INTO members (username, password_hash, incense_points)
    VALUES (${clientCredentials.username}, ${hashedPassword}, 0)`;
    console.log("New user created, check the db");
    context.response.body = { success: true, message: "User created successfully." };
  } catch (error) {
    console.error("Error creating user:", error);
    context.response.body =  { success: false, message: "Failed to create user." };
  }
}
