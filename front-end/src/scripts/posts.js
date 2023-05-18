// Build the post elements
export async function buildPosts(state) {
  const postList = document.querySelector("#post-list");
  postList.innerHTML = "";

  for (let post of state.posts) {
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

    li.appendChild(postContent);
    postList.append(li);

    // Add event listeners for voting
    const postMemberId = matchingMember.member_id; // Member ID of post author
    let votingMemberId;
    // If logged in, grab the id - code smell - get the id when setting up state?
    if (state.username) {
      const currentMember = state.members.find(
        (member) => member.username === state.username
      );
      votingMemberId = currentMember.member_id; // Member ID of logged in user
    }

    upvoteLink.addEventListener("click", (event) => {
      event.preventDefault();

      postVote(post.post_id, "up", postMemberId, votingMemberId);
    });
    downvoteLink.addEventListener("click", (event) => {
      event.preventDefault();
      postVote(post.post_id, "down", postMemberId, votingMemberId);
    });
  }
}

// Send vote to server
async function postVote(postId, vote, postMemberId, votingMemberId) {
  const voteData = { postId, vote, postMemberId, votingMemberId };
  const response = await fetch(`/posts/${postId}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(voteData),
  });

  // Check for json response
  const contentType = response.headers.get("Content-Type");

  if (response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const updatedData = await response.json();

      // Check for any errors
      if (updatedData.hasOwnProperty("error")) {
        console.log("You've already voted on this post!");
        //TODO show an error message
      } else {
        // Update the DOM data for votes and incense points
        const voteCount = document.querySelector(`#post-${postId} .vote-count`);
        voteCount.textContent = updatedData.post_rating;
        const memberPoints = document.querySelector(
          `#post-${postId} .author-points`
        );
        memberPoints.textContent = updatedData.incense_points;
      }
    } else {
      // Redirect if needed
      if (response.redirected) {
        console.log("redirected");
        window.location.href = response.url;
      }
    }
  }
}

// Adds a new post input form to the dom
export async function buildPostForm() {
  const newPostCard = document.createElement("div");
  newPostCard.className = "card new-post-card";

  const currentUserIcon = document.createElement("a");
  currentUserIcon.href = "#";
  currentUserIcon.className = "current-user-icon";

  const userIcon = document.createElement("span");
  userIcon.className = "material-symbols-outlined user-icon";
  userIcon.textContent = "face_6";

  currentUserIcon.appendChild(userIcon);

  const newPostInput = document.createElement("input");
  newPostInput.className = "new-post-input";
  newPostInput.type = "text";
  newPostInput.placeholder = "Create post";

  newPostCard.appendChild(currentUserIcon);
  newPostCard.appendChild(newPostInput);

  const container = document.querySelector(".container");
  container.insertBefore(newPostCard, container.firstChild);
}
