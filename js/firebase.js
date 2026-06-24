import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBqjLbv3RRMZe6qPLcVOIe2KooSy5tcbh0",
    authDomain: "undangan-sunat-ba77f.firebaseapp.com",
    projectId: "undangan-sunat-ba77f",
    storageBucket: "undangan-sunat-ba77f.firebasestorage.app",
    messagingSenderId: "483690240563",
    appId: "1:483690240563:web:37b6192d217d938fcd2146"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {
    db,
    collection,
    addDoc,
    getDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
};