import React from 'react';
import './SplashPage.css';

class SplashPage extends React.Component {

  selectVehicle = ( playerIndex, vehicleType ) => {
    this.setState({
      [ `selectedVehiclePlayer${ playerIndex }` ]: vehicleType
    })
  }

  start = () => {
    this.props.history.push('/select-vehicle');
  }


  render() {
    return (
      <div className='SplashPage' onClick={this.start}>
        <div className='title'>
          <div className='title-row'>American</div>
          <div className='title-row'>Demolition</div>
        </div>
        <div className='start'>
          • press start •
        </div>
      </div>
    );
  }
}

export default SplashPage;