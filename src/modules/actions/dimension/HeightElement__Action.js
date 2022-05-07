export const HeightElement = (value) => {
    return dispatch => {
        dispatch(HeightElementParam(value))
    }
}

const HeightElementParam = (data) => ({
    type: "CREATE",
    load: data 
})