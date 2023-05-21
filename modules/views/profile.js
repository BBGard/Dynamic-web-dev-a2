import { refreshState, rebuildDOM } from "./post-builder.js";

// Grab the state from local storage
const state = JSON.parse(localStorage.getItem("state"));

// Call setupProfile() upon page load
window.addEventListener("DOMContentLoaded", setupProfile);

// Setup the page
async function setupProfile() {

  // Refresh and rebuild
  await refreshState(state);
  await rebuildDOM(state);
}
