const initialState = {
    data: null,
}

export const HeightElementReducer = (state = initialState, action) => {
    switch(action.type){
        case "CREATE":
            return {
                ...state,
                data: action.load
            }
        default:
            return state
    }
}   