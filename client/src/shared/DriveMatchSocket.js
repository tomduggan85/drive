
const PORT = 8080

export const getSocket = ( matchId ) => {
  return new WebSocket(`ws://${ window.location.hostname }:${ PORT }/match/${ matchId }`);
}