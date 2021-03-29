import firebase from 'firebase/app';
import 'firebase/firestore'


  // Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
const db = fire.firestore()
export {db}