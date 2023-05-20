import { buildPostList } from "./post-builder.js";

// Grab the state from local storage
const state = JSON.parse(localStorage.getItem("state"));

let myPosts;  // Logged in members posts
let myVotes;  // Logged in members voted posts
const myFavorites = state.favorites;  // Logged in members favorited posts
const memberId = state.members.find((member) => member.username === state.currentUsername)?.member_id;

// Call setupProfile() upon page load
window.addEventListener("DOMContentLoaded", setupProfile);

// Setup the page
async function setupProfile() {
  // Grab appropriate lists
  const myPostsList = document.querySelector("#my-post-list");
  const myFavoritesList = document.querySelector("#favorite-post-list");
  const myVotesList = document.querySelector("#rated-post-list")

  // Get all post lists, build DOM posts
  getMyPosts()  // Get my posts
    .then(() => getMyVotes()) // get my voted posts
    .then(() => buildPostList(myPostsList, myPosts, state))
    .then(() => buildPostList(myVotesList, myVotes, state))
    .then(() => buildPostList(myFavoritesList, myFavorites, state))
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
}
