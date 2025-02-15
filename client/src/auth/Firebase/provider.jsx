import { useState} from "react";
import Firebase from "./Firebase.js";
import FirebaseContext from "./context.jsx";

export const FirebaseProvider = ({children}) => {
    const [firebase] = useState(() => new Firebase());

    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    );
};