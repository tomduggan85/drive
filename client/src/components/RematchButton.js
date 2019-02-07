import React from 'react'
import './RematchButton.scss'

// Until Three / Physijs objects are released on unmount, do a hard page load instead of a react-router navigation to begin a new match.
const RematchButton = () => <a className='rematch-button' href='/select-vehicle'>• play again •</a>

export default RematchButton