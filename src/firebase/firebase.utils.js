import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: 'AIzaSyAprLJUK2AsImhCYbvMLdEmIQAcBncAyyk',
    authDomain: 'crwn-db-28ac3.firebaseapp.com',
    databaseURL: 'https://crwn-db-28ac3.firebaseio.com',
    projectId: 'crwn-db-28ac3',
    storageBucket: 'crwn-db-28ac3.appspot.com',
    messagingSenderId: '957646555986',
    appId: '1:957646555986:web:56f9efb03faadb03ad488b',
    measurementId: 'G-PPS0J9DSDC'
};

firebase.initializeApp(config);

// exporting firebase
export const auth = firebase.auth();
export const firestore = firebase.firestore();

// setting up google sign in config for firebase
const provider = new firebase.auth.GoogleAuthProvider();
// setting custom params- trigger google pop up whenever we use the google sign up option
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
