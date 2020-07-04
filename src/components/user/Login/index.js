import React, { Component } from 'react';
import { AUTHENTICATE_USER_LOGIN } from '../../../constants/url';
import ApiService from '../../../utilities/ApiService';
import { addCookie } from '../../../helpers';

class Login extends Component {
    
    state = {
        email: '',
        password: ''
    }

    changeEmail = (event) => {
        this.setState({
            ...this.state,
            email: event.target.value
        })
    }

    changePassword = (event) => {
        this.setState({
            ...this.state,
            password: event.target.value
        })
    }

    authenticateUserLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await ApiService.post(AUTHENTICATE_USER_LOGIN, {...this.state});
            const userId = JSON.parse(response.RESPONSE).userId;
            const email = JSON.parse(response.RESPONSE).email;
            const token = JSON.parse(response.RESPONSE).token;
            addCookie("token", token);
            addCookie("userId", userId);
            addCookie("email", email);
            this.props.history.push('/home')
        }catch(err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div>
                <div>
                    <form>
                        <div class = "form-field-container">
                            <input 
                                type = "email" 
                                placeholder = "Email" 
                                onChange = {this.changeEmail}
                            />
                        </div>
                        <div class = "form-field-container">
                            <input 
                                type = "password" 
                                placeholder = "Password" 
                                onChange = {this.changePassword}
                            />
                        </div>
                        <div class = "form-field-container">
                            <button onClick = {this.authenticateUserLogin}>
                                LOGIN
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login