const express = require('express');
const cors = require('cors'); // ✅ add this
require("dotenv").config();

const admin = require('firebase-admin');

if (!process.env.FIREBASE_CONFIG) {
  console.error("❌ FIREBASE_CONFIG environment variable missing!");
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
// ✅ allow all origins (for testing)
app.use(cors({
  origin: '*', // OR ["http://localhost:5173"] for specific
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const messages = [
  "Hello! This is a random note.",
  "Surprise! 🎉",
  "FCM test message — enjoy!",
  "Did you know? Random notification arrived."
];

app.post('/send-random', async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ error: 'token required in body' });

  const random = messages[Math.floor(Math.random() * messages.length)];

  const message = {
    token,
    notification: {
      title: 'Random Notification',
      body: random
    },
    webpush: {
      fcmOptions: { link: 'https://mynotification.netlify.app/' }
    }
  };

  try {
    const resp = await admin.messaging().send(message);
    res.json({ success: true, resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));

