import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB2Mc8EBF85lXcSHa9WShXNwOY3JxgGD2w",
    authDomain: "chatbotwebsite-22a5e.firebaseapp.com",
    projectId: "chatbotwebsite-22a5e",
    storageBucket: "chatbotwebsite-22a5e.appspot.com",
    messagingSenderId: "916650176390",
    appId: "1:916650176390:web:26b15c3dfdb851be374607",
    measurementId: "G-RM0B2B90DH"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
