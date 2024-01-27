const cors = require('cors'); 
const express = require('express');// Import the cors middleware
const app = express(); 
const admin = require("firebase-admin");
const creds = require("./creds.json");

admin.initializeApp({
    credential: admin.credential.cert(creds)
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', async (req, res) => {
    console.log(req.body);

    try {
        const user = {
            email: req.body.email,
            password: req.body.password
        }
        const userResponse = await admin.auth().createUser({
            email: user.email,
            password: user.password,
            emailVerified: false,
            disabled: false
        });
        res.json(userResponse);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user.' });
    }
});

const port = process.env.PORT || 8383;
app.listen(port, () => {
    console.log(`Server is running on Port ${port}.`)
});