import { client } from "../database/database.js";
import { hashPassword } from "../middleware/auth.js";

// Get members from the db
export async function getMembers(context) {
  const results =
    await client.queryObject`SELECT members.member_id, members.username, members.incense_points FROM members`;

  // Map members to an array
  context.response.body = results.rows.map((r) => ({
    ...r,
    _url: `/members/${r.member_id}`,
  })); // Add a new url to the member on the end
}

// Adds a new member to the database
export async function createMember(context) {
  const clientCredentials = await context.request.body().value;

  // Check for existing user
  const userExists =
    await client.queryObject`SELECT members.username FROM members WHERE members.username=${clientCredentials.username}`;

  // User exists
  if (userExists.rowCount != 0) {
    context.response.body = {
      success: false,
      message: "Username already exists.",
    };
    return;
  }

  // Otherwise hash the pword
  const hashedPassword = await hashPassword(clientCredentials.password);

  // Add new user credentials to db
  await client.queryObject`INSERT INTO members (username, password_hash, incense_points)
    VALUES (${clientCredentials.username}, ${hashedPassword}, 0)`;


  context.response.body = {
    success: true,
    message: "User created successfully.",
  };
}

// Update favorite posts for this member
export async function updateFavoritePosts(context) {
  const { postId, memberId } = await context.request.body().value;

  // If no memberId or postId
  if (!postId || !memberId) {
    context.response.status = 400;
    context.response.body = {
      success: false,
      error: "Invalid postId or memberID..",
    };
    return { ok: false };
  }

  // Check if the favorite already exists for this member
  const favoriteExists =
    await client.queryObject`SELECT favorites.member_id, favorites.post_id FROM favorites
WHERE favorites.member_id=${memberId} AND favorites.post_id=${postId}`;

  // Favorite exists, remove it
  if (favoriteExists.rowCount != 0) {
    const result = await client.queryObject`DELETE FROM favorites
WHERE member_id = ${memberId} AND post_id = ${postId};`;
    context.response.body = {
      success: true,
      message: "Favorite removed successfully.",
    };
    return { ok: true };
  } else {
    // No favorite yet, add one

    const result =
      await client.queryObject`INSERT INTO favorites (post_id, member_id)
  VALUES (${postId}, ${memberId})`;

    context.response.body = {
      success: true,
      message: "Favorite added successfully.",
    };
    return { ok: true };
  }
}

// Get all favorite posts for a member
export async function getFavoritePosts(context) {
  const { memberId } = await context.request.body().value;

  // Get all favorites for this member
  const results = await client.queryObject`
  SELECT DISTINCT posts.*
  FROM favorites
  JOIN posts ON favorites.post_id = posts.post_id
  WHERE favorites.member_id = ${memberId}`;

  // Map results to an array
  context.response.body = results.rows.map((r) => ({
    ...r,
  }));
}

// Get all positively voted posts for a member
export async function getVotedPosts(context) {
  const { memberId } = await context.request.body().value;

  // Get all voted posts, excluding hidden, unless they belong to the member
  const results = await client.queryObject`
  SELECT DISTINCT posts.*
  FROM votes
  JOIN posts ON votes.post_id = posts.post_id
  WHERE votes.member_id = ${memberId} AND votes.vote_value > 0 AND posts.post_hidden = false OR posts.member_id = ${memberId}`;

  // Map voted posts to an array
  context.response.body = results.rows.map((r) => ({
    ...r,
  }));
}
