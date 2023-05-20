const state = JSON.parse(localStorage.getItem("state"));

export async function buildPostList(postListElement, postList, sortMethod = "date") {
  console.log("Post builder");

  postListElement.innerHTML = "";

  console.log("Sort method: ");
  console.log(sortMethod);
  // Sort the postList based on sortMethod
switch (sortMethod) {
  case 'alphabetically':
    // Sort alphabetically by post title
    postList.sort((a, b) => a.post_title.localeCompare(b.post_title));
    break;
  case 'rating':
    // Sort highest rated to lowest rated
    postList.sort((a, b) => b.post_rating - a.post_rating);
    break;
  case 'authorPoints':
    // Sort by author incense points
    postList.sort((a, b) => {
      const authorA = state.members.find((member) => member.username === a.post_author);
      const authorB = state.members.find((member) => member.username === b.post_author);
      return authorB.incense_points - authorA.incense_points;
    });
    break;
  case 'date':
    // Sort by post date
    postList.sort((a, b) => new Date(b.post_created_at) - new Date(a.post_created_at));
    break;
  default:
    // No sort method specified, sort by post date
    postList.sort((a, b) => new Date(b.post_created_at) - new Date(a.post_created_at));
    break;
}

  for (let post of postList) {
    // Get the posts author
    const postAuthor = state.members.find(
      (member) => member.username === post.post_author
    );

    // Check post author matches current user
    const isMyPost = postAuthor.username === state.currentUsername;

    const li = createPostElement(
      post,
      postAuthor,
      state.currentMemberId,
      isMyPost
    );
    postListElement.appendChild(li);
  }
}

// Helper function to create a vote link
function createVoteLink(href, className, arrowText) {
  const voteLink = document.createElement("a");
  voteLink.href = href;
  voteLink.className = className;

  const voteArrow = document.createElement("span");
  voteArrow.className = "material-symbols-outlined vote-arrow";
  voteArrow.textContent = arrowText;

  voteLink.appendChild(voteArrow);
  return voteLink;
}

// Helper function to create a post bar with author information
function createAuthorBar(post) {
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
    console.log("Couldn't find a matching member.");
    authorPoints.textContent = "0 points";
  }

  authorLink.appendChild(authorIcon);
  authorLink.appendChild(username);
  authorLink.appendChild(authorPoints);
  authorBar.appendChild(authorLink);

  return authorBar;
}

// Helper function to create a post title
function createPostTitle(post) {
  const postTitle = document.createElement("a");
  const isValidURL =
    post.post_url.startsWith("http://") || post.post_url.startsWith("https://");
  postTitle.href = isValidURL ? post.post_url : `http://${post.post_url}`;
  postTitle.target = "_blank";
  postTitle.className = "post-title";

  const postTitleContent = document.createTextNode(post.post_title);

  // Styling for hidden post
  if (post.post_hidden) {
    postTitleContent.textContent += " (hidden)";
    postTitle.classList.add("italic");
  }

  postTitle.appendChild(postTitleContent);

  return postTitle;
}

// Helper function to create a post bar with description
function createDescriptionBar(post) {
  const bottomBar = document.createElement("div");
  bottomBar.className = "post-bar bottom-bar";

  const postDescription = document.createElement("p");
  postDescription.textContent = post.post_description;
  bottomBar.appendChild(postDescription);

  return bottomBar;
}

// Helper function to create a favorite link
function createFavoriteLink(post) {
  const favoriteLink = document.createElement("a");
  favoriteLink.href = "#";
  favoriteLink.className = "favorite-link";

  const favIcon = document.createElement("span");
  favIcon.className = "material-symbols-outlined favorite-icon";
  favIcon.textContent = "favorite";

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

  return favoriteLink;
}

// Helper function to create a hide post icon
function createHidePostIcon(post) {
  const hideLink = document.createElement("a");
  hideLink.href = "#";
  hideLink.className = "hide-link";

  const hideIcon = document.createElement("span");
  hideIcon.className = "material-symbols-outlined hide-icon";

  const hideText = document.createElement("p");

  if (post.post_hidden) {
    hideIcon.textContent = "visibility";
    hideText.textContent = "Show Post";
  } else {
    hideIcon.textContent = "visibility_off";
    hideText.textContent = "Hide Post";
  }

  hideLink.append(hideIcon);
  hideLink.append(hideText);

  return hideLink;
}

// Helper function to create a post element
function createPostElement(post, matchingMember, currentMemberId, isMyPost) {
  const li = document.createElement("li");
  li.className = "card post";
  li.id = `post-${post.post_id}`;

  const voteBar = document.createElement("div");
  voteBar.className = "vote-bar";

  const upvoteLink = createVoteLink("#", "vote-button", "arrow_drop_up");
  const downvoteLink = createVoteLink("#", "vote-button", "arrow_drop_down");

  const voteCount = document.createElement("p");
  voteCount.className = "vote-count";
  voteCount.textContent = post.post_rating;

  voteBar.appendChild(upvoteLink);
  voteBar.appendChild(voteCount);
  voteBar.appendChild(downvoteLink);

  li.appendChild(voteBar);

  const postContent = document.createElement("div");
  postContent.className = "post-content";

  const authorBar = createAuthorBar(post);
  postContent.appendChild(authorBar);

  const titleBar = document.createElement("div");
  titleBar.className = "post-bar title-bar";

  const postTitle = createPostTitle(post);
  titleBar.appendChild(postTitle);
  postContent.appendChild(titleBar);

  const bottomBar = createDescriptionBar(post);
  postContent.appendChild(bottomBar);

  const favoriteBar = document.createElement("div");
  favoriteBar.className = "post-bar favorite-bar";

  const favoriteLink = createFavoriteLink(post);
  favoriteBar.append(favoriteLink);

  // Check if it's my post, add a hide post button
  let hidePostIcon;
  if (isMyPost) {
    hidePostIcon = createHidePostIcon(post);
    favoriteBar.append(hidePostIcon);

    favoriteBar.classList.add("my-post");
    voteBar.classList.add("my-post");

  }

  postContent.append(favoriteBar);

  li.appendChild(postContent);

  // Add event listeners for voting
  const postMemberId = matchingMember ? matchingMember.member_id : null;

  upvoteLink.addEventListener("click", (event) => {
    event.preventDefault();
    postVote(post.post_id, "up", postMemberId, currentMemberId);
  });

  downvoteLink.addEventListener("click", (event) => {
    event.preventDefault();
    postVote(post.post_id, "down", postMemberId, currentMemberId);
  });

  // Favorite listener
  favoriteLink.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("fav clicked");
    postFavorite(post.post_id, currentMemberId);
  });

  // Hide listener
  if (hidePostIcon) {
    hidePostIcon.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("hide clicked");
      hidePost(post.post_id, currentMemberId);
    });
  }

  return li;
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

// Send favorite to server
async function postFavorite(postId, memberId) {
  const favoriteData = { postId, memberId };
  const response = await fetch(`/members/${memberId}/favorite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(favoriteData),
  });

  // Check for json response
  const contentType = response.headers.get("Content-Type");

  if (response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const updatedData = await response.json();

      // Check for any errors
      if (updatedData.hasOwnProperty("error")) {
        console.log("Error: Unable to add favorite.");
        // TODO: Show an error message to the user
      } else {
        // Update the icon
        const favIcon = document.querySelector(
          `#post-${postId} .favorite-icon`
        );
        if (favIcon.classList.contains("filled")) {
          // Remove fill
          favIcon.classList.remove("filled");
        } else {
          favIcon.classList.add("filled");
        }
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

// Hides a post
async function hidePost(postId, memberId) {
  console.log("hiding (or unhiding) a post");
  const postData = { postId, memberId };
  const response = await fetch(`/posts/${postId}/hide`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (response.ok) {

    // Update icons and text for ALL matching posts
    const allPosts = document.querySelectorAll(`#post-${postId}`);

    allPosts.forEach((post) => {
      // Update the icon
      const hideIcon = post.querySelector(".hide-icon");
      const postTitle = post.querySelector(".post-title");
      const hideText = post.querySelector("a.hide-link > p");

      if (hideIcon.textContent === "visibility") {
        hideIcon.textContent = "visibility_off";
        postTitle.textContent = postTitle.textContent.replace(" (hidden)", "");
        postTitle.classList.remove("italic");
        hideText.textContent = "Hide Post";
      } else {
        hideIcon.textContent = "visibility";
        postTitle.textContent += " (hidden)";
        postTitle.classList.add("italic");
        hideText.textContent = "Show Post";
      }
    });
  } else {
    console.log("respons not ok, handle this");
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
