import { storageData, removeData } from "../../../helpers/localStorage"

export const TokenCreate = (value) => {
    return dispatch => {
        dispatch(TriggerCreateParam(value))
    }
}

export const SetLoggedIn = (value) => ({
    type: 'SET_LOGGED_IN',
    payload: value,
})

export const SetAccessToken = (value) => {
    if (value) {
        storageData('access_token', value)
    } else {
       removeData('access_token')
    }

    return {
        type: 'SET_ACCESS_TOKEN',
        payload: value,
    }
}

export const SetRefreshToken = (value) => {
    if (value) {
        storageData('refresh_token', value)
    } else {
        removeData('refresh_token')
     }

    return {
        type: 'SET_REFRESH_TOKEN',
        payload: value,
    }
}

export const SetRole = (value) => {
    if (value) {
        storageData('role', value)
    } else {
        removeData('role')
    }

    return {
        type: 'SET_ROLE',
        payload: value,
    }
}

const TriggerCreateParam = (data) => ({
    type: "TOKEN_CREATE",
    load: data
})
