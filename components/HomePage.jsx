import React from 'react';
import axios from 'axios';

export default class HomePage extends React.Component {

  constructor (props) {
    super (props);
    this.loginClick = this.loginClick.bind(this);
  }

  loginClick (e) {
    e.preventDefault();
    axios.post('/login')
      .then(response => {
        // this will get the response from the login page
      });
  }

  render() {
    return (<div>
      <h6>Welcome to the Home Page</h6>
      <button onClick={this.loginClick}>Click Me</button>
    </div>);
  }

};