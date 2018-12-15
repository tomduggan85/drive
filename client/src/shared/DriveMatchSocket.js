
const PORT = 8080;

const USE_NGROK_TEST = false;

/*
    ngrok / phone remote-control testing instructions for localhost
    THis assumes pro ngrok plan, which lets you choose subdomain.  If free plan, adjust below urls with ngrok-provided subdomains

    1) in terminal window: ./ngrok http -subdomain drivegame-socket 8080
    2) in another terminal window: ./ngrok http -subdomain drivegame 3000
    3) on laptop, http://localhost:3000/match/1
    4) on phone, http://drivegame.ngrok.io/match/1/remote
  */

export const getSocket = ( matchId ) => {

  if ( USE_NGROK_TEST ) {
    return new WebSocket(`ws://drivegame-socket.ngrok.io/match/${ matchId }`);
  }
  
  return new WebSocket(`ws://${ window.location.hostname }:${ PORT }/match/${ matchId }`);
}