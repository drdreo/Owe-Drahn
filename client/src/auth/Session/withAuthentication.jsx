import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useFirebase} from '../Firebase';

const withAuthentication = (Component) => {
    return (props) => {
        const dispatch = useDispatch();
        const firebase = useFirebase();

        useEffect(() => {
            const storedAuthUser = JSON.parse(localStorage.getItem('authUser'));
            if (storedAuthUser) {
                dispatch({type: 'AUTH_USER_SET', authUser: storedAuthUser});
            }

            firebase.onAuthUserListener(
                (authUser) => {
                    localStorage.setItem('authUser', JSON.stringify(authUser));
                    dispatch({type: 'AUTH_USER_SET', authUser});
                },
                () => {
                    localStorage.removeItem('authUser');
                    dispatch({type: 'AUTH_USER_SET', authUser: null});
                }
            );
        }, [dispatch, firebase]);

        return <Component {...props} />;
    };
};

export default withAuthentication;
