import React from 'react';
import './DriveMatchPage.css';
import DriveScene from '../3d/DriveScene';
import PlayerVehicleDisplay from './PlayerVehicleDisplay';
import { getSocket } from '../shared/DriveMatchSocket';
import getAllPlayersFinished from '../selectors/getAllPlayersFinished';
import RematchButton from './RematchButton';
import { connect } from 'react-redux';

class DriveMatchPage extends React.Component {

  constructor( props ) {
    super( props );
    
    const { matchId } = props.match.params;
    this.socket = getSocket( matchId );

    const params = new URLSearchParams(window.location.search);
    this.driveScene = new DriveScene({
      socket: this.socket,
      playerVehicles: [
        params.get('p1'),
        params.get('p2'),
      ]
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    const { allPlayersFinished } = this.props

    return (
      <div className="drive-match-page">
        <PlayerVehicleDisplay scene={this.driveScene} vehicleIndex={0} />
        <PlayerVehicleDisplay scene={this.driveScene} vehicleIndex={1} />
        {allPlayersFinished && <RematchButton />}
      </div>
    );
  }
}

const mapStateToProps = ( state ) => ({
  allPlayersFinished: getAllPlayersFinished( state ),
})

export default connect(
  mapStateToProps,
  null
)( DriveMatchPage );