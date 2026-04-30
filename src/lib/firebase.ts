import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlb0MaqIRMo12z3WDPLVtnvNCkFavwET0",
  authDomain: "sukhroopgardan.firebaseapp.com",
  projectId: "sukhroopgardan",
  storageBucket: "sukhroopgardan.firebasestorage.app",
  messagingSenderId: "204732843423",  
  appId: "1:204732843423:web:4a7ce4d70e24da31f669aa",
  measurementId: "G-T1WFHD6B6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, ref, uploadBytes, getDownloadURL, deleteObject };
