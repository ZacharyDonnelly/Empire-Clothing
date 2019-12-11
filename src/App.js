import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';

import ShopPage from './pages/shop/shop.component';
import HomePage from './pages/homepage/homepage.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import Header from './components/header/header.component';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            currentUser: null
        };
    }

    unsubscribeFromAuth = null;

    componentDidMount() {
        console.log(this.state.currentUser);
        // -subscriber-
        // will send this every time until the user logs out
        // open messaging system between app/firebase
        // whenever any change occurs on app firebase sends out a message
        // connection is always open as long as app component is renders
        // must close to avoid memory leaks
        this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
            // if a user logs in
            if (userAuth) {
                // checking if DB updated with this data or if the snapshot has changed
                const userRef = await createUserProfileDocument(userAuth);
                // the moment in instantiates it will send us a snapshot object
                userRef.onSnapshot(snapShot => {
                    // creating a new object with the properties we want
                    this.setState({
                        currentUser: {
                            id: snapShot.id,
                            ...snapShot.data()
                        }
                    });
                });
            } else {
                this.setState({
                    currentUser: userAuth
                });
            }
        });
    }

    componentWillUnmount() {
        // closes subscription on component unmount to avoid memory leaks
        this.unsubscribeFromAuth();
    }

    render() {
        return (
            <div>
                <Header currentUser={this.state.currentUser} />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/shop" component={ShopPage} />
                    <Route path="/signin" component={SignInAndSignUpPage} />
                </Switch>
            </div>
        );
    }
}

export default App;
