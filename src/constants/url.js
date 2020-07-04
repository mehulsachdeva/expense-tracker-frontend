const DOMAIN = 'http://localhost:8082/expensetracker';

export const AUTHENTICATE_USER_LOGIN = `${DOMAIN}/login`;
export const REGISTER_USER = `${DOMAIN}/register`;

export const GET_FOOD_EXPENSES = `${DOMAIN}/api/expenses/food`;
export const GET_TRANSPORT_EXPENSES = `${DOMAIN}/api/expenses/transport`;
export const GET_ENTERTAINMENT_EXPENSES = `${DOMAIN}/api/expenses/entertainment`;
export const GET_BILLS_OR_RECHARGE_EXPENSES = `${DOMAIN}/api/expenses/billsorrecharge`;
export const GET_OTHER_EXPENSES = `${DOMAIN}/api/expenses/other`;

export const UPDATE_FOOD_EXPENSES = `${DOMAIN}/api/update/expenses/food`;
export const UPDATE_TRANSPORT_EXPENSES = `${DOMAIN}/api/update/expenses/transport`;
export const UPDATE_ENTERTAINMENT_EXPENSES = `${DOMAIN}/api/update/expenses/entertainment`;
export const UPDATE_BILLS_OR_RECHARGE_EXPENSES = `${DOMAIN}/api/update/expenses/billsorrecharge`;
export const UPDATE_OTHER_EXPENSES = `${DOMAIN}/api/update/expenses/other`;
