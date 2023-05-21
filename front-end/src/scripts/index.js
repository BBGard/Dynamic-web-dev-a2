import { buildPostList, buildPostForm, refreshState, rebuildDOM } from "/post-builder.js";

// Global state to track logged in user, local posts, members, etc
let state = {
  currentUsername: null,
  currentMemberId: null,
  posts: {},
  members: {},
  currentSort: "date-sort",
};

// Grab some UI elements
const postListElement = document.querySelector(".post-list");
const loginBtn = document.querySelector("#login-btn");
const joinButton = document.querySelector(".join-button");
const favButton = document.querySelector("#favorites-btn");
const profileBtn = document.querySelector("#profile-btn");
const sortBtns = document.querySelectorAll(".sort-btn");

// Setup the homepage posts, buttons, etc
async function setupForum() {
  // Setup posts, state, etc
  await getSession();
  await refreshState(state);
  await updateLoginElements();
  await rebuildDOM(state);
}

// Get the current session if any (check if user is logged in)
async function getSession() {
  // Get session data
  const response = await fetch("/session");
  const data = await response.json();

  // Show username, chnage button behaviour
  if (data.username) {
    state.currentUsername = data.username;
    state.currentMemberId = data.id; // Member ID of logged in user

    loginBtn.childNodes[1].textContent = "Logout";
    profileBtn.childNodes[1].textContent = `${data.username}`;
    profileBtn.classList.remove("hidden");
    loginBtn.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "/logout";
    });

    // Hide join button
    joinButton.classList.add("hidden");
    favButton.classList.remove("hidden");
  }

}

// Check if logged in and update login elements
async function updateLoginElements() {
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

  // If already logged in
  if (state.currentUsername) {

    // Grab the favorites
    const memberId = state.currentMemberId;
    const favRespons = await fetch(`/members/${memberId}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ memberId }),
    });

    // state.favorites = await favRespons.json();
    // await buildPostList(postListElement, state.posts, state.sortMethod);
  } else {
    // Show login button and add login listener
    loginBtn.childNodes[1].textContent = "Login";
    loginBtn.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "/login-page";
    });

    // Add listener to join button
    joinButton.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "/sign-up";
    });
  }

  // Add listeners for sorting buttons
  sortBtns.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      event.preventDefault();
      const selectedIcon = btn.querySelector(".sort-icon");

      // Get the sorting method from the icons id attribute
      const sortMethod = selectedIcon.getAttribute("id");

      // Sort and rebuild posts
      state.currentSort = sortMethod;
      await buildPostList(postListElement, state.posts, sortMethod);
    });
  });
}

// // Fetch members from server
// async function fetchMembers() {
//   const response = await fetch("/members");
//   state.members = await response.json();
// }

// // Fetch posts from server
// async function fetchPosts() {
//   const memberId = state.currentMemberId;
//   const response = await fetch("/posts", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ memberId }),
//   });
//   state.posts = await response.json();
// }

// // Save the state to local storage, to retrieve from profile pages
// function saveState() {
//   localStorage.setItem("state", JSON.stringify(state));
// }

await setupForum();
