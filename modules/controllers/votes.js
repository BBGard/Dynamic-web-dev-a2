import { client } from "../database/database.js";

// Create a vote linking a member_id to a post_id
export async function createVote(context, voteValue) {
  const { postId, votingMemberId } = await context.request.body().value;

  // If no memberId or valid vote
  if (!votingMemberId || !postId) {
    context.response.status = 400;
    context.response.body = {
      success: false,
      error: "Invalid memberID or post ID.",
    };
    return { ok: false };
  }

  // Create a new vote
  const result = await client.queryObject`
  INSERT INTO votes (post_id, member_id, vote_value)
  VALUES (${postId}, ${votingMemberId}, ${voteValue})`;

  if (result.rowCount != 0) {
    context.response.status = 201;
    context.response.body = {
      success: true,
      message: "Vote added!",
    };
    return { ok: true };
  } else {
    context.response.status = 500;
    context.response.body = {
      success: false,
      message: "Database error",
    };
    return { ok: false };
  }
}

// Gets the vote_id for a member and post
export async function getVoteID(context) {
  const { postId, votingMemberId } = await context.request.body().value;

  // If no memberId or valid vote
  if (!votingMemberId || !postId) {
    context.response.status = 400;
    context.response.body = {
      success: false,
      error: "Invalid memberID or post ID.",
    };
    return { ok: false };
  }

  // Get the specified vote_id
  const existingVote = await client.queryObject`
    SELECT vote_id
    FROM votes
    WHERE post_id = ${postId} AND member_id = ${votingMemberId}
  `;

  // Error
  if (existingVote.rowCount === 0) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      message: "Database error",
    };
    return { ok: false };
  }

  // Return the voteId
  return { ok: true, voteId: existingVote.rows[0].vote_id };
}
