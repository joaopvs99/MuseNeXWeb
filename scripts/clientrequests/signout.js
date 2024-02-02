import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSYqdUPccgMw9nCNZWZDJGGhnyMfU60bA",

  authDomain: "musenex.firebaseapp.com",

  projectId: "musenex",

  storageBucket: "musenex.appspot.com",

  messagingSenderId: "336050141576",

  appId: "1:336050141576:web:fe944c8abe98db8d13223d",

  measurementId: "G-Y0E5SSXWH3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const displayName = document.getElementById("displayName");

auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    let fullName = user.displayName;

    let words = fullName.split(" ");

    let firstWord = words[0];
    let lastWord = words[words.length - 1];

    let modifiedText = `${firstWord} ${lastWord}`;

    displayName.textContent = modifiedText;
    console.log("User signed in, UID:", user.uid);
  } else {
    // User is signed out
    console.log("User signed out");
  }
});

var signOutButton = document.getElementById("btn-logout");

signOutButton.addEventListener("click", () => {
  // Sign out the current user10
  auth
    .signOut()
    .then(() => {
      $("#logout-modal").modal("hide");
      $("#redirect-modal").modal("show");

      setTimeout(() => {
        window.location.href = "../../index.html";
      }, 1500);
    })
    .catch((error) => {
      // An error happened.
      console.error("Error signing out:", error);
    });
});
