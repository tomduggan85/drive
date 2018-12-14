
const PORT = 8080

export const getSocket = ( matchId ) => {
  
  //return new WebSocket(`ws://${ window.location.hostname }:${ PORT }/match/${ matchId }`);


  /*
    NGROK / phone remote-control:
    1) ./ngrok http -subdomain td-socket 8080
    2) ./ngrok http -subdomain td-test 3000

    3) on laptop, http://localhost:3000/match/1
    4) on phone, http://td-test.ngrok.io/match/1/remote
  */
  return new WebSocket(`ws://td-socket.ngrok.io/match/${ matchId }`);
}