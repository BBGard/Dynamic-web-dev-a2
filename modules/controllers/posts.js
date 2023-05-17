import { client } from "../database/database.js";

// Get posts from the db
export async function getPosts(context) {
  // TODO update this to only fetch NOT hidden posts
  const results = await client.queryObject
    `SELECT posts.post_id, posts.post_title, posts.post_description, posts.post_url, posts.post_created_at, posts.post_hidden, posts.post_rating, posts.member_id, posts.post_author
        FROM posts`;

  // Map posts to an array
  context.response.body = results.rows.map((r) => (
    { ...r, _url: `/posts/${r.post_id}` } // Add a new url to the post on the end
  ));
}

// Create a new post, add to db
export async function createPost(context) {
  if(!context.request.hasBody) {
    context.response.status = 400;
    context.response.body = {"error": "Expected a JSON object body"};
    return;
  }

  const post = await context.request.body('json').value;

  if(!post.title || !post.url || !post.description) {
    context.response.status = 400;
    context.response.body = {"error": "Requires a title, url, and description"};
    return;
  }

  const insertResults = await client.queryObject
  `INSERT INTO posts (post_title, post_description, post_url, post_author, member_id)
  VALUES (${post.title}, ${post.description}, ${post.url}, ${post.author}, ${post.id})`

  console.log(post);
  console.log("Created a new post");
  context.response.status = 201;
}

// Upvote or downvote a post
export async function votePost(context) {
  const postId = context.params.id;
  const { vote, memberId } = await context.request.body().value;
  // const vote = data.vote;
  // const memberId = data.memberId;
  console.log("My data");
  console.log(vote);
  console.log(memberId);

  if (vote !== "up" && vote !== "down") {
    context.response.status = 400;
    context.response.body = { "error": "Invalid vote value. Expected 'up' or 'down'." };
    return;
  }

  let updateResult;
  // Setup the rating
  if(vote === "up") {
    // console.log("Up vote");
    updateResult = await client.queryObject`
    UPDATE posts
    SET post_rating = post_rating + 1
    WHERE post_id = ${postId}
  `;
  }
  else if(vote === "down") {
    // console.log("minus 1");
    updateResult = await client.queryObject`
    UPDATE posts
    SET post_rating = post_rating - 1
    WHERE post_id = ${postId}
  `;
  }



  if (updateResult.rowCount === 0) {
    context.response.status = 404;
    context.response.body = { "error": "Post not found" };
    return;
  }

  // Get the new voteCount
  const result = await client.queryObject
  `SELECT post_rating FROM posts WHERE post_id = ${postId}`;
  // console.log("result");
  // console.log(result);

  if (result.rowCount === 0) {
    context.response.status = 404;
    context.response.body = { "error": "Post not found" };
  } else {
    const postRating = result.rows[0].post_rating;
    context.response.status = 200;
    context.response.body = { "message": "Vote counted successfully", "post_rating": postRating };
  }
}
