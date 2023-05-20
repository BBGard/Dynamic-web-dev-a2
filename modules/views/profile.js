import { buildPostList } from "./post-builder.js";

// Grab the state from local storage
const state = JSON.parse(localStorage.getItem("state"));
let myPosts;
let myVotes;
const myFavorites = state.favorites;
const memberId = state.members.find((member) => member.username === state.currentUsername)?.member_id;

// Call setupProfile() upon page load
window.addEventListener("DOMContentLoaded", setupProfile);

async function setupProfile() {
  // Grab appropriate lists
  const myPostsList = document.querySelector("#my-post-list");
  const myFavoritesList = document.querySelector("#favorite-post-list");
  const myVotesList = document.querySelector("#rated-post-list")

  getMyPosts()  // Get my posts
    .then(() => getMyVotes()) // get my voted posts
    .then(() => buildPostList(myPostsList, myPosts))
    .then(() => buildPostList(myVotesList, myVotes))
    .then(() => buildPostList(myFavoritesList, myFavorites))
    // .then(() => populateFavoritePosts());
  //populateFavoritePosts
}

// Fetch all posts belonging to current user
async function getMyPosts() {

  const response = await fetch(`/myposts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ memberId }),
  });

  myPosts = await response.json();
  // console.log("posts got");
  // console.log(myPosts);
}

// Fetch all rated posts belonging to current user
async function getMyVotes() {

  const response = await fetch(`/myvotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ memberId }),
  });

  myVotes = await response.json();
  // console.log("votes got");
  // console.log(myVotes);
}
