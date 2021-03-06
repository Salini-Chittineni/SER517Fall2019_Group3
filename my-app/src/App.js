import React, { Component} from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toolbar from './components/Toolbar/Toolbar';
import './components/Toolbar/Toolbar.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false
    };
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }
  render(){
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
  return (

      <Router>
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        Welcome to Brew Day!
      </header>

      </div>
      </Router>
  );

}
}


export default () => <Toolbar />;

