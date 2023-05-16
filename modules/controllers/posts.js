import { client } from "../database/database.js";

// Get posts from the db
export async function getPosts(context) {
  // TODO update this to only fetch NOT hidden posts
  const results = await client.queryObject
    `SELECT posts.post_id, posts.post_title, posts.post_description, posts.post_created_at, posts.post_hidden, posts.post_rating, posts.member_id, posts.post_author
        FROM posts`;

  // Map posts to an array
  context.response.body = results.rows.map((r) => (
    { ...r, _url: `/posts/${r.post_id}` } // Add a new url to the post on the end
  ));
}
