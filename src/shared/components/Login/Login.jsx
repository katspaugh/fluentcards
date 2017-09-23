import React from 'react';
import User from '../../services/User';
import styles from './Login.css';

export default class Login extends React.PureComponent {
  constructor() {
    super();

    this.state = { email: '', userData: null };

    this._onSubmit = this.onSubmit.bind(this);
  }

  onLogin(data) {
    this.setState({
      email: data.email,
      userData: data
    });
  }

  // login callback
  loginCallback(response) {
    if (response.status === 'PARTIALLY_AUTHENTICATED') {
      User.requestToken(response.code, response.state)
        .then(data => {
          User.set(data);
          this.onLogin(data);
        });
    }
    else if (response.status === 'NOT_AUTHENTICATED') {
      // handle authentication failure
    }
    else if (response.status === 'BAD_PARAMS') {
      // handle bad parameters
    }
  }

  onSubmit(e) {
    e.preventDefault();

    window.AccountKit.login(
      'EMAIL',
      { emailAddress: this.state.email },
      this.loginCallback.bind(this)
    );
  }

  componentDidMount() {
    User.requestAppId().then(data => {
      if (window.AccountKit && window.AccountKit.init) {
        AccountKit.init(data);
      } else {
        window.AccountKit_OnInteractive = () => {
          window.AccountKit.init(data);
        };
      }
    });

    const savedUser = User.get();
    if (savedUser) {
      if (savedUser.expiresAt > Date.now()) {
        this.onLogin(savedUser);
      } else {
        this.setState({ email: savedUser.email });
      }
    }
  }

  render() {
    return this.state.userData ? (
      <div className={ styles.container }>
        { this.state.email }
      </div>
    ) : (
      <div className={ styles.container }>
        <button onClick={ this._onSubmit }>Login via email</button>
        { ' ' }
      </div>
    );
  }
}
