# Firebase Setup Guide

This guide will help you set up Firebase to sync your restaurant data across all your devices (PC, mobile, tablet).

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Restaurant Manager")
4. Click **Continue**
5. (Optional) Disable Google Analytics or configure it
6. Click **Create project**
7. Wait for the project to be created, then click **Continue**

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Enter an app nickname (e.g., "Restaurant Web App")
3. **Do NOT** check "Also set up Firebase Hosting"
4. Click **Register app**
5. You'll see a configuration object - **keep this page open**

## Step 3: Get Your Firebase Configuration

You'll see code that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 4: Enable Firestore Database

1. In the Firebase Console left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for now - you can secure it later)
4. Click **Next**
5. Choose your Cloud Firestore location (pick one close to you)
6. Click **Enable**

## Step 5: Configure Your App

1. Open `app.js` in your vue-project folder
2. Find the `firebaseConfig` section at the top (lines 3-10)
3. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-actual-project.firebaseapp.com",
    projectId: "your-actual-project-id",
    storageBucket: "your-actual-project.appspot.com",
    messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
    appId: "YOUR_ACTUAL_APP_ID"
};
```

4. Save the file

## Step 6: Test the Sync

1. Open `index.html` in your browser on your PC
2. Add a restaurant with some data
3. Open the same `index.html` on your mobile device
   - You can host it on GitHub Pages, or
   - Upload it to any web hosting, or
   - Use a local server
4. You should see the same data on both devices!
5. Any changes made on one device will automatically sync to all other devices in real-time

## Security Rules (Important!)

The test mode allows anyone to read/write your database for 30 days. To secure it:

1. Go to **Firestore Database** > **Rules** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /restaurants/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Note:** This still allows anyone with your URL to access the data. For production use, implement Firebase Authentication.

## Hosting Your App

To access your app from mobile, you need to host it online. Easy options:

### Option 1: GitHub Pages (Free)
1. Create a GitHub repository
2. Upload all your vue-project files
3. Enable GitHub Pages in repository settings
4. Access via `https://yourusername.github.io/repository-name/`

### Option 2: Firebase Hosting (Free)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. In your vue-project folder: `firebase init hosting`
4. Deploy: `firebase deploy --only hosting`

### Option 3: Netlify Drop (Free)
1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag and drop your vue-project folder
3. Get instant URL

## Troubleshooting

**Data not syncing:**
- Check browser console for errors (F12 > Console tab)
- Verify your Firebase config is correct
- Make sure Firestore is enabled in Firebase Console
- Check that you're using the same Firebase project on all devices

**"Permission denied" errors:**
- Check your Firestore security rules
- Make sure test mode is enabled or rules allow read/write

**App works locally but not online:**
- Make sure all files are uploaded (index.html, app.js, style.css)
- Check that Firebase config is in app.js
- Verify the hosting URL is correct

## Features After Firebase Setup

✅ **Real-time sync** - Changes appear instantly on all devices
✅ **Offline support** - Data cached locally and syncs when back online
✅ **Backup** - Data stored in cloud, never lost
✅ **Cross-device** - Same data on PC, mobile, tablet
✅ **Free tier** - Firebase free plan includes 1GB storage and 50K reads/day

## Free Plan Limits

Firebase free plan (Spark) includes:
- 1 GB stored data
- 10 GB/month data transfer
- 50,000 document reads/day
- 20,000 document writes/day

This is more than enough for personal restaurant tracking!
