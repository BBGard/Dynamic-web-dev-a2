const loginBtn = document.querySelector("#login-btn");

async function updateLoginButton() {
  const response = await fetch("/api/session");
  const data = await response.json();

  if (data.loggedIn) {
    // Access text, leave the icon
    loginBtn.childNodes[1].textContent = `${data.username}`;
    loginBtn.addEventListener("click", async () => {
      await fetch("/api/logout", { method: "POST" });
      location.reload();
    });
  } else {
    loginBtn.childNodes[1].textContent = "Login";
    loginBtn.addEventListener("click", async () => {
      window.location.href = "/login";
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
