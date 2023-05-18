import { buildPosts, buildPostForm } from "./posts.js";

// Global state to track logged in user, local posts, members, etc
let state = {
  username: null,
  posts: {},
  members: {}
};

// Call setupForum() upon page load
window.addEventListener("DOMContentLoaded", setupForum);



function setupForum() {
  // Check if logged in
  updateLoginElements();

  // Setup posts, state, etc
  fetchMembers()
  .then(() => fetchPosts())
  // fetchPosts()
  .then(() => buildPosts(state));
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

  // favButton.addEventListener("click", async (event) => {
  //   event.preventDefault();
  //   loadProfilePage();
  // })

  // Check if already logged in
  if (data.username) {
    // Show username and add profile page redirect
    state.username = data.username;
    loginBtn.childNodes[1].textContent = `${data.username}`;
    loginBtn.addEventListener("click", (event) => {
      console.log("click");
      event.preventDefault();
      window.location.href = "/profile";
    });

    // Hide join button
    joinButton.classList.add("hidden");
    favButton.classList.remove("hidden");

    // Add new post form to the DOM
    buildPostForm()
    .then(() => {
      // Add listener to create post input box
      document.querySelector(".new-post-input")
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

// // Loads the profile page
// async function loadProfilePage() {
//   const response = await fetch("/profile");

//   // Redirect if needed
//   if (response.redirected) {
//     console.log("redirected");
//     window.location.href = response.url;
//   }
// }

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
