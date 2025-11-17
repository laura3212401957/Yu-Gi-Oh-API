import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvtyiJ69nR6hsFciRul67-yFlvK23Qcxo",
  authDomain: "yu-gi-oh-cardsapi.firebaseapp.com",
  projectId: "yu-gi-oh-cardsapi",
  storageBucket: "yu-gi-oh-cardsapi.firebasestorage.app.com",
  messagingSenderId: "172854177338",
  appId: "1:172854177338:web:9a198b69e0f5e67081cf03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };