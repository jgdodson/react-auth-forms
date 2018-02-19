import React from 'react';

import EmailValidator from 'email-validator';

import styles from '../css/SignupForm.css';

export default class SignupForm extends React.Component {


    constructor(props) {

        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            captchaResponse: '',
            submitted: false
        };

        this.inputIsValid = this.inputIsValid.bind(this);
        this.updateCaptchaResponse = this.updateCaptchaResponse.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.passwordIsObvious = this.passwordIsObvious.bind(this);
    }


    render() {

        return (

            <div className="EntryFormContainer">

                {
                    (this.state.submitted) ?
                        (
                            <p id="successful-signup-message">
                                Congratulations! Your account has been created! You should receive a
                                confirmation email in a few minutes. Click the link inside to verify your account, and
                                then you will be able to login.
                            </p>
                        )
                        : (
                            <form id="SignupForm" onSubmit={this.handleSubmit}>

                                <div className="FormField">
                                    <label htmlFor="signup-username-input" className="EntryFormFieldLabel">
                                        Username
                                    </label>
                                    {
                                        (this.state.username.length < this.props.minUsernameLength || this.state.username.length > this.props.maxUsernameLength) && (
                                            <span
                                                className='SignupInputInfo'>{`(${this.props.minUsernameLength} to ${this.props.maxUsernameLength} characters)`}
                                            </span>
                                        )
                                    }
                                    <input onChange={this.handleInputChange}
                                           minLength={this.props.minUsernameLength}
                                           name="username" type="text" className=""
                                           autoComplete='off'
                                           id="signup-username-input"
                                           placeholder="Username" value={this.state.username} required/>


                                </div>

                                <div className="FormField">
                                    <label htmlFor="signup-email-input" className="EntryFormFieldLabel">
                                        Email
                                    </label>
                                    {
                                        (EmailValidator.validate(this.state.email)) || (
                                            <span className='SignupInputInfo'>{`(Required)`}</span>
                                        )
                                    }
                                    <input onChange={this.handleInputChange}
                                           name="email" type="email" className=""
                                           id="signup-email-input"
                                           placeholder="Email" value={this.state.email} required/>
                                </div>

                                <div className="FormField">
                                    <label htmlFor="SignupPassword" className="EntryFormFieldLabel">
                                        Password
                                    </label>
                                    {
                                        (this.state.password.length < this.props.minPasswordLength || this.state.password.length > this.props.maxPasswordLength) && (
                                            <span
                                                className='SignupInputInfo'>{`(${this.props.minPasswordLength} to ${this.props.maxPasswordLength} characters)`}</span>
                                        )
                                    }
                                    <input onChange={this.handleInputChange}
                                           name="password" type="password" className=""
                                           id="SignupPassword"
                                           autoComplete='off'
                                           placeholder="Password" value={this.state.password} required/>
                                </div>

                                {
                                    (this.passwordIsObvious()) && (
                                        <div id="ObviousPasswordWarning">
                                            That password is kinda obvious
                                        </div>
                                    )
                                }


                                <div id="CaptchaContainer"
                                     className="g-recaptcha"
                                     data-callback="captchaDataCallback"
                                     data-expired-callback="captchaDataExpiredCallback"
                                     data-sitekey={this.props.captchaKey}/>

                                <button type="submit" id="SignupButton"
                                        className={`${(this.inputIsValid() ? "ActiveSubmit" : "")}`}
                                        disabled={!this.inputIsValid()}>
                                    Signup
                                </button>

                                <span>{this.props.bannerMessage}</span>
                            </form>
                        )
                }
            </div>

        )

    }

    /**
     * Test whether the form is ready for submission
     *
     * @return {boolean}
     */
    inputIsValid() {

        const username = (this.state.username.length >= this.props.minUsernameLength && this.state.username.length <= this.props.maxUsernameLength);
        const email = EmailValidator.validate(this.state.email);
        const password = (this.state.password.length >= this.props.minPasswordLength && this.state.password.length <= this.props.maxPasswordLength);
        const captcha = this.state.captchaResponse.length > 0;

        return username && email && password && captcha && !this.passwordIsObvious();
    }

    /**
     * Update the captchaResponse state
     *
     * @param updatedResponse
     */
    updateCaptchaResponse(updatedResponse) {

        this.setState({
            captchaResponse: updatedResponse
        })

    }

    /**
     * Check for obvious passwords
     */
    passwordIsObvious() {

        let obvious = ['password'];

        return (this.state.password !== "") && (
            obvious.includes(this.state.password) || (this.state.password === this.state.username)
        );
    }

    /**
     *
     * @param e
     */
    handleInputChange(e) {

        this.setState({
            [e.target.name]: e.target.value
        });

    }

    /**
     * Submit the sign-up form asynchronously
     *
     * @param e
     */
    handleSubmit(e) {

        e.preventDefault();

        submitDataAsync(this.state, '/users/add', false, (response) => {

            if (response.success === true) {

                this.setState({
                    username: '',
                    email: '',
                    password: '',
                    submitted: true
                });

            } else if (response.success === false) {


                // If a field was invalid, clear it and leave rest of form intact
                if (response.code === "username-taken" || response.code === "bad-username") {
                    this.setState({
                        username: ""
                    });

                    // TODO: Reset the captcha


                    if (response.code === "username-taken") {
                        alert("That username is already in use. Please select another.");
                    } else if (response.code === "bad-username") {
                        alert("That username is not allowed. Please select another.");
                    }


                } else if (response.code === "email-taken") {
                    this.setState({
                        email: ""
                    });


                    // TODO: Reset the captcha

                    alert("That email is already in use. Please select another.");
                }

                else if (response.code === "undelivered-email") {

                    alert("We created your account, but there was a problem delivering your confirmation email");

                }

                else if (response.code === "captcha-expired") {

                    this.setState({
                        captchaResponse: ''
                    });

                    // Reset the captcha
                    grecaptcha.reset();

                    alert("Captcha expired. Please try again.");
                }
            }

        });

    }

}