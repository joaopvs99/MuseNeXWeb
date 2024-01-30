const cors = require('cors'); 
const express = require('express');
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

app.use(async (req, res, next) => {
    const idToken = req.header('Authorization');
    try{
        if (!idToken) {
            throw new Error('No ID token provided');
          }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;


        next();
    }catch (error){
        console.log(error);
        res.status(401).json({error: 'Unauthorized'});
    }
});

app.get('/user', (req, res) => {
    const userUid = req.user.uid;
    res.status(200).json({uid: userUid});
});

const firestore = admin.firestore();
const museusCollection = firestore.collection('Museus');

app.get('/getcards', async (req, res) => {
    const userUid = req.user.uid;
  try {


    const snapshot = await museusCollection.where('uid','==', userUid).get();

    const data = snapshot.docs.map((doc) => doc.data());

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  

const port = process.env.PORT || 8383;
app.listen(port, () => {
    console.log(`Server is running on Port ${port}.`)
});