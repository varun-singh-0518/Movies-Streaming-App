import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1DPQFl10TzKoGEQEoHQIca62Gkbj4iuw",
  authDomain: "react-netflix-clone-14ee7.firebaseapp.com",
  projectId: "react-netflix-clone-14ee7",
  storageBucket: "react-netflix-clone-14ee7.appspot.com",
  messagingSenderId: "110818752998",
  appId: "1:110818752998:web:48137200af82b2aabfbe27",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
