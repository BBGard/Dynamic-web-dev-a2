import { buildPostList, buildPostForm } from "/post-builder.js";
// import { buildPosts, buildPostForm } from "./posts.js";

// Global state to track logged in user, local posts, members, etc
let state = {
  currentUsername: null,
  currentMemberId: null,
  posts: {},
  members: {}
};

// Call setupForum() upon page load
window.addEventListener("DOMContentLoaded", setupForum);



function setupForum() {
  const postListElement = document.querySelector(".post-list");

  // Setup posts, state, etc
  fetchMembers()
  .then(() => fetchPosts())
  .then(() => updateLoginElements())
  // .then(() => buildPosts(state))
  .then(() => buildPostList(postListElement, state.posts))
  .then(() => saveState());
}


// Check if logged in and update login elements
async function updateLoginElements() {
  // Get session data
  const response = await fetch("/session");
  const data = await response.json();

  // Get DOM elements
  const loginBtn = document.querySelector("#login-btn");
  const joinButton = document.querySelector(".join-button");
  const favButton = document.querySelector("#favorites-btn");
  const profileBtn = document.querySelector("#profile-btn")

  // Check if already logged in
  if (data.username) {
    // Show username and add profile page redirect
    state.currentUsername = data.username;
    state.currentMemberId = data.id; // Member ID of logged in user

    loginBtn.childNodes[1].textContent = "Logout";
    profileBtn.childNodes[1].textContent = `${data.username}`;
    profileBtn.classList.remove("hidden");
    loginBtn.addEventListener("click", (event) => {
      console.log("click");
      event.preventDefault();
      window.location.href = "/logout";
    });

    // Grab the favorites
    // console.log("grab the faves!");
    const memberId = state.members.find(
      (member) => member.username === state.currentUsername
    )?.member_id;
    const favRespons = await fetch(`/members/${memberId}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ memberId }),
    });

    state.favorites = await favRespons.json();
    // Hide join button
    joinButton.classList.add("hidden");
    favButton.classList.remove("hidden");

    // Add new post form to the DOM
    buildPostForm().then(() => {
      // Add listener to create post input box
      document
        .querySelector(".new-post-input")
        .addEventListener("click", (event) => {
          event.preventDefault();
          window.location.href = "/create-new-post";
        });
    });
  } else {
    // Show login button and add login listener
    loginBtn.childNodes[1].textContent = "Login";
    loginBtn.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "/login";
    });

    // Add join listener to join button
    joinButton.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "/sign-up";
    })
  }
}

// Fetch members from server
async function fetchMembers() {
  const response = await fetch("/members");
  state.members = await response.json();
  // console.log(state.members);
}

// Fetch posts from server
async function fetchPosts() {
  const response = await fetch("/posts");
  state.posts = await response.json();
  // console.log(state.posts);
}

// Save the state to local storage, to retrieve from profile pages
function saveState() {
  console.log("state saved");
  localStorage.setItem("state", JSON.stringify(state));
}
