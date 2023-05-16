import { client } from "../database/database.js";

// Get member names from the db
export async function getMembers(context) {
  const results = await client.queryObject
    `SELECT members.member_id, members.username FROM members`;

  // Map members to an array
  context.response.body = results.rows.map((r) => (
    { ...r, _url: `/members/${r.member_id}` } // Add a new url to the member on the end
  ));
}
