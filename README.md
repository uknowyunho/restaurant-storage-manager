# Restaurant Storage Manager

A Vue 3 application for managing and storing your favorite restaurants with real-time cloud sync across all your devices.

## Features

- ✨ Add, edit, and delete restaurants
- 📸 Upload restaurant images
- 🔍 Search restaurants by name, cuisine, address, or notes
- ⭐ Rate restaurants (1-5 stars)
- 💰 Track price ranges
- 📝 Add personal notes
- ☁️ **Real-time cloud sync with Firebase** (optional)
- 💾 Data persists using browser localStorage (works offline)
- 📱 Fully responsive design
- 🔄 Automatic sync between PC, mobile, and all devices

## Restaurant Information

Each restaurant can store:
- Name (required)
- Cuisine type (required)
- Image/Photo
- Address
- Phone number
- Rating (1-5 stars)
- Price range ($, $$, $$$, $$$$)
- Notes/comments

## Quick Start

### Local Use (No Sync)
1. **Open the application**: Simply open `index.html` in your web browser
2. **Add a restaurant**: Fill out the form at the top and click "Add Restaurant"
3. **Search**: Use the search box to filter restaurants
4. **Edit**: Click the "Edit" button on any restaurant card
5. **Delete**: Click the "Delete" button to remove a restaurant

### Cloud Sync Setup (Sync Across Devices)

**Want to sync your restaurants between PC and mobile?**

📖 **[Follow the Firebase Setup Guide](FIREBASE_SETUP.md)** - Takes about 5 minutes!

After setup:
- Add a restaurant on your PC → See it instantly on your phone
- Delete on mobile → Removed everywhere automatically
- Works offline and syncs when you're back online
- Free forever for personal use

## Technology Stack

- **Vue 3** (via CDN) - Progressive JavaScript framework
- **LocalStorage API** - Data persistence
- **CSS3** - Modern styling with gradients and animations
- **Vanilla JavaScript** - No build tools required

## File Structure

```
vue-project/
├── index.html    # Main HTML file with Vue app template
├── app.js        # Vue application logic
├── style.css     # Styling and responsive design
└── README.md     # This file
```

## Data Storage

### Without Firebase (Default)
All restaurant data is stored locally in your browser using localStorage:
- Persists between browser sessions
- Is private to your browser
- Works offline
- Device-specific (not synced)
- Can be cleared by clearing browser data

### With Firebase (Optional)
When you configure Firebase, your data is:
- Stored in Google Cloud Firestore
- Synced in real-time across all your devices
- Cached locally for offline access
- Backed up automatically
- Free for personal use

**Image Storage:**
- Images are converted to base64 and stored in localStorage/Firebase
- Maximum image size: 5MB per image
- Supported formats: JPG, PNG, GIF, WebP, and other common image formats

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid
- localStorage API
- Vue 3

## No Installation Required

This is a standalone application that runs entirely in the browser. No npm, build tools, or server required - just open the HTML file!
