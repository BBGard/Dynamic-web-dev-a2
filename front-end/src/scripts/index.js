// Global state to track logged in user and local posts
let username = null;
let posts = {};
let members = {};

// Call updateLoginButton() upon page load
window.addEventListener("DOMContentLoaded", setupForum);

function setupForum() {
  // Check if logged in
  updateLoginButton();

  // Setup posts, state, etc
  fetchMembers()
  .then(() => fetchPosts())
  // fetchPosts()
  .then(() => createPosts());
}


// Check if logged in and update login button
async function updateLoginButton() {
  const response = await fetch("/session");
  const data = await response.json();
  const loginBtn = document.querySelector("#login-btn");

  // Check if already logged in
  console.log(data.username);
  if (data.username) {
    // Show username and add logout listener
    username = data.username;
    loginBtn.childNodes[1].textContent = `${data.username}`;
    loginBtn.addEventListener("click", async () => {
      await fetch("/logout", { method: "POST" });
      location.reload();
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
  members = await response.json();
  console.log(members);
}

// updateLoginButton();

// Fetch posts from server
async function fetchPosts() {
  const response = await fetch("/posts");
  posts = await response.json();
  console.log(posts);

  // Build posts
  // createPosts();

  // Display/add posts to DOM
}

// Build the post elements
async function createPosts() {
  const postList = document.querySelector("#post-list");
  postList.innerHTML = '';

  // Move all this crap elsewhere?
  for(let post of posts) {
    const li = document.createElement('li');
    li.className = 'card post';

    const voteBar = document.createElement('div');
    voteBar.className = 'vote-bar';

    const upvoteLink = document.createElement("a");
    upvoteLink.href = "#";
    upvoteLink.className = "vote-button";
    const upvoteArrow = document.createElement("span");
    upvoteArrow.className = "material-symbols-outlined vote-arrow";
    upvoteArrow.textContent = "arrow_drop_up";
    upvoteLink.appendChild(upvoteArrow);
    voteBar.appendChild(upvoteLink);

    const voteCount = document.createElement("p");
    voteCount.className = "vote-count";
    voteCount.textContent = post.post_rating;
    voteBar.appendChild(voteCount);

    const downvoteLink = document.createElement("a");
    downvoteLink.href = "#";
    downvoteLink.className = "vote-button";
    const downvoteArrow = document.createElement("span");
    downvoteArrow.className = "material-symbols-outlined vote-arrow";
    downvoteArrow.textContent = "arrow_drop_down";
    downvoteLink.appendChild(downvoteArrow);
    voteBar.appendChild(downvoteLink);
    li.appendChild(voteBar);

    const postContent = document.createElement('div');
    postContent.className = 'post-content';

    const authorBar = document.createElement('div');
    authorBar.className = 'post-bar author-bar';
    const authorLink = document.createElement('a');
    authorLink.href = '#';
    authorLink.className = 'post-author';

    const authorIcon = document.createElement('span');
    authorIcon.className = 'material-symbols-outlined author-icon';
    authorIcon.textContent = 'face_6';
    const username = document.createTextNode(post.post_author);

    const authorPoints = document.createElement('p');
    authorPoints.className = 'author-points';

    if(members.hasOwnProperty(post.post_author)) {
      authorPoints.textContent = `${members[post.post_author].points} points`;
    } else {
      authorPoints.textContent = "0 points";
    }

    authorLink.appendChild(authorIcon);
    authorLink.appendChild(username);
    authorLink.appendChild(authorPoints);
    authorBar.appendChild(authorLink);
    postContent.appendChild(authorBar);

    const titleBar = document.createElement("div");
    titleBar.className = "post-bar title-bar";

    const postTitle = document.createElement("a");
    postTitle.href = "#";
    postTitle.className = "post-title";
    const postTitleContent = document.createTextNode(post.post_title);
    postTitle.appendChild(postTitleContent)
    titleBar.appendChild(postTitle);
    postContent.appendChild(titleBar);

    const bottomBar = document.createElement('div');
    bottomBar.className = 'post-bar bottom-bar';

    const postDescription = document.createElement('p');
    postDescription.textContent = post.post_description;
    bottomBar.appendChild(postDescription);
    postContent.appendChild(bottomBar);

    li.appendChild(postContent);
    postList.append(li);

    // Add event listeners for votes and titles, etc

  }
}

// // global state
// let username = null;
// let items = [];

// From Week 9 Example
// first we're going to make a request to see if we're logged in
// fetch("/api/whoami")
//   .then((res) => res.json())
//   .then((json) => {
//     console.log("JSON");
//     console.log(json);
//     if (json.username) {
//       loginSuccess(json.username);
//     } else {
//       document.body.append(loginForm);
//     }
//   });
