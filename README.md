# Drive
In-browser 3D driving game experiment, using React, [three.js](threejs.org), [physijs](http://chandlerprall.github.io/Physijs/).


### How to run
1) `cd client`
2) `npm start`
3) Open [http://localhost:3000](http://localhost:3000) in your browser. WASD controls the left vehicle, Arrow keys control the right vehicle.

### Remote control
A small websocket server exists in `/server`, to enable remote control of vehicles in a browser session from another browser:
1) `cd client`
2) `npm start:matchserver`
3) In host browser, start a match (i.e. http://localhost:3000/match/1234)
4) In remote browser, join the same match as a remote control: http://localhost:3000/match/1234/remote

It's currently only possible to control the left vehicle, as there's no player / vehicle selection built yet.
It's possible to start two [ngrok](http://ngrok.io) tunnels to remotely control a localhost match from an external device (i.e. an iphone) - instructions and a boolean switch are in `DriveMatchSocket.js`.

### 3D assets
[lada](https://sketchfab.com/models/c94daeb210b244729d634975c9ed0c5b) by [Renafox](https://sketchfab.com/kryik1023)  
[50s](https://sketchfab.com/models/95baa20ebc5d4d2e869f0b549be838fe) by [Renafox](https://sketchfab.com/kryik1023)  
[its_a_volvo](https://sketchfab.com/models/43da0e1729ca4e55b588b46907f2459b) by [filipeb2011](https://sketchfab.com/filipeb2011)  
[wheels](https://sketchfab.com/models/77828def0055475db5791f906c2b5cc2) by [filipeb2011](https://sketchfab.com/filipeb2011)  
[pontiac](https://sketchfab.com/models/57ea22641c9544d49c186421c3a95bb4) by [Renafox](https://sketchfab.com/kryik1023)  
[cruiser](https://sketchfab.com/models/91b5815c64eb43b0a88f6fdb9df774e4) by [Renafox](https://sketchfab.com/kryik1023)  
[work_truck](https://sketchfab.com/models/1fae2b50fbe14d2c98296a2560a38399) by [Renafox](https://sketchfab.com/kryik1023)  
[woodywagon](https://sketchfab.com/models/07d3cfbb2b5f440785fe0aead51e1ca1) by [filipeb2011](https://sketchfab.com/filipeb2011)  
[amc](https://sketchfab.com/models/4e087683648249a0a362100fc0f1e059) by [Renafox](https://sketchfab.com/kryik1023)  
[chicago_limo](https://www.cgtrader.com/3d-models/car/luxury/stretch-limo--2) by [Seismic3d](https://www.cgtrader.com/seismic3d)  
[thunderbird](https://sketchfab.com/models/544aa41de67b48cf89f8fcc2bb06e8f4) by [Renafox](https://sketchfab.com/kryik1023)  
[vg30](https://sketchfab.com/models/3d59c46f26944a9a98c450acf0951e3d) by [248](https://sketchfab.com/guest248)  
[untitled](https://sketchfab.com/models/632d4eb3ebbd4796b1353e5691c92edd) by [Renafox](https://sketchfab.com/kryik1023)  