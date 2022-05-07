export const FilterHospitals = (value) => {
    return dispatch => {
        dispatch(filterHospitalsParam(value))
    }
}

const filterHospitalsParam = (data) => ({
    type: "FILTER_HOSPITAL",
    load: data
})
