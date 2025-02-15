import {useContext} from "react";
import FirebaseContext from "./context.jsx";

export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
);

export const useFirebase = () => {
    return useContext(FirebaseContext);
};
