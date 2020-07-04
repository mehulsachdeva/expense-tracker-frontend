import React, { Component } from 'react';
import ApiService from '../../../utilities/ApiService';
import { REGISTER_USER } from '../../../constants/url';

class Registration extends Component {

    state = {
        email: '',
        password: '',
        firstname: '',
        lastname: ''
    }

    changeFormValues = (event, field) => {
        this.setState({
            ...this.state,
            [field]: event.target.value
        })
    }

    registerUser = async () => {
        try {
            const response = await ApiService.post(REGISTER_USER, {
                ...this.state,
                role: "USER"
            });
            window.location.href = "/";
            console.log("response", response);
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
                                onChange = {(event) => this.changeFormValues(event, "email")}
                            />
                        </div>
                        <div class = "form-field-container">
                            <input 
                                type = "password"
                                placeholder = "Password"
                                onChange = {(event) => this.changeFormValues(event, "password")}
                            />
                        </div>
                        <div class = "form-field-container">
                            <input 
                                type = "text"
                                placeholder = "First Name"
                                onChange = {(event) => this.changeFormValues(event, "firstname")}
                            />
                        </div>
                        <div class = "form-field-container">
                            <input 
                                type = "text"
                                placeholder = "Last Name"
                                onChange = {(event) => this.changeFormValues(event, "lastname")}
                            />
                        </div>
                        <div class = "form-field-container">
                            <button onClick = {this.registerUser}>
                                REGISTER
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Registration