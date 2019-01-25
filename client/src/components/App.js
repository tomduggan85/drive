
import React, { Component } from 'react';
import { Provider } from 'react-redux';
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
import store from '../store';

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path='/match/:matchId/remote' component={DriveRemoteControlPage}/>
            <Route path='/match/:matchId' component={DriveMatchPage}/>
            <Route path='/select-vehicle' component={SelectVehiclePage} />
            <Route component={SplashPage} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
