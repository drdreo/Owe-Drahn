import {useState} from "react";

import {useFirebase} from "../Firebase";

const ERROR_CODE_ACCOUNT_EXISTS =
    "auth/account-exists-with-different-credential";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;


const SignInGoogle = ({className}) => {
    const [error, setError] = useState(null);
    const firebase = useFirebase();

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            const socialAuthUser = await firebase.doSignInWithGoogle();
            const additionalUserInfo = await firebase.getAdditionalUserInfo(socialAuthUser);

            if (additionalUserInfo.isNewUser) {
                await firebase.user(socialAuthUser.user.uid).set({
                    username: socialAuthUser.user.displayName,
                    email: socialAuthUser.user.email,
                    roles: [],
                    points: 1000
                });
            }

            setError(null);
        } catch (error) {
            console.error(error);
            if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                error.message = ERROR_MSG_ACCOUNT_EXISTS;
            }
            setError(error);
        }
    };

    return (
        <form onSubmit={onSubmit} className={className}>
            <button type="submit" className="button">Sign In</button>
            {error && <p>{error.message}</p>}
        </form>
    );
};

export default SignInGoogle;
