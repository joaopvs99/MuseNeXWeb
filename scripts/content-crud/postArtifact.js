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
    }
});

var form = document.getElementById('artifact-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Collect input values from the user
    const formData = {
        category: document.getElementById('selectCategoryArtifact').value,
        museumId: document.getElementById('selectArtifactMuseum').value,
        descriptionPT: document.getElementById('descriptionPTArtifact').value,
        descriptionEng: document.getElementById('descriptionEngArtifact').value,
        autor_id: document.getElementById('authorName').value,
        nome: document.getElementById('artifactName').value,
        uid: userID.uid
        
    };

    var downloadURL = "";

// Iterate through selected files and upload each to Firebase Storage
const galleryFile = document.getElementById('galleryArtifact').files[0];

const imageFile = galleryFile;
const imageStorageRef = ref(storage, 'images/' + imageFile.name);

try {
    // Upload the file to Firebase Storage
    await uploadBytes(imageStorageRef, imageFile);

    // Get the download URL of the uploaded image
    const imageDownloadURL = await getDownloadURL(imageStorageRef);

   
    downloadURL += imageDownloadURL;
} catch (error) {
    console.error('Error uploading file:', error);
   
}


    formData.gallery = downloadURL;

    var downloadAudioURL = "";
    const metadata = {
        contentType: 'audio/mpeg',
      };
    const audioFile = document.getElementById('audioArtifact').files[0];
        const file = audioFile;
        const storageRef = ref(storage, 'audio/' + file.name);

        try {
            // Upload the file to Firebase Storage
            await uploadBytes(storageRef, file, metadata);
            const getDownloadAudioURL = await getDownloadURL(storageRef);

            downloadAudioURL += getDownloadAudioURL;
        } catch (error) {
            console.error('Error uploading file:', error);
          
        }


    formData.audio = downloadAudioURL;


    console.log(formData);

    try {
        // Make a POST request to create a new postmuseum
        const response = await fetch('http://localhost:8383/postartifact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${await userID.getIdToken()}`
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        $("#addArtifact-modal").modal("hide");
        $("#artifacSuccess-modal").modal("show");
        console.log('Artifact created successfully:', data);

    } catch (error) {
        console.error('Error creating artifact', error);
    }
});
