// hooks/useAuth.js
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {useFirebase} from "../Firebase/index.js";

export const useAuth = () => {
    const dispatch = useDispatch();
    const firebase = useFirebase();

    useEffect(() => {
        // Only setup listener if there was a previous session
        const storedAuthUser = JSON.parse(localStorage.getItem('authUser'));
        if (storedAuthUser) {
            dispatch({type: 'AUTH_USER_SET', authUser: storedAuthUser});
        }

        // Optional auth listener
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
};