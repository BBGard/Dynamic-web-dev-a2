
// Check if logged in and update login button
async function updateLoginButton() {
  const response = await fetch("/session");
  const data = await response.json();
  const loginBtn = document.querySelector("#login-btn");

  // Check if already logged in
  if (data.loggedIn) {
    // Show username and add logout listener
    loginBtn.childNodes[1].textContent = `${data.username}`;
    loginBtn.addEventListener("click", async () => {
      await fetch("/logout", { method: "POST" });
      location.reload();
    });
  } else {
    // Show login button and add login listener
    loginBtn.childNodes[1].textContent = "Login";
    loginBtn.addEventListener("click", () => {
      window.location.href = "/login-form";
    });
  }
}

updateLoginButton();

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
