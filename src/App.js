import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';

import ShopPage from './pages/shop/shop.component';
import HomePage from './pages/homepage/homepage.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import Header from './components/header/header.component';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { setCurrentUser } from './redux/user/user.actions';

class App extends React.Component {
    unsubscribeFromAuth = null;

    componentDidMount() {
        const { setCurrentUser } = this.props;
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
                    setCurrentUser({
                        id: snapShot.id,
                        ...snapShot.data()
                    });
                });
            }
            setCurrentUser(userAuth);
        });
    }

    componentWillUnmount() {
        // closes subscription on component unmount to avoid memory leaks
        this.unsubscribeFromAuth();
    }

    render() {
        return (
            <div>
                <Header />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/shop" component={ShopPage} />
                    <Route
                        exact
                        path="/signin"
                        render={() =>
                            this.props.currentUser ? (
                                <Redirect to="/" />
                            ) : (
                                <SignInAndSignUpPage />
                            )
                        }
                    />
                </Switch>
            </div>
        );
    }
}
const mapStateToProps = ({ user }) => ({
    currentUser: user.currentUser
});

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
