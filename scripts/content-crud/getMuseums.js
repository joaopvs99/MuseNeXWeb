import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

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
        // Show Lottie animation
        const lottieAnimationContainer = document.getElementById('lottieAnimation');
        const animation = lottie.loadAnimation({
            container: lottieAnimationContainer,
            renderer: 'svg', // Adjust based on your animation type
            loop: true,
            autoplay: true, // Set autoplay to false initially
            path: '../scripts/content-crud/loading.json',
        });

        setTimeout(() => {
            console.log(userID);
            setupGetCardsEventListener(userID);
          }, "1000");
          
        
async function setupGetCardsEventListener(userID) {

        class Card {
            constructor(name, description, image) {
                this.name = name;
                this.description = description;
                this.image = image;
            }

            async calculateFirstPhotoPath() {
                if (this.image && this.image.length > 0) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    this.image = this.image[0];
                } else {
                    this.image = null;
                }
            }
        }

            try {
                const response = await fetch(`http://localhost:8383/getcards`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${await userID.getIdToken()}`
                    },
                });

                const data = await response.json();
                // Stop animation
                animation.stop();

                // Hide or remove the animation container
                lottieAnimationContainer.style.display = 'none';

                // Reference to the card container
                const cardContainer = document.getElementById('cardContainer');

                // Clear existing content on the HTML page
                cardContainer.innerHTML = '';

                // Iterate through the data array and append HTML content
                data.forEach(async function (cardData) {
                    const card = new Card(cardData.nome, cardData.descricao, cardData.galeria);
                    await card.calculateFirstPhotoPath();

                    // Construct HTML content for each card
                    const cardHTML = `
                        <div class="col">
                            <div class="card h-100">
                                <img src="${card.image || 'https://placeholder.com/150'}" class="card-img-top" alt="${card.name}">
                                <div class="card-body text-center">
                                    <h5 class="card-title">${card.name}</h5>
                                    <p class="card-text text-truncate">${card.description}</p>
                                </div>
                            </div>
                        </div>
                    `;

                    // Append the HTML content to the card container
                    cardContainer.innerHTML += cardHTML;
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
}

