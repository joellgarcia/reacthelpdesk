import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyDNT14aNw5mJh5EDoTOH9qnlwsZN5B9CHo",
    authDomain: "reacthelpdesk-64828.firebaseapp.com",
    projectId: "reacthelpdesk-64828",
    storageBucket: "reacthelpdesk-64828.appspot.com",
    messagingSenderId: "930058968953",
    appId: "1:930058968953:web:50e7b681d618e7d02f19a8",
    measurementId: "G-ZVXE25Q3YT"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;