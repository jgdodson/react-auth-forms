import React from 'react';

import EmailValidator from 'email-validator';

import styles from '../css/LoginForm.css';

export default class LoginForm extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            email: '',
            password: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    render() {
        return (
            <div>
                <form action={this.props.formAction} method="post" onSubmit={this.handleSubmit}
                      id="login-form" className="entry-form">

                    <div className="form-group">
                        <label htmlFor="login-email-input" className="EntryFormFieldLabel">
                            Email
                        </label>
                        <input onChange={this.handleInputChange} name="email" type="email" className="form-control"
                               id="login-email-input"
                               value={this.state.email} placeholder="Email"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-password-input" className="EntryFormFieldLabel">
                            Password
                        </label>
                        <input onChange={this.handleInputChange} name="password" type="password"
                               className="form-control" id="login-password-input"
                               value={this.state.password} placeholder="Password"/>
                    </div>

                    <button type="submit" className={`btn btn-default`}>
                        Login
                    </button>
                </form>
            </div>
        )
    }


    /**
     * Handle a change to one of the input fields
     *
     * @param e
     */
    handleInputChange(e) {

        this.setState({
            [e.target.name]: e.target.value
        });

    }


    /**
     * Determine whether the current form values are ready for submission
     *
     * TODO: Apparently, this method doesn't get run until the user focuses on a form field. Auto-fill messes with things a bit
     *
     * So, the problem is with Chrome. Auto-filled password values don't show up until the user interacts with the page.
     *
     * @return {boolean}
     */
    inputIsValid() {

        // Is the email valid?
        const email = EmailValidator.validate(this.state.email);

        // Is the password valid?
        const password = (this.state.password.length >= this.props.minPasswordLength && this.state.password.length <= this.props.maxPasswordLength);

        return email && password;
    }

    /**
     * Called just after component has mounted
     *
     */
    componentDidMount() {

        setTimeout(() => {

            this.setState({
                email: document.getElementById("login-email-input").value,
                password: document.getElementById("login-password-input").value
            });

        }, 150)

    }

    /**
     * Handle submission of the log-in form
     *
     * This is where we validate the form data, alerting the user in case of error
     *
     * @param e
     */
    handleSubmit(e) {


        if (!this.inputIsValid()) {

            e.preventDefault();

            alert("Invalid credentials");
        }

    }

}