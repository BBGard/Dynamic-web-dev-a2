let state;  // We'll get state in a min

// Function to build all DOM elements for a given post list
export async function buildPostList( postListElement, postList, currentState, sortMethod = "date-sort") {
  state = currentState;

  postListElement.innerHTML = "";

  // Sort the postList based on sortMethod
  switch (sortMethod) {
    case "alphabet-sort":
      // Sort alphabetically by post title
      postList.sort((a, b) => a.post_title.localeCompare(b.post_title));
      break;
    case "rating-sort":
      // Sort highest rated to lowest rated
      postList.sort((a, b) => b.post_rating - a.post_rating);
      break;
    case "author-sort":
      // Sort by author incense points
      postList.sort((a, b) => {
        const authorA = state.members.find(
          (member) => member.username === a.post_author
        );
        const authorB = state.members.find(
          (member) => member.username === b.post_author
        );
        return authorB.incense_points - authorA.incense_points;
      });
      break;
    case "date-sort":
      // Sort by post date
      postList.sort(
        (a, b) => new Date(b.post_created_at) - new Date(a.post_created_at)
      );
      break;
    default:
      // No sort method specified, sort by post date
      postList.sort(
        (a, b) => new Date(b.post_created_at) - new Date(a.post_created_at)
      );
      break;
  }

  // Setup sort icon
  const sortCard = document.querySelector(".sort-card");
  if (sortCard) {
    // Remove "selected-icon" class from other elements
    const selectedIcons = document.querySelectorAll(".selected-icon");
    selectedIcons.forEach((icon) => icon.classList.remove("selected-icon"));

    // Add "selected-icon" to the correct sort method
    const sortButton = document.querySelector(`#${sortMethod}`).parentElement;
    sortButton.classList.add("selected-icon");
  }

  // Build each post
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

// Create a vote link
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

// Create a post bar with author information
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

  const pointsIcon = document.createElement("span");
  pointsIcon.className = "material-symbols-outlined points-icon";
  pointsIcon.textContent = "spa";

  const postDate = document.createElement("p");
  const date = new Date(post.post_created_at);
  const formattedDate = date.toLocaleString();
  postDate.textContent = formattedDate;

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
  authorLink.appendChild(pointsIcon);
  authorLink.appendChild(authorPoints);
  authorLink.appendChild(postDate);
  authorBar.appendChild(authorLink);

  return authorBar;
}

// Create a post title
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

// Create a post bar with description
function createDescriptionBar(post) {
  const bottomBar = document.createElement("div");
  bottomBar.className = "post-bar bottom-bar";

  const postDescription = document.createElement("p");
  postDescription.textContent = post.post_description;
  bottomBar.appendChild(postDescription);

  return bottomBar;
}

// Create a favorite link
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

// Create a hide post icon
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

// Create a post element
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
    postFavorite(post.post_id, currentMemberId);
  });

  // Hide listener
  if (hidePostIcon) {
    hidePostIcon.addEventListener("click", (event) => {
      event.preventDefault();
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
      } else {
        // Update the DOM data for votes and incense points
        const voteCount = document.querySelector(`#post-${postId} .vote-count`);
        voteCount.textContent = updatedData.post_rating;

        const thisPostAuthor = state.members.find(
          (member) => member.member_id === postMemberId
        ).username;

        const memberPointsElements = document.querySelectorAll(`a.post-author`);

        // Loop over all memberPoints elements and update any with matching authors
        memberPointsElements.forEach((element) => {
          if (element.textContent.includes(thisPostAuthor)) {
            const memberPoints = element.querySelector(".author-points");
            memberPoints.textContent = updatedData.incense_points;
          }
        });
      }
    } else {
      // Redirect if needed
      if (response.redirected) {
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
      } else {



        // Update the icon
        const favIcon = document.querySelectorAll(
          `#post-${postId} .favorite-icon`
        );

        const favPostList = document.querySelector("#favorite-post-list");

        if (favIcon[0].classList.contains("filled")) {
          // Remove fill
          favIcon.forEach((icon) => {
            icon.classList.remove("filled");
          });

          // Remove from fav list
          if (favPostList) {
            const postToRemove = favPostList.querySelector(`#post-${postId}`);
            postToRemove.remove();
            console.log("removed");
          }

        } else {
          favIcon.forEach((icon) => {
            icon.classList.add("filled");
          });
          // TODO copy post add to favorite list
        }
        // TODO updateState?

        // // Update the icon
        // const favIcon = document.querySelector(
        //   `#post-${postId} .favorite-icon`
        // );
        // if (favIcon.classList.contains("filled")) {
        //   // Remove fill
        //   favIcon.classList.remove("filled");
        // } else {
        //   favIcon.classList.add("filled");
        // }
      }
    } else {
      // Redirect if needed
      if (response.redirected) {
        window.location.href = response.url;
      }
    }
  }
}

// Hides a post
async function hidePost(postId, memberId) {
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

      // If on the homepage, remove from view
      const homePostList = document.querySelector("#home-post-list");
      if (homePostList) {
        allPosts.forEach((post) => {
          post.remove();
        });
      }
    });
  } else {
    console.log("response not ok, handle this");
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
