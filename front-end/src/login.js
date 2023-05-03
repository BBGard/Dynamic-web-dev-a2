// Setup login listeners
const loginBtn = document.getElementById('login-btn');
const cancelBtn = document.getElementById('cancel-btn');

loginBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  console.log("Login clicked");
  // TODO attempt login, add form verification

});

cancelBtn.addEventListener('click', (event) => {
  event.preventDefault();
  console.log("Cancel clicked");
  window.location.href = "/";
});
