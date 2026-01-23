// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAhw8RTEeQy_QPIkE0H2-7udkNj8V-Lrd4",
    authDomain: "restaurant-manager-13f99.firebaseapp.com",
    projectId: "restaurant-manager-13f99",
    storageBucket: "restaurant-manager-13f99.firebasestorage.app",
    messagingSenderId: "746415811496",
    appId: "1:746415811496:web:defbd5825703d43cac4b9d"
};

// Initialize Firebase
let db = null;
let useFirebase = false;

try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        useFirebase = true;
        console.log('Firebase initialized successfully');
    } else {
        console.log('Firebase not configured. Using localStorage only.');
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
    console.log('Falling back to localStorage');
}

const { createApp } = Vue;

createApp({
    data() {
        return {
            restaurants: [],
            form: {
                name: '',
                cuisine: '',
                address: '',
                phone: '',
                rating: '',
                priceRange: '',
                notes: '',
                image: ''
            },
            editingId: null,
            searchQuery: '',
            unsubscribe: null
        };
    },
    computed: {
        filteredRestaurants() {
            if (!this.searchQuery) {
                return this.restaurants;
            }
            const query = this.searchQuery.toLowerCase();
            return this.restaurants.filter(restaurant => {
                return (
                    restaurant.name.toLowerCase().includes(query) ||
                    restaurant.cuisine.toLowerCase().includes(query) ||
                    (restaurant.address && restaurant.address.toLowerCase().includes(query)) ||
                    (restaurant.notes && restaurant.notes.toLowerCase().includes(query))
                );
            });
        }
    },
    methods: {
        async saveRestaurant() {
            const restaurantData = {
                name: this.form.name,
                cuisine: this.form.cuisine,
                address: this.form.address,
                phone: this.form.phone,
                rating: this.form.rating,
                priceRange: this.form.priceRange,
                notes: this.form.notes,
                image: this.form.image,
                updatedAt: new Date().toISOString()
            };

            if (this.editingId) {
                // Update existing restaurant
                if (useFirebase) {
                    try {
                        await db.collection('restaurants').doc(String(this.editingId)).update(restaurantData);
                    } catch (error) {
                        console.error('Error updating restaurant:', error);
                        alert('Error updating restaurant. Please try again.');
                        return;
                    }
                } else {
                    // Update local array only when not using Firebase
                    const index = this.restaurants.findIndex(r => r.id === this.editingId);
                    if (index !== -1) {
                        this.restaurants[index] = {
                            ...this.restaurants[index],
                            ...restaurantData
                        };
                    }
                }
            } else {
                // Add new restaurant
                const newId = Date.now();
                const newRestaurant = {
                    id: newId,
                    ...restaurantData,
                    createdAt: new Date().toISOString()
                };

                if (useFirebase) {
                    try {
                        await db.collection('restaurants').doc(String(newId)).set(newRestaurant);
                    } catch (error) {
                        console.error('Error adding restaurant:', error);
                        alert('Error adding restaurant. Please try again.');
                        return;
                    }
                } else {
                    // Add to local array only when not using Firebase
                    this.restaurants.push(newRestaurant);
                }
            }

            // Save to localStorage as backup
            if (!useFirebase) {
                this.saveToLocalStorage();
            }
            this.resetForm();
        },
        editRestaurant(restaurant) {
            this.editingId = restaurant.id;
            this.form = {
                name: restaurant.name,
                cuisine: restaurant.cuisine,
                address: restaurant.address || '',
                phone: restaurant.phone || '',
                rating: restaurant.rating || '',
                priceRange: restaurant.priceRange || '',
                notes: restaurant.notes || '',
                image: restaurant.image || ''
            };
            // Scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                // Check file size (limit to 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Image size should be less than 5MB');
                    event.target.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    this.form.image = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        removeImage() {
            this.form.image = '';
            if (this.$refs.imageInput) {
                this.$refs.imageInput.value = '';
            }
        },
        async deleteRestaurant(id) {
            if (confirm('Are you sure you want to delete this restaurant?')) {
                if (useFirebase) {
                    try {
                        await db.collection('restaurants').doc(String(id)).delete();
                    } catch (error) {
                        console.error('Error deleting restaurant:', error);
                        alert('Error deleting restaurant. Please try again.');
                        return;
                    }
                } else {
                    // Update local array only when not using Firebase
                    this.restaurants = this.restaurants.filter(r => r.id !== id);
                    this.saveToLocalStorage();
                }

                // If we're editing this restaurant, reset the form
                if (this.editingId === id) {
                    this.resetForm();
                }
            }
        },
        resetForm() {
            this.form = {
                name: '',
                cuisine: '',
                address: '',
                phone: '',
                rating: '',
                priceRange: '',
                notes: '',
                image: ''
            };
            this.editingId = null;
            // Clear file input
            if (this.$refs.imageInput) {
                this.$refs.imageInput.value = '';
            }
        },
        getStars(rating) {
            return '⭐'.repeat(parseInt(rating));
        },
        saveToLocalStorage() {
            localStorage.setItem('restaurants', JSON.stringify(this.restaurants));
        },
        loadFromLocalStorage() {
            const stored = localStorage.getItem('restaurants');
            if (stored) {
                try {
                    this.restaurants = JSON.parse(stored);
                } catch (e) {
                    console.error('Error loading restaurants from localStorage:', e);
                    this.restaurants = [];
                }
            }
        },
        setupFirebaseSync() {
            if (!useFirebase) {
                this.loadFromLocalStorage();
                return;
            }

            // Set up real-time listener for Firebase
            this.unsubscribe = db.collection('restaurants').onSnapshot((snapshot) => {
                const restaurants = [];
                const seenIds = new Set();

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    // Prevent duplicates by checking ID
                    if (!seenIds.has(data.id)) {
                        seenIds.add(data.id);
                        restaurants.push(data);
                    }
                });

                // Sort by creation date (newest first)
                restaurants.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                this.restaurants = restaurants;

                // Also save to localStorage as backup
                this.saveToLocalStorage();
            }, (error) => {
                console.error('Error loading restaurants from Firebase:', error);
                // Fallback to localStorage
                this.loadFromLocalStorage();
            });
        }
    },
    mounted() {
        this.setupFirebaseSync();
    },
    beforeUnmount() {
        // Clean up Firebase listener
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}).mount('#app');
