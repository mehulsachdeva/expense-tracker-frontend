import * as types from './../types';

export const changeCurrentExpense = (data) => {
    return {
        type: types.CHANGE_CURRENT_EXPENSE,
        data
    }
}

export const changeSelectedDay = (data) => {
    return {
        type: types.CHANGE_SELECTED_DAY,
        data
    }
}

export const toggleBackdrop = (data) => {
    return {
        type: types.TOGGLE_BACKDROP,
        data
    }
}

export const toggleModal = (data) => {
    return {
        type: types.TOGGLE_MODAL,
        data
    }
}
