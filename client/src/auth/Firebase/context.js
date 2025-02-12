import React from 'react';
import { useContext } from 'react';

const FirebaseContext = React.createContext(null);

export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
);

export const useFirebase = () => {
    return useContext(FirebaseContext);
};


export default FirebaseContext;