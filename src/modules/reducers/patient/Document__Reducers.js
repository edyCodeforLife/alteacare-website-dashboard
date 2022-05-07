const initialState = {
    data: [],
}

export const DocumentReducer = (state = initialState, action) => {
    switch(action.type){
        case "DOCUMENT_ADD":
            return {
                ...state,
                data: action.load
            }
        default:
            return state
    }
}   