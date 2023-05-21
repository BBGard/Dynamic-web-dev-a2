import { client } from "../database/database.js";
import { createVote, getVoteID } from "./votes.js";

// Get posts from the db
export async function getPosts(context) {




  // Return only visible (not hidden) posts
    const results = await client.queryObject`
    SELECT posts.post_id, posts.post_title, posts.post_description, posts.post_url, posts.post_created_at, posts.post_hidden, posts.post_rating, posts.member_id, posts.post_author
      FROM posts
      WHERE posts.post_hidden = false`;

  // Map posts to an array
  context.response.body = results.rows.map((r) => ({
    ...r,
    _url: `/posts/${r.post_id}`,
  })); // Add a new url to the post on the end
}

// Get posts for a particular member from the db
export async function getPostsForMember(context) {
  const { memberId } = await context.request.body().value;

  const results =
    await client.queryObject`SELECT posts.post_id, posts.post_title, posts.post_description, posts.post_url, posts.post_created_at, posts.post_hidden, posts.post_rating, posts.member_id, posts.post_author
        FROM posts WHERE member_id = ${memberId}`;

  // Map posts to an array
  context.response.body = results.rows.map((r) => ({
    ...r,
  }));
}

// Create a new post, add to db
export async function createPost(context) {
  // Check for json
  if (!context.request.hasBody) {
    context.response.status = 400;
    context.response.body = { error: "Expected a JSON object body" };
    return;
  }

  const post = await context.request.body("json").value;

  // Check for required fields
  if (!post.title || !post.url || !post.description) {
    context.response.status = 400;
    context.response.body = { error: "Requires a title, url, and description" };
    return;
  }

  // create new post
  const insertResults =
    await client.queryObject`INSERT INTO posts (post_title, post_description, post_url, post_author, member_id)
  VALUES (${post.title}, ${post.description}, ${post.url}, ${post.author}, ${post.id})`;

  context.response.status = 201;
}

// Upvote or downvote a post
export async function votePost(context) {
  const { postId, vote, postMemberId, votingMemberId } =
    await context.request.body().value;

  // If no memberId or valid vote
  if (!postMemberId || (vote !== "up" && vote !== "down")) {
    context.response.status = 400;
    context.response.body = {
      error: "Invalid vote value or memberID. Expected 'up' or 'down'.",
    };
    return;
  }

  // Check if the member has already voted on the post
  const existingVote = await getVoteID(context);

  if (existingVote.voteId != null) {
    context.response.body = {
      error: "You have already voted on this post.",
      ok: false,
    };
    return;
  }

  // Set numeric value for the vote
  const voteValue = vote === "up" ? 1 : vote === "down" ? -1 : 0;
  let updateResult;

  // Update the post_rating in the db
  if (voteValue !== 0) {
    updateResult = await client.queryObject`
    UPDATE posts
    SET post_rating = post_rating + ${voteValue}
    WHERE post_id = ${postId}
  `;
  }

  if (updateResult.rowCount === 0) {
    context.response.status = 404;
    context.response.body = { error: "Post not found" };
    return;
  }

  // All went well, update the members incence points
  const memberUpdateResult = await client.queryObject`
    UPDATE members
    SET incense_points = incense_points + ${voteValue}
    WHERE member_id = ${postMemberId}
  `;

  if (memberUpdateResult.rowCount === 0) {
    context.response.status = 404;
    context.response.body = { error: "Member ID not found" };
    return;
  }

  // Create a new Vote
  const newVoteResult = await createVote(context, voteValue);
  if (!newVoteResult.ok) {
    context.response.status = 400;
    context.response.body = { error: "Couldn't create vote??" };
    return;
  }
  // Get the new voteCount
    const [ratingResult, pointsResult] = await Promise.all([
    client.queryObject`SELECT post_rating FROM posts WHERE post_id = ${postId}`,
    client.queryObject`SELECT incense_points FROM members WHERE member_id = ${postMemberId}`,
  ]);

  if (ratingResult.rowCount === 0 || pointsResult.rowCount === 0) {
    context.response.status = 404;
    context.response.body = {
      error: "Something went wrong fetching the updated results",
    };
  } else {
    //Return the updated data for rating and incense points
    const postRating = ratingResult.rows[0].post_rating;
    const memberPoints = pointsResult.rows[0].incense_points;
    context.response.status = 200;
    context.response.body = {
      message: "Vote counted successfully",
      post_rating: postRating,
      incense_points: memberPoints,
    };
  }
}

// Toggles the post_hidden status for a post
export async function toggleHidePost(context) {

  // Validate everything
  if (!context.request.hasBody) {
    context.response.status = 400;
    context.response.body = { error: "Expected a JSON object body" };
    return;
  }

  const data = await context.request.body("json").value;

  if (!data.postId || !data.memberId) {
    context.response.status = 400;
    context.response.body = { error: "Requires a postId and memberId" };
    return;
  }

  // Toggle the hidden field
  const updateResult = await client.queryObject`UPDATE posts
    SET post_hidden = NOT post_hidden
    WHERE post_id = ${data.postId} AND member_id = ${data.memberId}`;

  context.response.status = 201;
}
