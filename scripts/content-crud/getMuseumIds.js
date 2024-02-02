import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
var userID = "";

// Handle authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    userID = user;
  } else {
    // User is signed out
    console.log("User signed out");
  }
});
const museumContainer = document.getElementById("selectMuseum");
const artifactMuseumContainer = document.getElementById("selectArtifactMuseum");

document.getElementById("addEvent-btn").addEventListener("click", function () {
  setupGetMuseumIdsEventListener(userID);
});

document.getElementById("addArtifact-btn").addEventListener("click", function () {
  setupGetMuseumIdsEventListener(userID);
});

async function setupGetMuseumIdsEventListener(userID) {
  try {
    const response = await fetch(`http://localhost:8383/getmuseums`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${await userID.getIdToken()}`,
      },
    });

    const data = await response.json();

    console.log(data);
    // Clear existing content on the HTML page
        museumContainer.innerHTML = "";
        artifactMuseumContainer.innerHTML = "";

    // Iterate through the data array and append HTML content
    data.forEach(async function (museumData) {
      // Construct HTML content for each card
      const museumHTML = `
                    <option value="${museumData.id}">${museumData.nome}</option>
                    `;

      // Append the HTML content to the card container
      museumContainer.innerHTML += museumHTML;
      artifactMuseumContainer.innerHTML += museumHTML;
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}