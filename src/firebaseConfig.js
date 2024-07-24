// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCIX1YhyK1VXEsF8t2Qi1h3CuFBsQTj4ds",
    authDomain: "linkdin-clone-6ab44.firebaseapp.com",
    projectId: "linkdin-clone-6ab44",
    storageBucket: "linkdin-clone-6ab44.appspot.com",
    messagingSenderId: "379931153256",
    appId: "1:379931153256:web:d0ae8b07c02c9e78c7fcdd"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
