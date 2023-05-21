const newPostForm = document.querySelector('#new-post-form');
const errorMessage = document.getElementById("error-message");

// Cancel button
document.querySelector(".cancel-button").addEventListener("click", (event) => {
  event.preventDefault();
  // Return home
  window.location.href = "/";
});

// Submit button
document.querySelector(".submit-button").addEventListener("click", async(event) => {
  event.preventDefault();

  if (!newPostForm.checkValidity()) {
    // Display error message for invalid fields
    errorMessage.textContent = "Please fill out all fields.";
    return;
  }

  // Clear previous error message
  errorMessage.textContent = "";

  // Grab the session data
  const response = await fetch("/session");
  const data = await response.json();

  // Get form input values
  const title = document.getElementById("post-title-field").value;
  const url = document.getElementById("post-url-field").value;
  const description = document.getElementById("post-text-field").value;
  const author = data.username;
  const id = data.id;

  // Create new post
  const post = {
    title,
    url,
    description,
    author,
    id
  };

  console.log("trying");
  try {

    const response = await fetch("/newpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    if (response.ok) {
      // Post created successfully, do something
      window.location.href = "/";
    } else {
      // Error creating post, handle the error
      console.error("Error creating post:", response.status);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
});
