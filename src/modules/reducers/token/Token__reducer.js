const initialState = {
    data: null,
    loggedIn: false,
    accessToken: null,
    refreshToken: null,
    role: null,
}

export const TokenReducer = (state = initialState, action) => {
    switch(action.type){
        case "TOKEN_CREATE":
            return {
                ...state,
                data: action.load
            }
        case "SET_LOGGED_IN":
            return {
                ...state,
                loggedIn: action.payload
            }
        case "SET_ACCESS_TOKEN":
            return {
                ...state,
                accessToken: action.payload
            }
        case "SET_REFRESH_TOKEN":
            return {
                ...state,
                refreshToken: action.payload
            }
        case "SET_ROLE":
            return {
                ...state,
                role: action.payload
            }
        default:
            return state
    }
}
