import * as ActionTypes from './ActionTypes';

// TASK 3 comments.js: Update the reducer in this file to handle the ADD_COMMENT action type.
export const comments = (state = { errMess: null, comments: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_COMMENTS:
            return {...state, errMess: null, comments: action.payload};

        case ActionTypes.COMMENTS_FAILED:
            return {...state, errMess: action.payload};

            // Handle the ADD_COMMENT action type
        case ActionTypes.ADD_COMMENT:
            const comment = action.payload;
            // Add a unique id property to the new comment, based on the length of the comments array. 
            comment.id = state.comments.length;
            // Update the state with the new comment. 
            return {...state, comments: state.comments.concat(comment)};    

        default:
            return state;
    }
};