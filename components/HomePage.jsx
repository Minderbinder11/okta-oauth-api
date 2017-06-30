import React from 'react';
import axios from 'axios';
import OktaAuth from '@okta/okta-auth-js';
import config from '../config.json'

export default class HomePage extends React.Component {

  constructor (props) {
    super (props);
    this.loginClick = this.loginClick.bind(this);
    this.authClient = new OktaAuth({
      url: config.url,
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      scopes: ['openid', 'email', 'profile']
    });
    this.state = {
      username: '',
      password: '',
      idToken: ''
    };
    this.getResource = this.getResource.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  loginClick (e) {
    console.log('clicked');
    e.preventDefault();

    const that = this;
    this.authClient.signIn({
        username: 'pbarow@gmail.com',
        password: 'LA88escow'
      })
      .then(function(transaction) {

        console.log('response from okta: ', transaction);

        if (transaction.status === 'SUCCESS') {
          //this.authClient.session.setCookieAndRedirect(transaction.sessionToken); // Sets a cookie on redirect
          //that.authClient.session.setCookieAndRedirect(transaction.sessionToken);
          that.authClient.token.getWithoutPrompt({
              responseType: 'id_token', // or array of types
              sessionToken: transaction.sessionToken // optional if the user has an existing Okta session
            })
            .then(function(token) {
              // manage token or tokens
              console.log('this is where the token will come from', token.idToken);
              that.setState({
                idToken: token.idToken
              });
            })
            .catch(function(err) {
              // handle OAuthError
            });
        } else {
          throw 'We cannot handle the ' + transaction.status + ' status';
        }
      })
      .fail(function(err) {
        console.error(err);
      });
  }

  getResource() {
    console.log('get resource IdToken: ', this.state.idToken);

    var bearer = `Bearer ${this.state.idToken}`;
    console.log('bearer: ', bearer);
    axios.get('/data',{
        headers: {
        Authorization: bearer
      }
    }).then(response => {
      console.log('resppnse: ', response);
    });
  }

  handleUsernameChange (e) 	{ e.preventDefault(); this.setState({ username: e.target.value }); }
  handlePasswordChange (e) 	{ e.preventDefault(); this.setState({ password: e.target.value }); }

  render() {
    return (<div>
      <h6>Welcome to</h6>
      <div className="login-screen">
        <input 	type="email" className="login-input" placeholder="Email address"
                value={this.state.username} onChange={this.handleUsernameChange}></input>

        <input 	type="password" className="form-control input-margin" placeholder="Password"
                value={this.state.password} onChange={this.handlePasswordChange}></input>

        <button onClick={this.loginClick}>Click Me</button>
        <button onClick={this.getResource}>Get Resource</button>
      </div>
    </div>);
  }

};