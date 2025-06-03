import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCz_yHf_a2jzZPYk38WKMACqfHHv8vp9NI",
  authDomain: "recruitmentcrm-19a7c.firebaseapp.com",
  projectId: "recruitmentcrm-19a7c",
  storageBucket: "recruitmentcrm-19a7c.firebasestorage.app",
  messagingSenderId: "619367079607",
  appId: "1:619367079607:web:4dfb6c9537be12871e7732"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
