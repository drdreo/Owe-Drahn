import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useFirebase} from '../Firebase';

const useAuthorization = (condition) => {
    const navigate = useNavigate();
    const firebase = useFirebase(); // Use a custom hook for Firebase
    const authUser = useSelector(state => state.auth.authUser); // Redux hook for state

    useEffect(() => {
        firebase.onAuthUserListener(
            authUser => {
                if (!condition(authUser)) {
                    navigate('/');
                }
            },
            () => navigate('/'),
        );
    }, [firebase, navigate, condition]);

    return condition(authUser); // Return true or false to render the component
};

const withAuthorization = (condition) => (Component) => {
    return (props) => {
        const isAuthorized = useAuthorization(condition);

        if (!isAuthorized) {
            return null; // or a loading spinner, etc.
        }

        return <Component {...props} />;
    };
};

export default withAuthorization;