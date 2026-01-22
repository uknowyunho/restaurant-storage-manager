# Quick Start - 5 Minute Firebase Sync Setup

Follow these simple steps to sync your restaurants across all devices:

## 1️⃣ Create Firebase Project (2 minutes)

1. Visit: https://console.firebase.google.com/
2. Click "Add project"
3. Name it: "Restaurant Manager"
4. Click Continue → Continue → Create project

## 2️⃣ Setup Database (1 minute)

1. In left sidebar, click "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode"
4. Click Next → Enable

## 3️⃣ Get Your Config (1 minute)

1. Click the gear icon ⚙️ (top left) → Project settings
2. Scroll down to "Your apps" section
3. Click the Web icon (`</>`)
4. Name it: "Restaurant App"
5. Click "Register app"
6. Copy the `firebaseConfig` object

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "restaurant-xxx.firebaseapp.com",
  projectId: "restaurant-xxx",
  ...
};
```

## 4️⃣ Update Your App (1 minute)

1. Open `app.js` in a text editor
2. Find lines 3-10 (the firebaseConfig section)
3. Replace `YOUR_API_KEY`, `YOUR_PROJECT_ID`, etc. with your actual values from step 3
4. Save the file

**Example:**
```javascript
// BEFORE:
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    ...
};

// AFTER (with your actual values):
const firebaseConfig = {
    apiKey: "AIzaSyABC123...",
    authDomain: "restaurant-12345.firebaseapp.com",
    projectId: "restaurant-12345",
    ...
};
```

## 5️⃣ Host Your App (Optional - for mobile access)

**Easy Option - GitHub Pages:**
1. Create a GitHub account if you don't have one
2. Create a new repository
3. Upload your vue-project files
4. Go to Settings → Pages
5. Select "main" branch → Save
6. Your app will be at: `https://yourusername.github.io/repository-name/`

**Super Easy Option - Netlify Drop:**
1. Go to: https://app.netlify.com/drop
2. Drag and drop your vue-project folder
3. Get instant URL (works immediately!)

## ✅ Done! Test It:

1. Open the app on your PC
2. Add a test restaurant
3. Open the same URL on your phone
4. See the restaurant appear automatically! 🎉

---

## Troubleshooting

**"Firebase not configured" in console:**
- Make sure you replaced ALL placeholder values in app.js
- Check that there are no typos in the config

**Can't access on mobile:**
- The app needs to be hosted online (GitHub Pages or Netlify)
- You can't just open the local file on mobile

**Data not syncing:**
- Check browser console (F12) for error messages
- Verify Firestore is enabled in Firebase Console
- Make sure both devices are using the same hosted URL

---

Need more help? Check the full [Firebase Setup Guide](FIREBASE_SETUP.md)
