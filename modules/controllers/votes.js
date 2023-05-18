import { client } from "../database/database.js";

// Create a vote linking a member_id to a post_id
export async function createVote(context) {
  const { postId, votingMemberId } = await context.request.body().value;

  // If no memberId or valid vote
  if (!votingMemberId || !postId) {
    context.response.status = 400;
    context.response.body = {
      error: "Invalid memberID or post ID.",
    };
    return { ok: false };
  }

  // Create a new vote
  const result = await client.queryObject`
  INSERT INTO votes (post_id, member_id)
  VALUES (${postId}, ${votingMemberId})`;

  console.log("Created a new vote");
  context.response.status = 201;
  context.response.body = {
    ok: true,
    success: true,
    message: "Vote added!",
  };
  return { ok: true };
}

// Gets the vote_id for a member and post
export async function getVoteID(context) {
  const { postId, votingMemberId } = await context.request.body().value;

  // If no memberId or valid vote
  if (!votingMemberId || !postId) {
    context.response.status = 400;
    context.response.body = {
      error: "Invalid memberID or post ID.",
    };
    return { ok: false };
  }

  const existingVote = await client.queryObject`
    SELECT vote_id
    FROM votes
    WHERE post_id = ${postId} AND member_id = ${votingMemberId}
  `;

  if (existingVote.rowCount === 0) {
    // console.log("haven't voted yet");
    return { ok: false, voteId: null };
  }

  // Return the voteId
  // console.log("already voted");
  return { ok: true, voteId: existingVote.rows[0].vote_id };
}
