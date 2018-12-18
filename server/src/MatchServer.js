const WebSocket = require('ws');

const port = 8080
let lastConnectionId = 0;
const matchConnections = {};
 
const wss = new WebSocket.Server({ port });

console.log(`Started MatchServer at port ${ port }`);

wss.on('connection', ( connection, request ) => {

  const splitUrl = request.url.split('/')
  const matchId = splitUrl[splitUrl.length - 1];
  const connectionId = lastConnectionId++

  console.log(`Connection id ${connectionId} opened for matchId ${ matchId }`);

  if (!matchConnections[matchId]) {
    matchConnections[matchId] = {};
  }

  matchConnections[ matchId ][ connectionId ] = connection;

  connection.on('message', ( message ) => {
    // Echo to all others in match
    Object.values( matchConnections[ matchId ]).forEach(( matchConnection ) => {
      matchConnection.send( message );
    });
  });
 
  
  connection.on('close', () => {
    console.log(`Closing connection id ${ connectionId }`)
    delete matchConnections[ matchId ][ connectionId ];
  })
});