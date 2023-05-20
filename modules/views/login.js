const loginForm = document.getElementById("login-form");
const usernameField = document.getElementById("username-field");
const passwordField = document.getElementById("password-field");
const errorMessage = document.getElementById("error-message");
const cancelBtn = document.getElementById("cancel-btn");

// Handle the form submission
async function handleLogin(event) {
  event.preventDefault();

  // Check form validity
  if (!loginForm.checkValidity()) {
    // Display error message for invalid fields
    errorMessage.textContent = "Please fill out all fields.";
    return;
  }

  const username = usernameField.value;
  const password = passwordField.value;

  // Attempt login
  try {
    const response = await fetch("/login", {
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
};

// Cancel button handler
cancelBtn.addEventListener("click", (event) => {
  event.preventDefault();
  // console.log("Cancel clicked");
  window.location.href = "/";
});

// Login form submit handler
loginForm.addEventListener("submit", async (event) => {
  handleLogin(event);
});

// Handle enter key to submit
const handleKeyPress = async (event) => {
  if (event.key === "Enter") {
    handleLogin(event);
  }
};

// Keypress listsners
usernameField.addEventListener("keypress", handleKeyPress);
passwordField.addEventListener("keypress", handleKeyPress);
