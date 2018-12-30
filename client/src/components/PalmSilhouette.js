import React from 'react';
import classnames from 'classnames';
import './PalmSilhouette.scss';

export default ({ isFlashing }) => (
  <div className={classnames('PalmSilhouette', {'is-flashing': isFlashing})}>
    <img src='/assets/images/palms.png' className='palm left' alt='palm'/>
    <img src='/assets/images/palms.png' className='palm right' alt='palm'/>
    <img src='/assets/images/console.png' className='console' alt='console'/>
  </div>
);