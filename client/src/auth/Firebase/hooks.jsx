import {useContext} from "react";
import FirebaseContext from "./context.jsx";

export const useFirebase = () => {
    return useContext(FirebaseContext);
};
