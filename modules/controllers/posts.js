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
