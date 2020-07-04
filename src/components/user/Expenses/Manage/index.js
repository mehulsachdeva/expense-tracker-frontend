import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from './../../../shared/Modal';
import { changeCurrentExpense, toggleBackdrop, toggleModal } from '../../../../common/actions';
import * as urls from '../../../../constants/url';
import ApiService from '../../../../utilities/ApiService';
import { getCookie } from '../../../../helpers';
import * as values from '../../../../constants/values';

import './style.scss';

class ManageExpenses extends Component {

    state = {
        userId: 0,
        token: '',
        currentExpense: {},
        daySelected: '',
        daySelectedExpenses: [],
        daySelectedExpensesAmount: 0,
        updatedDaySelectedExpenses: [],
        newExpenseToBeAdded: false,
        newExpense: {
            description: '',
            amount: 0
        },
        updateExpense: false,
        updateExpenseIndex: 0,
        updatedExpense: {
            description: '',
            amount: 0
        }
    }

    componentWillMount() {
        const userId = getCookie("userId");
        const token = getCookie("token");
        const email = getCookie("email"); 
        
        if(!userId || !token || !email) {
            this.props.history.push("/");
        } else {
            const nowDate = new Date(); 
            const daySelected = nowDate.getFullYear() + '-' + 
                        ((nowDate.getMonth() + 1) < 10 ? '0' + (nowDate.getMonth() + 1) : (nowDate.getMonth() + 1)) 
                        + '-' + (nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate());
            
            this.setState({
                ...this.state,
                userId,
                token,
                daySelected
            }, () => {
                this.updateDaySelectedExpenses();
            })
        }
    }

    componentDidUpdate = () => {
        let updatedCurrentExpense = this.props.currentExpense;
        
        if(updatedCurrentExpense.amount !== this.state.currentExpense.amount) {
            this.setState({
                ...this.state,
                currentExpense: updatedCurrentExpense
            }, () => {
                this.updateDaySelectedExpenses();
            })
        }
    }

    updateDaySelectedExpenses = () => {
        this.props.toggleBackdrop(true);

        const { currentExpense } = this.props;
        const { daySelected } = this.state;
        const daySelectedExpenses = currentExpense.value.filter((item) => Object.keys(item)[0] === daySelected);
        
        this.setState({
            ...this.state,
            daySelected,
            currentExpense: currentExpense || [],
            daySelectedExpenses: daySelectedExpenses[0] ? daySelectedExpenses[0][daySelected] : [],
            updatedDaySelectedExpenses: daySelectedExpenses[0] ? daySelectedExpenses[0][daySelected] : [],
            totalExpense: currentExpense ? currentExpense.amount : 0
        }, () => {
            this.updateTotalExpensesAmountPerDay();
        })
    }

    updateTotalExpensesAmountPerDay = () => {
        const { daySelectedExpenses } = this.state;
        const daySelectedExpensesAmount = this.calculateExpensesAmountPerDay(daySelectedExpenses);
        
        this.setState({
            ...this.state,
            daySelectedExpensesAmount
        }, () => {
            this.props.toggleBackdrop(false);
        })
    }

    calculateExpensesAmountPerDay = (daySelectedExpenses) => {
        let amount = daySelectedExpenses ? 
            daySelectedExpenses.reduce((amount, current) => amount + current.amount, 0)
            : 0;
        return amount;
    }

    updateSelectedDay = (event) => {
        this.setState({
            ...this.state,
            daySelected: event.target.value
        }, () => {
            this.updateDaySelectedExpenses();
        })
    }

    deleteExpense = (index, amount) => {
        const updatedDaySelectedExpenses = this.state.updatedDaySelectedExpenses.filter((expense, i) => i !== index);
        const daySelectedExpensesAmount = this.calculateExpensesAmountPerDay(updatedDaySelectedExpenses);
        
        this.setState({
            ...this.state,
            updatedDaySelectedExpenses,
            daySelectedExpensesAmount
        }, () => {
            this.updateExpenses(amount);
        })
    }

    updateExpenses = async (amount) => {
        const { 
            userId, 
            token, 
            daySelected, 
            currentExpense 
        } = this.state;
        const header = currentExpense.header;
        const expenses = currentExpense.value;
        const obj = {
            [daySelected]: this.state.updatedDaySelectedExpenses
        }
        
        this.props.toggleBackdrop(true);

        for(let key in expenses) {
            if(Object.keys(expenses[key])[0] === daySelected) {
                expenses.splice(key, 1);
                expenses[key] = obj;
                break;
            }
        }      

        const body = {
            userId,
            expenses: JSON.stringify(expenses)
        } 

        try {
            let updateUrl = this.getUpdateUrl(header);;
            
            const response = await ApiService.postWithAuthentication(updateUrl, body, token);
            console.log(response);

            this.props.changeCurrentExpense({
                ...this.state.currentExpense,
                value: expenses,
                amount: this.state.currentExpense.amount - amount
            });

            this.props.toggleBackdrop(false);
        }catch(err) {
            this.props.toggleBackdrop(false);
            console.log(err);
        }
    }

    addDetailsForExpense = () => {
        this.setState({
            ...this.state,
            updateExpense: false,
            newExpenseToBeAdded: true
        }, () => {
            this.props.toggleModal(true);
        })
    }

    addExpense = async () => {
        const { 
            userId, 
            token, 
            daySelected, 
            newExpense, 
            currentExpense 
        } = this.state;
        const { 
            description, 
            amount 
        } = newExpense;
        const { header } = currentExpense;

        const obj = {
            description,
            amount
        }
        const expenses = this.state.currentExpense.value;
        
        let expenseAddingToNewDay = true;
        
        this.props.toggleBackdrop(true);

        for(let key in expenses) {
            if(Object.keys(expenses[key])[0] === daySelected) {
                expenseAddingToNewDay = false;
                expenses[key][daySelected].push(obj);
                break;
            }
        } 

        if(expenseAddingToNewDay) {
            let arr = [];
            arr.push(obj);
            expenses.push({
                [daySelected]: arr
            })
        }

        const body = {
            userId,
            expenses: JSON.stringify(expenses)
        } 

        try {
            let updateUrl = this.getUpdateUrl(header);
            
            const response = await ApiService.postWithAuthentication(updateUrl, body, token);
            console.log(response);

            this.setState({
                ...this.state,
                newExpenseToBeAdded: false,
                newExpense: {
                    description: '',
                    amount: 0
                }
            }, () => {
                this.props.changeCurrentExpense({
                    ...this.state.currentExpense,
                    amount: this.state.currentExpense.amount + obj.amount,
                    value: expenses
                });

                this.props.toggleBackdrop(false);
                this.props.toggleModal(false);
            })        
        }catch(err) {
            this.props.toggleBackdrop(false);
            this.props.toggleModal(false);
            console.log(err);
        }
    }

    changeNewExpenseDescription = (event) => {
        this.setState({
            ...this.state,
            newExpense: {
                ...this.state.newExpense,
                description: event.target.value
            }
        })
    }

    changeNewExpenseAmount = (event) => {
        this.setState({
            ...this.state,
            newExpense: {
                ...this.state.newExpense,
                amount: Number(event.target.value)
            }
        })
    }

    changeExistingExpenseDescription = (event) => {
        this.setState({
            ...this.state,
            updatedExpense: {
                ...this.state.updatedExpense,
                description: event.target.value
            }
        })
    }

    changeExistingExpenseAmount = (event) => {
        this.setState({
            ...this.state,
            updatedExpense: {
                ...this.state.updatedExpense,
                amount: Number(event.target.value)
            }
        })
    }

    updateDetailsOfExpense = (index) => {
        const { daySelected } = this.state;
        const expenses = this.state.currentExpense.value;

        for(let key in expenses) {
            if(Object.keys(expenses[key])[0] === daySelected) {
                const existingExpense = expenses[key][daySelected][index];
                this.setState({
                    ...this.state,
                    newExpenseToBeAdded: false,
                    updateExpenseIndex: index,
                    updateExpense: true,
                    updatedExpense: {
                        description: existingExpense.description,
                        amount: existingExpense.amount
                    }
                })
                break;
            }
        } 
        this.props.toggleModal(true); 
    }

    updateExpense = async (index) => {
        const { 
            userId, 
            token, 
            daySelected, 
            updatedExpense, 
            currentExpense 
        } = this.state;
        const { header } = currentExpense;
        const expenses = currentExpense.value;

        let amountToUpdate = 0;

        this.props.toggleBackdrop(true);

        for(let key in expenses) {
            if(Object.keys(expenses[key])[0] === daySelected) {
                const existingExpense = expenses[key][daySelected][index];
                amountToUpdate = Number(updatedExpense.amount) - existingExpense.amount;
                existingExpense.description = updatedExpense.description;
                existingExpense.amount = Number(updatedExpense.amount);
                break;
            }
        }  

        const body = {
            userId,
            expenses: JSON.stringify(expenses)
        } 

        try {
            let updateUrl = this.getUpdateUrl(header);

            const response = await ApiService.postWithAuthentication(updateUrl, body, token);
            console.log(response);

            this.setState({
                ...this.state,
                updateExpense: false,
                updateExpenseIndex: 0,
                updatedExpense: {
                    description: '',
                    amount: 0
                }
            }, () => {
                this.props.changeCurrentExpense({
                    ...this.state.currentExpense,
                    value: expenses,
                    amount: this.state.currentExpense.amount + amountToUpdate
                });

                this.props.toggleBackdrop(false);
                this.props.toggleModal(false);
            })
        }catch(err) {
            this.props.toggleBackdrop(false);
            this.props.toggleModal(false);
            console.log(err);
        }
    }

    cancelUpdateExpense = () => {
        this.props.toggleModal(false);
        this.setState({
            ...this.state,
            updateExpense: false,
            updatedExpense: {
                description: '',
                amount: 0
            }
        })
    }

    getUpdateUrl = (header) => {
        switch(header) {
            case values.FOOD_EXPENSES:
                return urls.UPDATE_FOOD_EXPENSES;
            case values.TRANSPORT_EXPENSES:
                return urls.UPDATE_TRANSPORT_EXPENSES;
            case values.ENTERTAINMENT_EXPENSES:
                return urls.UPDATE_ENTERTAINMENT_EXPENSES;
            case values.BILLS_OR_RECHARGE_EXPENSES:
                return urls.UPDATE_BILLS_OR_RECHARGE_EXPENSES;
            case values.OTHER_EXPENSES:
                return urls.UPDATE_OTHER_EXPENSES;
            default:
                throw Error(values.ERROR_MSG);
        }
    }

    render() {
        const { 
            currentExpense, 
            daySelected, 
            updatedDaySelectedExpenses, 
            daySelectedExpensesAmount ,
            newExpenseToBeAdded,
            updateExpense,
            updatedExpense,
            updateExpenseIndex,
        } = this.state;

        const { openModal } = this.props;

        return (
            <div class = "manage-expenses-container">
                <div class = "manage-expenses">
                    {
                        openModal && (
                            <Modal 
                                handleStateClose={this.props.toggleModal} 
                                openModal = {openModal}
                            >
                                <div class = "modal-container">
                                    {
                                        newExpenseToBeAdded && (
                                            <div class = "modal-add-expense-container">
                                                <div class = "header">
                                                    ADD EXPENSE
                                                </div>
                                                <div class = "form-field-container">
                                                    <div class = "label-container">
                                                        <label>Description</label>
                                                    </div>
                                                    <div>
                                                        <input
                                                            type = "text"
                                                            placeholder = "Description"
                                                            onChange = {this.changeNewExpenseDescription}
                                                        />
                                                    </div>
                                                </div>
                                                <div class = "form-field-container">
                                                    <div class = "label-container">
                                                        <label>Amount</label>
                                                    </div>
                                                    <div>
                                                        <input
                                                            type = "number"
                                                            placeholder = "Amount"
                                                            onChange = {this.changeNewExpenseAmount}
                                                        />
                                                    </div>
                                                </div>
                                                <div class = "form-field-container">
                                                    <button
                                                        class = "add-button"
                                                        onClick = {this.addExpense}
                                                    >
                                                        ADD
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        updateExpense && (
                                            <div class = "modal-update-expense-container">
                                                <div class = "header">
                                                    UPDATE EXPENSE
                                                </div>
                                                <div class = "form-field-container">
                                                    <div class = "label-container">
                                                        <label>Description</label>
                                                    </div>
                                                    <div>
                                                        <input
                                                            type = "text"
                                                            placeholder = "Description"
                                                            onChange = {this.changeExistingExpenseDescription}
                                                            value = {updatedExpense.description}
                                                        />
                                                    </div>
                                                </div>
                                                <div class = "form-field-container">
                                                    <div class = "label-container">
                                                        <label>Amount</label>
                                                    </div>
                                                    <div>
                                                        <input
                                                            type = "number"
                                                            placeholder = "Amount"
                                                            onChange = {this.changeExistingExpenseAmount}
                                                            value = {updatedExpense.amount}
                                                        />
                                                    </div>
                                                </div>
                                                <div class = "form-field-container">
                                                    <button
                                                        class = "update-button"
                                                        onClick = {() => this.updateExpense(updateExpenseIndex)}
                                                    >
                                                        CONFIRM
                                                    </button>
                                                    <button
                                                        class = "cancel-button"
                                                        onClick = {this.cancelUpdateExpense}
                                                    >
                                                        CANCEL
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </Modal>
                        )
                    }
                    <div class = "new-expense-btn-container">
                        <div class = "new-expense-button">
                            <Tooltip 
                                title = "Add" 
                                aria-label = "add"
                                styles = {{ position: "absolute", float: "right" }}
                                onClick = {this.addDetailsForExpense}
                            >
                                <Fab color="primary">
                                    <AddIcon />
                                </Fab>
                            </Tooltip>
                        </div>
                    </div>
                    <div class = "current-expense-header">
                        {currentExpense.header}
                    </div>
                    <div class = "date-field-container">
                        <input
                            type = "date"
                            value = {daySelected}
                            onChange = {this.updateSelectedDay}
                        />
                    </div>
                    <div>
                        { 
                            updatedDaySelectedExpenses && updatedDaySelectedExpenses.map((expense, i) => {
                                return (
                                    <div key = {i}>
                                        <div>
                                            {expense.description} {expense.amount}
                                        </div>
                                        <div>
                                            <button 
                                                onClick = {() => this.deleteExpense(i, expense.amount)}
                                            >
                                                DELETE
                                            </button>
                                        </div>
                                        <div>
                                            <button 
                                                onClick = {() => this.updateDetailsOfExpense(i)}
                                            >
                                                EDIT
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div class = "expenses-amount-container">
                        <div class = "per-day-container">
                            Expensed By Day: {daySelectedExpensesAmount}
                        </div>
                        <div class = "total-expense-container">
                            Total Expenses: {currentExpense.amount}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentExpense: state.currentExpense,
        selectedDate: state.selectedDate,
        selectedDateExpense: state.selectedDateExpense,
        openBackdrop: state.openBackdrop,
        openModal: state.openModal
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeCurrentExpense: (data) => dispatch(changeCurrentExpense(data)),
        toggleBackdrop: (data) => dispatch(toggleBackdrop(data)),
        toggleModal: (data) => dispatch(toggleModal(data))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ManageExpenses)