export const FilterSpesialist = (value) => {
    return dispatch => {
        dispatch(filterSpesialistParam(value))
    }
}

const filterSpesialistParam = (data) => ({
    type: "FILTER_SPESIALIST",
    load: data
})
