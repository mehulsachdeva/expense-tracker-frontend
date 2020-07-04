import * as types from './../types';

const intialState = {
    loggedInDetails: {},
    currentExpense: {},
    selectedDay: "",
    openBackdrop: false,
    openModal: false
}

export const reducer = (state = intialState, action) => {
    switch(action.type) {
        case types.UPDATE_LOGGED_IN_DETAILS:
            return {
                ...state,
                loggedInDetails: action.data
            };
        case types.CHANGE_CURRENT_EXPENSE:
            return {
                ...state,
                currentExpense: action.data
            };
        case types.CHANGE_SELECTED_DAY:
            return {
                ...state,
                selectedDay: action.data
            };
        case types.TOGGLE_BACKDROP:
            return {
                ...state,
                openBackdrop: action.data
            };
        case types.TOGGLE_MODAL:
            return {
                ...state,
                openModal: action.data
            };
        default:
            return state;
    }
}