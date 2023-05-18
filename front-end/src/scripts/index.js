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
  const response = await fetch("/session");
  const data = await response.json();
  const loginBtn = document.querySelector("#login-btn");

  // Check if already logged in
  // console.log(data.username);
  if (data.username) {
    // Show username and add logout listener
    state.username = data.username;
    loginBtn.childNodes[1].textContent = `${data.username}`;
    loginBtn.addEventListener("click", async () => {
      await fetch("/logout", { method: "POST" });
      location.reload();
    });

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
    loginBtn.addEventListener("click", () => {
      window.location.href = "/login";
    });
  }
}

// Fetch posts from server
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
