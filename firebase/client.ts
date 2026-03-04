// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDp2vhY2_H_UxSXgnJz8uEVc3T3h07TCHA",
    authDomain: "interviewx-20d29.firebaseapp.com",
    projectId: "interviewx-20d29",
    storageBucket: "interviewx-20d29.firebasestorage.app",
    messagingSenderId: "508802424071",
    appId: "1:508802424071:web:5d8525ca31a768118239a2",
    measurementId: "G-7M0MT2T4J1"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);