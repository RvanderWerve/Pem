import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';

 
 // Firebase configuration file
 
 var firebaseConfig = {
    apiKey: "AIzaSyDkuqUfQCo8w_7OWogV44gsGLzaE-yEvX4",
    authDomain: "pem-firestore.firebaseapp.com",
    projectId: "pem-firestore",
    storageBucket: "pem-firestore.appspot.com",
    messagingSenderId: "528017814946",
    appId: "1:528017814946:web:f8fab7864531498a146efb"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

 //firebase ref variables
const pemStorage = firebase.storage();
const pemFirestore = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const pemId = firebase.firestore.FieldPath.documentId;
const pemAuth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => {
  pemAuth.signInWithPopup(provider);
};

//method for generating user document
export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;

  const userRef = pemFirestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

//method for retrieving user document
const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await pemFirestore.doc(`users/${uid}`).get();

    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

export { pemStorage, pemFirestore, timestamp, pemAuth, pemId };