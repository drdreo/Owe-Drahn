const INITIAL_STATE = {
    authUser: null,
};

function authReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'AUTH_USER_SET': {
            return { ...state, authUser: action.authUser };
        }
        default:
            return state;
    }
}
export default authReducer;