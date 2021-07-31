import * as ActionTypes from './ActionTypes';

// TASK 3 comments.js: Update the reducer in this file to handle the ADD_COMMENT action type.
export const comments = (state = { errMess: null, comments: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_COMMENTS:
            return {...state, errMess: null, comments: action.payload};

        case ActionTypes.COMMENTS_FAILED:
            return {...state, errMess: action.payload};

        case ActionTypes.ADD_COMMENT:
            const comment = action.payload;
            comment.id = state.comments.length;
            return {...state, comments: state.comments.concat(comment)};    

        default:
            return state;
    }
};