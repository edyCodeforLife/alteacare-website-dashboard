export const FilterPrice = (value) => {
    return dispatch => {
        dispatch(filterPriceParam(value))
    }
}

const filterPriceParam = (data) => ({
    type: "FILTER_PRICE",
    load: data
})
