import { combineReducers, createStore, compose, applyMiddleware } from 'redux'
import { persistStore } from 'redux-persist'
import reduxThunk from 'redux-thunk'
import { rootReducers } from '../reducers'

const bindMiddleware = (middleware) => {
    if (!['production', 'staging'].includes(process.env.NODE_ENV)) {
        const { composeWithDevTools } = require('redux-devtools-extension')
        return composeWithDevTools(applyMiddleware(...middleware))
    }
    return applyMiddleware(...middleware)
}

const createReducer = (injectedReducers = {}) => {
    // injectedReducers for redux-injectors if need to split reducer per page
    const newReducer = combineReducers({
      ...injectedReducers,
      ...rootReducers,
    })
  
    return newReducer
  }

const makeConfiguredStore = () => {
    const store = createStore(
        createReducer(), 
        compose(
            bindMiddleware([reduxThunk])
        )
    )

    return store
}

const makeStore = () => {
    const store = makeConfiguredStore()
    store.__persistor = persistStore(store)
    return store
}

export const Store = makeStore()