import * as ActionTypes from './ActionTypes';

export const favorites = (state = [], action) => {
    switch (action.type) {
        
        case ActionTypes.ADD_FAVORITE:
            // if is favorite  array include check if matches id in the array
            if (state.includes(action.payload)) {
                // return preview state 
                return state;
            }
            // concat makes a copy of array add a new item end of it return new array no mutating preview array  
            return state.concat(action.payload);

        case ActionTypes.DELETE_FAVORITE:
            // use filter, create a new array from the favorites state, every campsite 
            // deos NOT match the campsite id in the action payload that creates a campsite id 
            // that no longer contains the campsite id and return as a new state.  
            return  state.filter(favorites => favorites != action.payload)

        default:
            return state;
    }
};