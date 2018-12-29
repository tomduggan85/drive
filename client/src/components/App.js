
import React, { Component } from 'react';
import './App.css';
import DriveMatchPage from './DriveMatchPage';
import SplashPage from './SplashPage';
import DriveRemoteControlPage from './DriveRemoteControlPage';
import SelectVehiclePage from './SelectVehiclePage';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route path='/match/:matchId/remote' component={DriveRemoteControlPage}/>
          <Route path='/match/:matchId' component={DriveMatchPage}/>
          <Route path='/select-vehicle' component={SelectVehiclePage} />
          <Route component={SplashPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
