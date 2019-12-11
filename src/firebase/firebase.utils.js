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

// When the user logs in if they are not already logged in
// will create a reference in the firestore database with email/display name & timestamp
export const createUserProfileDocument = async (userAuth, additionalData) => {
    // if there is no user auth object exit out of this function
    if (!userAuth) return;

    // retrieving information from database location that corresponds to the specific uid
    const userRef = firestore.doc(`users/${userAuth.uid}`);
    // awaiting snapShot object which represents the data
    const snapShot = await userRef.get();
    // if the snapShot object doesn't exist then we are taking the display name/email and creating a timestamp
    // essentially if the data doesn't exist we create data in its place
    // create a new user using the data from the userAuth object
    if (!snapShot.exists) {
        const { displayName, email } = userAuth;
        //creating timestamp
        const createdAt = new Date();
        // creating a new user object with the specified items within the object
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            });
            // UNLESS it throws an error in which case we log it
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }
    // chances are we will want the userRef in our code
    return userRef;
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
