
import React, { Component } from 'react';
import './App.css';
import DriveMatchPage from './DriveMatchPage';
import SplashPage from './SplashPage';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

class App extends Component {

  render() {
    //next: <Route path='/match/:matchId/remote' component={DriveRemoteControlPage}/>

    return (
      <Router>
        <Switch>
          <Route path='/match/:matchId' component={DriveMatchPage}/>
          <Route component={SplashPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
