import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";

import {withFirebase} from "../Firebase";

const ERROR_CODE_ACCOUNT_EXISTS =
    "auth/account-exists-with-different-credential";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInGoogleBase extends Component {
    constructor(props) {
        super(props);

        this.state = {error: null};
    }

    onSubmit = event => {
        this.props.firebase
            .doSignInWithGoogle()
            .then(socialAuthUser => {
                console.log(socialAuthUser);

                if (socialAuthUser.additionalUserInfo.isNewUser) {
                    // Creating a user in Firebase Firestore
                    console.log("Creating new Firstore user");
                    return this.props.firebase.user(socialAuthUser.user.uid).set({
                        username: socialAuthUser.user.displayName,
                        email: socialAuthUser.user.email,
                        roles: [],
                        points: 1000
                    });
                }
            })
            .then(() => {
                this.setState({error: null});
            })
            .catch(error => {
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }

                this.setState({error});
            });

        event.preventDefault();
    };

    render() {
        const {error} = this.state;

        return (
            <form onSubmit={this.onSubmit} className={this.props.className}>
                <button type="submit" className="button">Sign In</button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}


const SignInGoogle = compose(
    withRouter,
    withFirebase
)(SignInGoogleBase);


export {SignInGoogle};
