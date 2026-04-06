    import {initializeApp} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
    import {getAnalytics} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
    import {getAuth} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
    import {getFirestore} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

     const firebaseConfig = {
    apiKey: "AIzaSyAZujXImezGAfWBQ9j4pd-ReoaSG5PRKqs",
    authDomain: "flora-management.firebaseapp.com",
    projectId: "flora-management",
    storageBucket: "flora-management.firebasestorage.app",
    messagingSenderId: "707451383401",
    appId: "1:707451383401:web:891b21d8994f4907e27cf8",
    measurementId: "G-Q6R675GLZW"
  };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth(app);
    const db = getFirestore(app);

    export { auth, db }
