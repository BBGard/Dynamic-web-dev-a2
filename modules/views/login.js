const loginForm = document.getElementById("login-form");
const usernameField = document.getElementById("username-field");
const passwordField = document.getElementById("password-field");
const errorMessage = document.getElementById("error-message");
const cancelBtn = document.getElementById("cancel-btn");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("Login clicked");

  if (!loginForm.checkValidity()) {
    // Display error message for invalid fields
    errorMessage.textContent = "Please fill out all fields.";
    return;
  }

  const username = usernameField.value;
  const password = passwordField.value;

  // Attempt login
  try {
    const response = await fetch("/auth", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    // Server errors here
    if (!response.ok) {
      console.log(response);
      // throw new Error("Server error.");
    }

    const data = await response.json();

    if (data.success) {
      // Successful login, return home
      window.location.href = "/";
    } else {
      // Show error from server
      errorMessage.textContent = data.message;
    }
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.textContent = "An internal error has occurred. Please try again later.";
  }
});

cancelBtn.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Cancel clicked");
  window.location.href = "/";
});
