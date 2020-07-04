import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/user/Login';
import Registration from './components/user/Registration';
import Home from './components/user/Home';
import Manage from './components/user/Expenses/Manage';
import { compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from './common/reducer';
import * as serviceWorker from './serviceWorker';

const enhancers = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
  reducer,
  enhancers
)

ReactDOM.render(
  <React.StrictMode>
    <Provider store = {store}>
      <Router>
        <div>
          <Route exact path = "/" component = {Login} />
          <Route path = "/register" component = {Registration} />
          <Route path = "/home" component = {Home} />
          <Route path = "/manage" component = {Manage} />
        </div>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
