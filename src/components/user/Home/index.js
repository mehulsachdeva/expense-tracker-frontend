import React, { Component } from 'react';
import Chart from 'react-google-charts';
import Backdrop from './../../shared/Backdrop';
import { connect } from 'react-redux'
import { getCookie } from '../../../helpers';
import ApiService from '../../../utilities/ApiService';
import { 
    GET_FOOD_EXPENSES, 
    GET_TRANSPORT_EXPENSES, 
    GET_ENTERTAINMENT_EXPENSES, 
    GET_BILLS_OR_RECHARGE_EXPENSES, 
    GET_OTHER_EXPENSES 
} from '../../../constants/url';
import { changeCurrentExpense, toggleBackdrop } from '../../../common/actions';
import * as values from '../../../constants/values';

import './style.scss';

const pieChartSize = {
    width: '800px',
    height: '500px'
}

const pieChartVariableOptions = {
    legend: {
        position: "right",
        alignment: "center",
        textStyle: {
            fontSize: 12
        }
    },
    chartArea: {
        left: 0,
        top: 0,
        width: "90%",
        height: "80%"
    },
}

class Home extends Component  {

    state = {
        userId: 0,
        token: '',
        expenses: {
            foodExpenses: [],
            transportExpenses: [],
            entertainmentExpenses: [],
            billsOrRechargeExpenses: [],
            otherExpenses: []
        },
        expensesAmount: {
            foodExpenses: 0,
            transportExpenses: 0,
            entertainmentExpenses: 0,
            billsOrRechargeExpenses: 0,
            otherExpenses: 0
        }
    }

    componentWillMount() {
        if(window.screen.width < 768) {
            pieChartSize.width = '100vw';
            pieChartSize.height = '350px';
            pieChartVariableOptions.legend.position = "bottom";
            pieChartVariableOptions.legend.textStyle.fontSize = 7;
            pieChartVariableOptions.chartArea.width = "100%";
            pieChartVariableOptions.chartArea.height = "80%";
        }
        const userId = getCookie("userId");
        const token = getCookie("token");
        const email = getCookie("email");
        if(!userId || !token || !email) {
            this.props.history.push("/");
        }else {
            this.setState({
                ...this.state,
                userId,
                token
            })
        }
    }

    componentDidMount = async () => {
        const { userId, token } = this.state;
        
        try {
            this.props.toggleBackdrop(true);
            
            const foodResponse = await ApiService.getWithAuthentication(`${GET_FOOD_EXPENSES}/${userId}`, token);
            const transportResponse = await ApiService.getWithAuthentication(`${GET_TRANSPORT_EXPENSES}/${userId}`, token);
            const entertainmentResponse = await ApiService.getWithAuthentication(`${GET_ENTERTAINMENT_EXPENSES}/${userId}`, token);
            const billsOrRechargeResponse = await ApiService.getWithAuthentication(`${GET_BILLS_OR_RECHARGE_EXPENSES}/${userId}`, token);
            const otherResponse = await ApiService.getWithAuthentication(`${GET_OTHER_EXPENSES}/${userId}`, token);
            
            this.props.toggleBackdrop(false);
            
            this.setState({
                expenses: {
                    ...this.state.expenses,
                    foodExpenses: foodResponse.RESPONSE ? JSON.parse(foodResponse.RESPONSE) : [],
                    transportExpenses: transportResponse.RESPONSE ? JSON.parse(transportResponse.RESPONSE) : [],
                    entertainmentExpenses: entertainmentResponse.RESPONSE ? JSON.parse(entertainmentResponse.RESPONSE) : [],
                    billsOrRechargeExpenses: billsOrRechargeResponse.RESPONSE ? JSON.parse(billsOrRechargeResponse.RESPONSE) : [],
                    otherExpenses: otherResponse.RESPONSE ? JSON.parse(otherResponse.RESPONSE) : [],
                }
            }, () => {
                const { 
                    foodExpenses, 
                    transportExpenses, 
                    entertainmentExpenses, 
                    billsOrRechargeExpenses, 
                    otherExpenses
                } = this.state.expenses;
                
                this.setState({
                    expensesAmount: {
                        foodExpenses: this.calculateExpensesAmountPerCategory(foodExpenses),
                        transportExpenses: this.calculateExpensesAmountPerCategory(transportExpenses),
                        entertainmentExpenses: this.calculateExpensesAmountPerCategory(entertainmentExpenses),
                        billsOrRechargeExpenses: this.calculateExpensesAmountPerCategory(billsOrRechargeExpenses),
                        otherExpenses: this.calculateExpensesAmountPerCategory(otherExpenses)
                    }
                })
            })
        }catch(err) {
            this.props.toggleBackdrop(false);
            console.log(err);
        }
    }

    calculateExpensesAmountPerCategory = (expenseCategoryObject) => {
        let totalAmount = 0;
        
        for(let key in expenseCategoryObject) {
            let innerKey = Object.keys(expenseCategoryObject[key])[0];
            totalAmount += expenseCategoryObject[key][innerKey].reduce((amount, current) => amount + current.amount, 0);
        }
        
        return totalAmount;
    }

    openManageExpenses = (event, header) => {
        const id = event.target.id;
        
        this.props.changeCurrentExpense({
            header,
            value: this.state.expenses[id],
            amount: this.state.expensesAmount[id]
        })
        
        this.props.history.push('/manage')
    }

    render() {
        const { expensesAmount } = this.state;
        const { openBackdrop } = this.props;
        return (
            <div class = "home-container">
                {
                    openBackdrop && <Backdrop openBackdrop = {openBackdrop} />
                }
                <div class = "home-container-header">
                    EXPENSE TRACKER
                </div>
                <div class = "expenses-details-container">
                    <div class = "category-expenses-details">
                        <div class = "category">
                            Food <br/> Expenses
                        </div>
                        <div class = "amount">
                            {expensesAmount.foodExpenses}
                        </div>
                        <div class = "">
                            <button 
                                id = {values.FOOD_EXPENSES_ID}
                                onClick={(event) => this.openManageExpenses(event, values.FOOD_EXPENSES)}
                            >
                                    MANAGE
                            </button>
                        </div>
                    </div>
                    <div class = "category-expenses-details">
                        <div class = "category">
                            Transport <br/> Expenses
                        </div>
                        <div class = "amount">
                            {expensesAmount.transportExpenses}
                        </div>
                        <div>
                            <button
                                id = {values.TRANSPORT_EXPENSES_ID}
                                onClick={(event) => this.openManageExpenses(event, values.TRANSPORT_EXPENSES)}
                            >
                                MANAGE
                            </button>
                        </div>
                    </div>
                    <div class = "category-expenses-details">
                        <div class = "category">
                            Entertainment <br/> Expenses
                        </div>
                        <div class = "amount">
                            {expensesAmount.entertainmentExpenses}
                        </div>
                        <div>
                            <button
                                id = {values.ENTERTAINMENT_EXPENSES_ID}
                                onClick={(event) => this.openManageExpenses(event, values.ENTERTAINMENT_EXPENSES)}
                            >
                                MANAGE
                            </button>
                        </div>
                    </div>
                    <div class = "category-expenses-details">
                        <div class = "category">
                            Bills and Recharge <br/> Expenses 
                        </div>
                        <div class = "amount">
                            {expensesAmount.billsOrRechargeExpenses}
                        </div>
                        <div>
                            <button
                                id = {values.BILLS_OR_RECHARGE_EXPENSES_ID}
                                onClick={(event) => this.openManageExpenses(event, values.BILLS_OR_RECHARGE_EXPENSES)}
                            >
                                MANAGE
                            </button>
                        </div>
                    </div>
                    <div class = "category-expenses-details">
                        <div class = "category">
                            Other <br/> Expenses
                        </div>
                        <div class = "amount">
                            {expensesAmount.otherExpenses}
                        </div>
                        <div>
                            <button
                                id = {values.OTHER_EXPENSES_ID}
                                onClick={(event) => this.openManageExpenses(event, values.OTHER_EXPENSES)}
                            >
                                MANAGE
                            </button>
                        </div>
                    </div>
                </div>
                <div class = "expenses-graph-container">
                    <Chart
                        class = "expenses-graph"
                        fill = {'rgba(0, 0, 0, 0)'}
                        width = {pieChartSize.width}
                        height = {pieChartSize.height}
                        chartType = "PieChart"
                        loader = {
                            <div>
                                Loading Chart
                            </div>
                        }
                        data = {[
                            ['Task', 'Hours per Day'],
                            ['Food', expensesAmount.foodExpenses],
                            ['Transport', expensesAmount.transportExpenses],
                            ['Entertainment', expensesAmount.entertainmentExpenses],
                            ['Bills or Recharge', expensesAmount.billsOrRechargeExpenses],
                            ['Other', expensesAmount.otherExpenses]
                        ]}
                        options = {{
                            title: 'Expenses Breakdown',
                            slices: {
                                0: { color: '#6050DC' },
                                1: { color: '#D52DB7' },
                                2: { color: '#FF2E7E' },
                                3: { color: '#FF6B45' },
                                4: { color: '#FFAB05' },
                            },
                            ...pieChartVariableOptions
                        }}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        openBackdrop: state.openBackdrop
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeCurrentExpense: (data) => dispatch(changeCurrentExpense(data)),
        toggleBackdrop: (data) => dispatch(toggleBackdrop(data))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)