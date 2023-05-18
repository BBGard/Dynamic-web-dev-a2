// Grab the state from local storage
const state = JSON.parse(localStorage.getItem("state"));
let myPosts;
let myVotes;
const myFavorites = state.favorites;
const memberId = state.members.find((member) => member.username === state.currentUsername)?.member_id;

// Call setupProfile() upon page load
window.addEventListener("DOMContentLoaded", setupProfile);

async function setupProfile() {
  getMyPosts()
    .then(() => getMyRatedPosts())
    .then(() => populateMyPosts())
    .then(() => populateRatedPosts())
    .then(() => populateFavoritePosts());
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
  console.log("posts got");
  console.log(myPosts);
}

// Fetch all rated posts belonging to current user
async function getMyRatedPosts() {

  const response = await fetch(`/myvotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ memberId }),
  });

  myVotes = await response.json();
  console.log("votes got");
  console.log(myVotes);
}


// Gets and displays all posts belonging to the current user
async function populateMyPosts() {
  const postList = document.querySelector("#my-post-list");
  postList.innerHTML = "";

  // TODO refactor this mad code copying!!!!!!
  for (let post of myPosts) {
    const li = document.createElement("li");
    li.className = "card post";
    li.id = `post-${post.post_id}`; // Set an id on the post

    const voteBar = document.createElement("div");
    voteBar.className = "vote-bar";

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

    const postContent = document.createElement("div");
    postContent.className = "post-content";

    const authorBar = document.createElement("div");
    authorBar.className = "post-bar author-bar";
    const authorLink = document.createElement("a");
    authorLink.href = "#";
    authorLink.className = "post-author";

    const authorIcon = document.createElement("span");
    authorIcon.className = "material-symbols-outlined author-icon";
    authorIcon.textContent = "face_6";
    const username = document.createTextNode(post.post_author);

    const authorPoints = document.createElement("p");
    authorPoints.className = "author-points";

    const matchingMember = state.members.find(
      (member) => member.username === post.post_author
    );
    if (matchingMember) {
      authorPoints.textContent = `${matchingMember.incense_points} points`;
    } else {
      console.log("couldn't find a matching member in posts.js");
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

    // Make sure url is legit link - should probably verify before creating a post
    if (
      !post.post_url.startsWith("http://") ||
      !post.post_url.startsWith("https://")
    ) {
      postTitle.href = `http://${post.post_url}`;
    } else {
      postTitle.href = post.post_url;
    }
    postTitle.target = "_blank";

    postTitle.className = "post-title";
    const postTitleContent = document.createTextNode(post.post_title);
    postTitle.appendChild(postTitleContent);
    titleBar.appendChild(postTitle);
    postContent.appendChild(titleBar);

    const bottomBar = document.createElement("div");
    bottomBar.className = "post-bar bottom-bar";

    const postDescription = document.createElement("p");
    postDescription.textContent = post.post_description;
    bottomBar.appendChild(postDescription);
    postContent.appendChild(bottomBar);

    const favoriteBar = document.createElement("div");
    favoriteBar.className = "post-bar favorite-bar";

    const favoriteLink = document.createElement("a");
    favoriteLink.href = "#";
    favoriteLink.className = "favorite-link";

    const favIcon = document.createElement("span");
    favIcon.className = "material-symbols-outlined favorite-icon";
    favIcon.textContent = "favorite";

    // Set the fav icons filled, if required
    if (
      state.favorites &&
      state.favorites.find((favorite) => favorite.post_id === post.post_id)
    ) {
      favIcon.classList.add("filled");
    }

    const favText = document.createElement("p");
    favText.textContent = "Favorite";

    favoriteLink.append(favIcon);
    favoriteLink.append(favText);
    favoriteBar.append(favoriteLink);
    postContent.append(favoriteBar);

    li.appendChild(postContent);
    postList.append(li);

    // Add event listeners for voting
    const postMemberId = matchingMember.member_id; // Member ID of post author
    let currentMemberId;
    // If logged in, grab the id - code smell - get the id when setting up state?
    if (state.currentUsername) {
      const currentMember = state.members.find(
        (member) => member.username === state.currentUsername
      );
      currentMemberId = currentMember.member_id; // Member ID of logged in user
    }

    upvoteLink.addEventListener("click", (event) => {
      event.preventDefault();

      postVote(post.post_id, "up", postMemberId, currentMemberId);
    });
    downvoteLink.addEventListener("click", (event) => {
      event.preventDefault();
      postVote(post.post_id, "down", postMemberId, currentMemberId);
    });

    // Event listener for
    favoriteLink.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("fav clicked");
      postFavorite(post.post_id, currentMemberId);
    });

  }
}

async function populateFavoritePosts() {
  console.log("todo...this");
  console.log(myPosts);
  console.log(myFavorites);
  const postList = document.querySelector("#favorite-post-list");
  postList.innerHTML = "";

  // TODO refactor this mad code copying!!!!!!
  for (let post of myFavorites) {
    const li = document.createElement("li");
    li.className = "card post";
    li.id = `post-${post.post_id}`; // Set an id on the post

    const voteBar = document.createElement("div");
    voteBar.className = "vote-bar";

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

    const postContent = document.createElement("div");
    postContent.className = "post-content";

    const authorBar = document.createElement("div");
    authorBar.className = "post-bar author-bar";
    const authorLink = document.createElement("a");
    authorLink.href = "#";
    authorLink.className = "post-author";

    const authorIcon = document.createElement("span");
    authorIcon.className = "material-symbols-outlined author-icon";
    authorIcon.textContent = "face_6";
    const username = document.createTextNode(post.post_author);

    const authorPoints = document.createElement("p");
    authorPoints.className = "author-points";

    const matchingMember = state.members.find(
      (member) => member.username === post.post_author
    );
    if (matchingMember) {
      authorPoints.textContent = `${matchingMember.incense_points} points`;
    } else {
      console.log("couldn't find a matching member in posts.js");
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

    // Make sure url is legit link - should probably verify before creating a post
    if (
      !post.post_url.startsWith("http://") ||
      !post.post_url.startsWith("https://")
    ) {
      postTitle.href = `http://${post.post_url}`;
    } else {
      postTitle.href = post.post_url;
    }
    postTitle.target = "_blank";

    postTitle.className = "post-title";
    const postTitleContent = document.createTextNode(post.post_title);
    postTitle.appendChild(postTitleContent);
    titleBar.appendChild(postTitle);
    postContent.appendChild(titleBar);

    const bottomBar = document.createElement("div");
    bottomBar.className = "post-bar bottom-bar";

    const postDescription = document.createElement("p");
    postDescription.textContent = post.post_description;
    bottomBar.appendChild(postDescription);
    postContent.appendChild(bottomBar);

    const favoriteBar = document.createElement("div");
    favoriteBar.className = "post-bar favorite-bar";

    const favoriteLink = document.createElement("a");
    favoriteLink.href = "#";
    favoriteLink.className = "favorite-link";

    const favIcon = document.createElement("span");
    favIcon.className = "material-symbols-outlined favorite-icon";
    favIcon.textContent = "favorite";

    // Set the fav icons filled, if required
    if (
      state.favorites &&
      state.favorites.find((favorite) => favorite.post_id === post.post_id)
    ) {
      favIcon.classList.add("filled");
    }

    const favText = document.createElement("p");
    favText.textContent = "Favorite";

    favoriteLink.append(favIcon);
    favoriteLink.append(favText);
    favoriteBar.append(favoriteLink);
    postContent.append(favoriteBar);

    li.appendChild(postContent);
    postList.append(li);

    // Add event listeners for voting
    const postMemberId = matchingMember.member_id; // Member ID of post author
    let currentMemberId;
    // If logged in, grab the id - code smell - get the id when setting up state?
    if (state.currentUsername) {
      const currentMember = state.members.find(
        (member) => member.username === state.currentUsername
      );
      currentMemberId = currentMember.member_id; // Member ID of logged in user
    }

    upvoteLink.addEventListener("click", (event) => {
      event.preventDefault();

      postVote(post.post_id, "up", postMemberId, currentMemberId);
    });
    downvoteLink.addEventListener("click", (event) => {
      event.preventDefault();
      postVote(post.post_id, "down", postMemberId, currentMemberId);
    });

    // Event listener for
    favoriteLink.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("fav clicked");
      postFavorite(post.post_id, currentMemberId);
    });

  }
}

async function populateRatedPosts() {
  const postList = document.querySelector("#rated-post-list");
  postList.innerHTML = "";

  // TODO refactor this mad code copying!!!!!!
  for (let post of myVotes) {
    const li = document.createElement("li");
    li.className = "card post";
    li.id = `post-${post.post_id}`; // Set an id on the post

    const voteBar = document.createElement("div");
    voteBar.className = "vote-bar";

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

    const postContent = document.createElement("div");
    postContent.className = "post-content";

    const authorBar = document.createElement("div");
    authorBar.className = "post-bar author-bar";
    const authorLink = document.createElement("a");
    authorLink.href = "#";
    authorLink.className = "post-author";

    const authorIcon = document.createElement("span");
    authorIcon.className = "material-symbols-outlined author-icon";
    authorIcon.textContent = "face_6";
    const username = document.createTextNode(post.post_author);

    const authorPoints = document.createElement("p");
    authorPoints.className = "author-points";

    const matchingMember = state.members.find(
      (member) => member.username === post.post_author
    );
    if (matchingMember) {
      authorPoints.textContent = `${matchingMember.incense_points} points`;
    } else {
      console.log("couldn't find a matching member in posts.js");
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

    // Make sure url is legit link - should probably verify before creating a post
    if (
      !post.post_url.startsWith("http://") ||
      !post.post_url.startsWith("https://")
    ) {
      postTitle.href = `http://${post.post_url}`;
    } else {
      postTitle.href = post.post_url;
    }
    postTitle.target = "_blank";

    postTitle.className = "post-title";
    const postTitleContent = document.createTextNode(post.post_title);
    postTitle.appendChild(postTitleContent);
    titleBar.appendChild(postTitle);
    postContent.appendChild(titleBar);

    const bottomBar = document.createElement("div");
    bottomBar.className = "post-bar bottom-bar";

    const postDescription = document.createElement("p");
    postDescription.textContent = post.post_description;
    bottomBar.appendChild(postDescription);
    postContent.appendChild(bottomBar);

    const favoriteBar = document.createElement("div");
    favoriteBar.className = "post-bar favorite-bar";

    const favoriteLink = document.createElement("a");
    favoriteLink.href = "#";
    favoriteLink.className = "favorite-link";

    const favIcon = document.createElement("span");
    favIcon.className = "material-symbols-outlined favorite-icon";
    favIcon.textContent = "favorite";

    // Set the fav icons filled, if required
    if (
      state.favorites &&
      state.favorites.find((favorite) => favorite.post_id === post.post_id)
    ) {
      favIcon.classList.add("filled");
    }

    const favText = document.createElement("p");
    favText.textContent = "Favorite";

    favoriteLink.append(favIcon);
    favoriteLink.append(favText);
    favoriteBar.append(favoriteLink);
    postContent.append(favoriteBar);

    li.appendChild(postContent);
    postList.append(li);

    // Add event listeners for voting
    const postMemberId = matchingMember.member_id; // Member ID of post author
    let currentMemberId;
    // If logged in, grab the id - code smell - get the id when setting up state?
    if (state.currentUsername) {
      const currentMember = state.members.find(
        (member) => member.username === state.currentUsername
      );
      currentMemberId = currentMember.member_id; // Member ID of logged in user
    }

    upvoteLink.addEventListener("click", (event) => {
      event.preventDefault();

      postVote(post.post_id, "up", postMemberId, currentMemberId);
    });
    downvoteLink.addEventListener("click", (event) => {
      event.preventDefault();
      postVote(post.post_id, "down", postMemberId, currentMemberId);
    });

    // Event listener for
    favoriteLink.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("fav clicked");
      postFavorite(post.post_id, currentMemberId);
    });

  }
}
