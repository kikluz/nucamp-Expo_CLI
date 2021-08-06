import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { campsites } from './campsites';
import { comments } from './comments';
import { promotions } from './promotions';
import { partners } from './partners';
import { favorites } from './favorites';
import { persistStore, persistCombineReducers  } from 'redux-persist';
import storage from 'redux-persist/es/storage';

// setup confi with values 
const  config = {
    // key property value root 
    key: 'root',
    // property of storage 
    storage,
    // redux persist to console msg for debug any issues 
    debug: true
}

export const ConfigureStore = () => {
    const store = createStore(
        // Handle update the state to local storage, reducer  is used to update redux store 
        // and config as the first argumenet 
        persistCombineReducers(config, {
            campsites,
            comments,
            partners,
            promotions,
            favorites
        }),
        applyMiddleware(thunk, logger)
    );

    // this anable the store to be persisted
    const persistor = persistStore(store);
// return an Object that contains both persistor and store
// so we can access both from App.js 
    return {persistor ,store}
}