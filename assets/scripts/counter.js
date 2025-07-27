// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, increment } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCcUazBXtZ_ptlLSkwlwxePvyX4plGU6GY",
    authDomain: "page-view-counter-59da4.firebaseapp.com",
    projectId: "page-view-counter-59da4",
    storageBucket: "page-view-counter-59da4.firebasestorage.app",
    messagingSenderId: "895459668606",
    appId: "1:895459668606:web:0083b274b8642ce05ade2f",
    measurementId: "G-54RGXWZS45"
};

const appId = firebaseConfig.projectId;

let app;
let db;
let auth;
let userId = 'anonymous'; 
const initialCountValue = 0; 

const visitorCountElement = document.getElementById('visitorCount');

// Initialize Firebase and set up authentication
try {
    console.log("Initializing Firebase app with config:", firebaseConfig);
    app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app); // Initialize Analytics
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase app initialized.");

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in
            userId = user.uid;
            console.log("User authenticated:", userId);
            console.log("Calling setupVisitorCounter...");
            setupVisitorCounter();
        } else {
            console.log("No user signed in. Attempting anonymous sign-in...");
            try {
                await signInAnonymously(auth);
                console.log("Signed in anonymously.");
            } catch (error) {
                console.error("Error during Firebase authentication:", error);
                visitorCountElement.textContent = "Auth Error!";
            }
        }
    });

} catch (error) {
    console.error("Error initializing Firebase:", error);
    visitorCountElement.textContent = "Init Error!"; 
}

/**
 * Sets up the visitor counter logic.
 * This function is called only after Firebase authentication is ready.
 */
async function setupVisitorCounter() {
    const counterDocRef = doc(db, `artifacts/${appId}/public/data/visitor_counter`, 'global_count');
    
    onSnapshot(counterDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            visitorCountElement.textContent = data.count || initialCountValue; 
            console.log("Snapshot received. Current count:", visitorCountElement.textContent);
        } else {
            console.log("No visitor count document found during snapshot. Displaying initial value as fallback.");
            visitorCountElement.textContent = initialCountValue;
        }
    }, (error) => {
        console.error("Error listening to visitor count (onSnapshot):", error);
        visitorCountElement.textContent = "Firestore Error!";
    });

    try {
        const docSnap = await getDoc(counterDocRef);
        if (!docSnap.exists()) {
            await setDoc(counterDocRef, { count: initialCountValue });
            console.log(`Visitor count initialized to ${initialCountValue}.`);
        }
    } catch (error) {
        console.error("Error checking or initializing visitor count document (getDoc/setDoc):", error);
    }

    try {
        await setDoc(counterDocRef, { count: increment(1) }, { merge: true });
        console.log("Page view count incremented.");
    } catch (error) {
        console.error("Error incrementing page view count (setDoc increment):", error);
    }
}

