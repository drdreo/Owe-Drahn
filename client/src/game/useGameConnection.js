import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {handshake} from "../socket/socket.actions.js";
import {initializeGameSocketListeners} from "../socket/socket.js";

export const useGameConnection = (room) => {
    const dispatch = useDispatch();
    const authUser = useSelector(state => state.auth.authUser); // Redux hook for state
    const socket = useSelector(state => state.socket.socket)

    useEffect(() => {
        // Initialize socket listeners
        const cleanup = initializeGameSocketListeners(socket, dispatch);
        // Perform handshake
        const uid = authUser?.uid;
        dispatch(handshake(room, uid));

        return () => {
            cleanup();
        };
    }, [room, authUser, dispatch]);
};