const cors = require("cors");
const express = require("express");
const app = express();
const admin = require("firebase-admin");
const creds = require("./creds.json");
const multer = require("multer");

admin.initializeApp({
  credential: admin.credential.cert(creds),
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/signup", async (req, res) => {
  console.log(req.body);

  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
    };

    const userRecord = await admin.auth().createUser({
      email: user.email,
      password: user.password,
      emailVerified: false,
      disabled: false,
    });

    await admin.auth().updateUser(userRecord.uid, {
      displayName: user.displayName,
    });

    res.json({ uid: userRecord.uid, email: userRecord.email, displayName: user.displayName });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user." });
  }
});

app.use(async (req, res, next) => {
  const idToken = req.header("Authorization");
  try {
    if (!idToken) {
      throw new Error("No ID token provided");
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unauthorized" });
  }
});
const firestore = admin.firestore();
const museusCollection = firestore.collection("Museus");

app.post("/postMuseum", async (req, res) => {
  try {
    console.log("request_body:", req.body);
    
    // Parse JSON data
    let jsonData = req.body || {};
  
    // Access jsonData fields
    let categoria_id = jsonData.category;
    let nome = jsonData.museumName;
    let descricao = jsonData.descriptionPT;
    let localizacao = jsonData.address;
    let contacto = jsonData.phoneNumber;
    let uid = jsonData.uid;
    // Access other fields as needed

    // Access the array of download URLs
    let galeria = jsonData.gallery || [];
    
    // Example: Adding data to Firestore
    await museusCollection.add({
      categoria_id,
      nome,
      descricao,
      localizacao,
      contacto,
      galeria,
      uid

    });

    res.status(200).json({ success: true, message: 'Data successfully added to Firestore' });
  } catch (error) {
    console.error('Error processing postMuseum request:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

const eventsCollection = firestore.collection("Eventos");

app.post("/postEvent", async (req, res) => {
  try {
    console.log("request_body:", req.body);
    
    // Parse JSON data
    let jsonData = req.body || {};
  
    // Access jsonData fields
    let categoria_id = jsonData.category;
    let data_evento_inicial = jsonData.startDate;
    let data_evento_final = jsonData.endDate;
    let descricao = jsonData.descriptionPT;
    let museu_id = jsonData.museumId;
    // Access other fields as needed

    // Access the array of download URLs
    let galeria = jsonData.gallery || [];
    
    // Example: Adding data to Firestore
    await eventsCollection.add({
      categoria_id,
      data_evento_inicial,
      data_evento_final,
      descricao,
      museu_id,
      galeria,

    });

    res.status(200).json({ success: true, message: 'Data successfully added to Firestore' });
  } catch (error) {
    console.error('Error processing postMuseum request:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

const artifactsCollection = firestore.collection("Obras");

app.post("/postartifact", async (req, res) => {
  try {
    console.log("request_body:", req.body);
    
    // Parse JSON data
    let jsonData = req.body || {};
  
    // Access jsonData fields
    let categoria_id = jsonData.category;
    let descricao = jsonData.descriptionPT;
    let engDescription = jsonData.descriptionEng;
    let museu_id = jsonData.museumId;
    let autor_id = jsonData.autor_id;
    let nome = jsonData.nome;

    // Access the array of download URLs
    let foto_url = jsonData.gallery;
    let audio_url = jsonData.audio;
    
    // Example: Adding data to Firestore
    await artifactsCollection.add({
      categoria_id,
      autor_id,
      nome,
      descricao,
      engDescription,
      museu_id,
      foto_url,
      audio_url
    });

    res.status(200).json({ success: true, message: 'Data successfully added to Firestore' });
  } catch (error) {
    console.error('Error processing postMuseum request:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get("/getmuseums", async (req, res) => {
  const userUid = req.user.uid;
  try {
    const snapshot = await museusCollection.where("uid", "==", userUid).get();

    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));


    res.status(200).json(data);
    console.log({data});
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const categoryCollection = firestore.collection("Categorias");

app.get("/getcategories", async (req, res) => {

  try {
    const snapshot = await categoryCollection.get();

    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 8383;
app.listen(port, () => {
  console.log(`Server is running on Port ${port}.`);
});
