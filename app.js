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
                images: []
            },
            editingId: null,
            searchQuery: '',
            selectedCuisine: '',
            unsubscribe: null,
            showLightbox: false,
            lightboxImage: ''
        };
    },
    computed: {
        filteredRestaurants() {
            let filtered = this.restaurants;

            // Filter by cuisine if selected
            if (this.selectedCuisine) {
                filtered = filtered.filter(restaurant =>
                    restaurant.cuisine.toLowerCase() === this.selectedCuisine.toLowerCase()
                );
            }

            // Filter by search query
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(restaurant => {
                    return (
                        restaurant.name.toLowerCase().includes(query) ||
                        restaurant.cuisine.toLowerCase().includes(query) ||
                        (restaurant.address && restaurant.address.toLowerCase().includes(query)) ||
                        (restaurant.notes && restaurant.notes.toLowerCase().includes(query))
                    );
                });
            }

            return filtered;
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
                images: this.form.images,
                updatedAt: new Date().toISOString()
            };

            // Check document size for Firebase (1MB limit)
            if (useFirebase) {
                const docSize = new Blob([JSON.stringify(restaurantData)]).size;
                const maxSize = 1048576; // 1MB in bytes

                if (docSize > maxSize) {
                    const sizeMB = (docSize / 1048576).toFixed(2);
                    alert(`Data size (${sizeMB}MB) exceeds Firebase's 1MB limit. Please reduce the number of images or use smaller images.`);
                    return;
                }
            }

            if (this.editingId) {
                // Update existing restaurant
                if (useFirebase) {
                    try {
                        await db.collection('restaurants').doc(String(this.editingId)).update(restaurantData);
                    } catch (error) {
                        console.error('Error updating restaurant:', error);
                        console.error('Error details:', error.code, error.message);

                        if (error.code === 'permission-denied') {
                            alert('Permission denied. Please check your Firebase security rules.');
                        } else if (error.message && error.message.includes('maximum size')) {
                            alert('Data size exceeds Firebase limit. Please use smaller images or fewer images.');
                        } else {
                            alert(`Error updating restaurant: ${error.message || 'Please try again.'}`);
                        }
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
                        console.error('Error details:', error.code, error.message);

                        if (error.code === 'permission-denied') {
                            alert('Permission denied. Please check your Firebase security rules.');
                        } else if (error.message && error.message.includes('maximum size')) {
                            alert('Data size exceeds Firebase limit. Please use smaller images or fewer images.');
                        } else {
                            alert(`Error adding restaurant: ${error.message || 'Please try again.'}`);
                        }
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
                images: restaurant.images || []
            };
            // Scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        compressImage(file, maxWidth = 800, quality = 0.7) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;

                        // Resize if larger than maxWidth
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }

                        canvas.width = width;
                        canvas.height = height;

                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        // Convert to base64 with compression
                        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                        resolve(compressedDataUrl);
                    };
                    img.onerror = reject;
                    img.src = e.target.result;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        },
        async handleImageUpload(event) {
            const files = event.target.files;
            if (files.length === 0) return;

            // Check if adding these files would exceed the 5 image limit
            if (this.form.images.length + files.length > 5) {
                alert(`You can only upload up to 5 images. You currently have ${this.form.images.length} image(s).`);
                event.target.value = '';
                return;
            }

            // Process each file
            for (const file of Array.from(files)) {
                try {
                    // Compress image automatically (handles all sizes)
                    const compressedImage = await this.compressImage(file, 800, 0.7);
                    this.form.images.push(compressedImage);
                } catch (error) {
                    console.error(`Error processing image "${file.name}":`, error);
                    alert(`Error processing image "${file.name}". Please try again.`);
                }
            }

            // Clear the input so the same file can be selected again
            event.target.value = '';
        },
        removeImage(index) {
            this.form.images.splice(index, 1);
        },
        triggerImageUpload() {
            if (this.$refs.imageInput) {
                this.$refs.imageInput.click();
            }
        },
        openLightbox(image) {
            this.lightboxImage = image;
            this.showLightbox = true;
        },
        closeLightbox() {
            this.showLightbox = false;
            this.lightboxImage = '';
        },
        filterByCuisine(cuisine) {
            this.selectedCuisine = this.selectedCuisine === cuisine ? '' : cuisine;
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
                images: []
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
                    let needsUpdate = false;

                    // Backward compatibility: convert old 'image' field to 'images' array
                    this.restaurants = this.restaurants.map(restaurant => {
                        if (restaurant.image && !restaurant.images) {
                            restaurant.images = [restaurant.image];
                            delete restaurant.image;
                            needsUpdate = true;
                        } else if (!restaurant.images) {
                            restaurant.images = [];
                        }
                        return restaurant;
                    });

                    // Save back to localStorage if we migrated any old data
                    if (needsUpdate) {
                        this.saveToLocalStorage();
                    }
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

                        // Backward compatibility: convert old 'image' field to 'images' array
                        if (data.image && !data.images) {
                            data.images = [data.image];
                            delete data.image;

                            // Update Firebase document with new format
                            db.collection('restaurants').doc(String(data.id)).update({
                                images: data.images,
                                image: firebase.firestore.FieldValue.delete()
                            }).catch(err => console.error('Error migrating image field:', err));
                        } else if (!data.images) {
                            data.images = [];
                        }

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
