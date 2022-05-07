export const DocumentUpdate = (value) => {
    return dispatch => {
        dispatch(DocumentUpdateParam(value))
    }
}

const DocumentUpdateParam = (data) => ({
    type: "DOCUMENT_ADD",
    load: data 
})