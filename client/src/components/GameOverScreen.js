import React from 'react';
import { connect } from 'react-redux';
import getVehiclePlace from '../selectors/getVehiclePlace';
import getDamageInflicted from '../selectors/getDamageInflicted';
import getVehicleLifetime from '../selectors/getVehicleLifetime';
import './GameOverScreen.scss';

const MAX_TIME_BONUS = 300

const formatPlace = place => {
  switch( place ) {
    case 1: return '1st place'
    case 2: return '2nd place'
    case 3: return '3rd place'
    default: return `${ place }th place`
  }
}

const placeScoreValue = place => {
  switch( place ) {
    case 1: return 1000
    case 2: return 500
    case 3: return 400
    case 4: return 300
    case 5: return 200
    case 6: return 100
    default: return 0
  }
}

class GameOverScreen extends React.Component {

  calculate

  render() {
    const {
      vehicleLifetime,
      damageInflicted,
      place
    } = this.props;

    const playerWon = place === 1
    const titleText = playerWon ? 'You Won' : 'Game Over'

    const minutes = Math.floor( vehicleLifetime / 60 )
    const seconds = vehicleLifetime - minutes * 60
    const displayTime = (minutes ?`${ minutes }m ` : '') + `${ seconds }s`
    
    const totalScore = (
      damageInflicted * 10 +
      placeScoreValue( place ) +
      Math.min( vehicleLifetime * 2, MAX_TIME_BONUS )
    ).toLocaleString('en')
    const displayDamageInflicted = ( damageInflicted * 10 ).toLocaleString('en')

    return (
      <div className='game-over-screen'>
        <div className='game-over-title'>{ titleText }</div>
        <div className='score-container'>
          <div className='score-row'>Damage inflicted: {displayDamageInflicted}</div>
          <div className='score-row'>Time alive: {displayTime}</div>
          <div className='score-row'>Place: {formatPlace( place )}</div>
          <div className='score-row total'>Total score: {totalScore}</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ( state, ownProps ) => {
  return {
    damageInflicted: getDamageInflicted( ownProps.vehicleIndex )( state ),
    vehicleLifetime: getVehicleLifetime( ownProps.vehicleIndex )( state ),
    place: getVehiclePlace( ownProps.vehicleIndex )( state )
  }
}

export default connect(
  mapStateToProps
)( GameOverScreen );