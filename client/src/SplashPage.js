import React from 'react';
import { Link } from 'react-router-dom';
import uuid from 'uuid';

class SplashPage extends React.Component {

  state = {
    matchId: uuid().substr(0, 5) //hacky random match id on each session
  }

  render() {
    return (
      <Link to={`/match/${ this.state.matchId }`}>Start</Link>
    );
  }
}

export default SplashPage;