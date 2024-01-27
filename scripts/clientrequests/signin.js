import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword,} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

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

document.getElementById('signinForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    const auth = getAuth();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User signed in:', user);
        window.location.href = '../../subdir/home.html';
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing in:', errorCode, errorMessage);
        document.getElementById('errorText').innerText = `Error signing in: ${errorCode} - ${errorMessage}`;
        $('#errorModal').modal('show');
        }
});









