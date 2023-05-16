// Build the post elements
export async function buildPosts(state) {
  const postList = document.querySelector("#post-list");
  postList.innerHTML = "";

  // Move all this crap elsewhere?
  for (let post of state.posts) {
    const li = document.createElement("li");
    li.className = "card post";

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

    if (state.members.hasOwnProperty(post.post_author)) {
      authorPoints.textContent = `${
        state.members[post.post_author].points
      } points`;
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

    // Make sure url is legit link - should probably verify before creating a post
    if (!post.post_url.startsWith("http://") || !post.post_url.startsWith("https://")) {
      postTitle.href=`http://${post.post_url}`;
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

    // Add event listeners for votes and titles, etc
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
