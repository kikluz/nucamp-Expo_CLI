import * as ActionTypes from './ActionTypes';

export const favorites = (state = [], action) => {
    switch (action.type) {
        
        case ActionTypes.ADD_FAVORITE:
            // if is favorite  array include check if matches id in the array
            if (state.includes(action.payload)) {
                // return preview state 
                return state;
            }
            // concat make a copy of array add a new item end of it return new array no mutating preview array  
            return state.concat(action.payload);

        default:
            return state;
    }
};