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
  "Hey Dev! Remember to push your latest commit 🚀",
  "Bug found! Oh wait… it’s a feature 😏",
  "FCM ping: Your code is running like a charm! 💻",
  "Reminder: Drink coffee ☕ and check your console logs 🐛",
  "Random Dev Tip: Save often, debug twice!",
  "Build successful ✅… hopefully 🤞",
  "Console.log is your best friend 🖤",
  "Did you just fix it? Or break something else? 🤔",
  "Code never lies, comments sometimes do 📜",
  "Pull requests are like gifts 🎁 — review them with care",
  "Keep calm and npm install 🔧",
  "404 Motivation not found… try again later",
  "If it works, don’t touch it… unless you’re feeling brave 😎",
  "Git commit: ‘Final fix’ (for the 7th time)",
  "Your code compiled without errors! Time to worry 😅",
  "Test passed… in production 😬",
  "Remember: Tabs over spaces… or start a holy war ⚔️",
  "Coffee + Code = Happiness ☕💻",
  "May your queries be fast and your bugs be few 🐞",
  "Push code, not stress ❤️"
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


