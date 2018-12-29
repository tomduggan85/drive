import React from 'react';
import './SplashPage.scss';
import StaticVehicleScene, { ANIMATION_TYPES } from '../3d/StaticVehicleScene';
import CameraRenderer from './CameraRenderer';
import classnames from 'classnames';

class SplashPage extends React.Component {
  
  state = {
    isStarting: false,
  }

  constructor( props ) {
    super( props );
  
    this.scene = new StaticVehicleScene({
      vehicleType: 'its_a_volvo',
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
      <div className={classnames( 'SplashPage', { 'is-starting': isStarting })} onClick={this.start}>
        <div className='silhouette-layer'>
          <img src='/assets/images/palms.png' className='palm left' alt='palm'/>
          <img src='/assets/images/palms.png' className='palm right' alt='palm'/>
          <img src='/assets/images/console.png' className='console' alt='console'/>
        </div>
        <div className='title-section'>
          <div className='title-row'>American</div>
          <div className='title-row'>Demolition<span className='numeral'>64</span></div>
        </div>
        <CameraRenderer
          scene={this.scene}
          transparent={true}
          position={[ 0, 10, -35 ]}
        />
        <div className='start'>
          • press start •
        </div>
      </div>
    );
  }
}

export default SplashPage;