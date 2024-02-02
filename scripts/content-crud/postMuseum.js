import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';

const firebaseConfig = {
    apiKey: "AIzaSyBSYqdUPccgMw9nCNZWZDJGGhnyMfU60bA",
    authDomain: "musenex.firebaseapp.com",
    projectId: "musenex",
    storageBucket: "musenex.appspot.com",
    messagingSenderId: "336050141576",
    appId: "1:336050141576:web:fe944c8abe98db8d13223d",
    measurementId: "G-Y0E5SSXWH3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage(app);
var userID = "";

// Handle authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        userID=user;
    } else {
        // User is signed out
        console.log('User signed out');
        // You may want to handle this case accordingly
    }
});

var form = document.getElementById('museum-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Collect input values from the user
    const formData = {
        category: document.getElementById('selectCategory').value,
        museumName: document.getElementById('museumName').value,
        descriptionPT: document.getElementById('descriptionPT').value,
        descriptionEng: document.getElementById('descriptionEng').value,
        address: document.getElementById('address').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        uid: userID.uid
        // Add other form fields as needed
    };

    // Create an array to store download URLs
    const downloadURLs = [];

    // Iterate through selected files and upload each to Firebase Storage
    const galleryFiles = document.getElementById('gallery').files;
    for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        const storageRef = ref(storage, 'images/' + file.name);

        try {
            // Upload the file to Firebase Storage
            await uploadBytes(storageRef, file);

            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURL(storageRef);

            // Add the download URL to the array
            downloadURLs.push(downloadURL);
        } catch (error) {
            console.error('Error uploading file:', error);
            // Handle the error as needed
        }
    }

    // Add the array of download URLs to the formData
    formData.gallery = downloadURLs;

    try {
        // Make a POST request to create a new postmuseum
        const response = await fetch('http://localhost:8383/postmuseum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${await userID.getIdToken()}`
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        $("#addMuseum-modal").modal("hide");
        $("#success-modal").modal("show");
        console.log('Postmuseum created successfully:', data);

        // Optionally, you can update the UI or perform other actions after creating a postmuseum
    } catch (error) {
        console.error('Error creating postmuseum:', error);
    }
});
