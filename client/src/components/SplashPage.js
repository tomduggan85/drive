import React from 'react';
import './SplashPage.scss';
import StaticVehicleScene, { ANIMATION_TYPES } from '../3d/StaticVehicleScene';
import CameraRenderer from './CameraRenderer';
import PalmSilhouette from './PalmSilhouette';

class SplashPage extends React.Component {
  
  state = {
    isStarting: false,
  }

  constructor( props ) {
    super( props );
  
    this.scene = new StaticVehicleScene({
      vehicleType: 'chicago_limo',
      animationType: ANIMATION_TYPES.SPLASH_SPIN,
    });
  }

  start = () => {
    const { history } = this.props;
    this.setState({ isStarting: true });

    setTimeout(() => {
      history.push('/select-vehicle');
    }, 280 );
  }

  render() {
    const { isStarting } = this.state;

    return (
      <div className='SplashPage' onClick={this.start}>
        <PalmSilhouette isFlashing={isStarting} />
        <div className='title-section'>
          <div className='title-row'>American</div>
          <div className='title-row'>Demolition<span className='numeral'>64</span></div>
        </div>
        <CameraRenderer
          scene={this.scene}
          transparent={true}
          position={[ 0, 10, -35 ]}
          screenResolution={450}
        />
        <div className='start'>
          • press start •
        </div>
      </div>
    );
  }
}

export default SplashPage;