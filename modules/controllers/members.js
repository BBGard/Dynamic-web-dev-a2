import { client } from "../database/database.js";
import { hashPassword } from "../middleware/auth.js";

// Get member names from the db
export async function getMembers(context) {
  const results =
    await client.queryObject`SELECT members.member_id, members.username, members.incense_points FROM members`;

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

    // Check for existing user
    const userExists =
      await client.queryObject`SELECT members.username FROM members WHERE members.username=${context.username}`;

    if (userExists.rowCount != 0) {
      console.log("That username exists!");
      throw new Error("Username already exists.");
    }

    const hashedPassword = await hashPassword(clientCredentials.password);
    // console.log(`Hashed_here: ${hashedPassword}`);

    await client.queryObject`INSERT INTO members (username, password_hash, incense_points)
    VALUES (${clientCredentials.username}, ${hashedPassword}, 0)`;
    console.log("New user created, check the db");
    context.response.body = {
      success: true,
      message: "User created successfully.",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    context.response.body = {
      success: false,
      message: "Failed to create user.",
    };
  }
}

// Update favorite posts for this member
export async function updateFavoritePosts(context) {
  const { postId, memberId } = await context.request.body().value;
  // console.log("in the db function");

  // If no memberId or postId
  if (!postId || !memberId) {
    context.response.status = 400;
    context.response.body = {
      error: "Invalid postId or memberID..",
    };
    return { ok: false };
  }

  try {
    // Check if the favorite exists for this member
    const favoriteExists =
      await client.queryObject`SELECT favorites.member_id, favorites.post_id FROM favorites
WHERE favorites.member_id=${memberId} AND favorites.post_id=${postId}`;

    // console.log("done");
    // console.log(favoriteExists);

    // No fav yet, add one
    if (favoriteExists.rowCount === 0) {
      const result =
        await client.queryObject`INSERT INTO favorites (post_id, member_id)
  VALUES (${postId}, ${memberId})`;

      // console.log("inserted");
      // console.log(result);
      context.response.body = {
        message: "Favorite added successfully.",
      };
      return { ok: true };
    } else {
      // favorite exists, remove
      const result = await client.queryObject`DELETE FROM favorites
  WHERE member_id = ${memberId} AND post_id = ${postId};`;
      // console.log("deleted");
      // console.log(result);
      context.response.body = {
        message: "Favorite removed successfully.",
      };
      return { ok: true };
    }
  } catch (error) {
    console.log("error updating favorites");
    context.response.status = 500; // Set appropriate status code for the error
    context.response.body = {
      error: "Error updating favorites.",
    };
    return { ok: false };
  }
}

// Get all favorite posts for a member
export async function getFavoritePosts(context) {
  const { memberId } = await context.request.body().value;

  // const results =
  //   await client.queryObject`SELECT * FROM favorites WHERE member_id = ${memberId}`;
  const results = await client.queryObject`
  SELECT posts.*
  FROM favorites
  JOIN posts ON favorites.post_id = posts.post_id
  WHERE favorites.member_id = ${memberId}
`;

  // Map favs to an array
  context.response.body = results.rows.map((r) => ({
    ...r,
  }));
}

// Get all voted posts for a member
export async function getVotedPosts(context) {
  const { memberId } = await context.request.body().value;

  // const results =
  //   await client.queryObject`SELECT * FROM favorites WHERE member_id = ${memberId}`;
  const results = await client.queryObject`
  SELECT posts.*
  FROM votes
  JOIN posts ON votes.post_id = posts.post_id
  WHERE votes.member_id = ${memberId}
`;

  // Map voted posts to an array
  context.response.body = results.rows.map((r) => ({
    ...r,
  }));
}
