# Description
The application is a game where the players get to guess each other's top songs on Spotify. The players join a game by logging in to their Spotify account. When the game has been started a song will appear and the player's have to guess which player has this song as their top song on Spotify. After everyone has guessed, one player reveals the answer. Then the next song can be displayed and the process is repeated until all songs have been gone through.

This project contains of:
* a frontend built in React
* a Node.js server using express
* a mongoDB database

# Team Members
Arvid Svedberg [(ArvidSve)](https://github.com/ArvidSve)

Amanda Papacosta [(amandapapacosta)](https://github.com/amandapapacosta)

Hampus Rhedin Stam [(hampusrs)](https://github.com/hampusrs)

Elin Hagman [(elinhagman)](https://github.com/elinhagman)

# File architecture
In the /client directory you can find everything related to the frontend, meanwhile the /server directory contains everything related to the backend.

## Client
In /client there is two directories, /public contains everything that should be public e.g. icons, images, logos etc. /src contains the source code.

/client/src/ is made up by three directories, /components, /pages and /services.

/components contains all of the react components that is used. These are sorted inte individual directores to include tests for all components.

/pages contains all of the react-pages that is used. These are sorted inte individual directores to include tests and styling for all pages.

/services contains all frontend-services that is used. There is one service for the moment, Spotify.tsx which checks the local storage in the browser to see if the user is logged in with a accurate spotify acces token.

## Server
In /server there is four directories, /dist is for the distributed version. /schema contains the database-related files. /src contains the source code. /test is for testing of the databse.

/server/src/ is made up by three directories, /model, /router and /service.

/model contains all objects e.g. Player and Song.

/router contains everything API-related, all requests are handled here.

/service contains all logic. All functions that change or manipluate the state of the game is here. 

# Set up and installation
Clone the repo and run `npm install` in the /server and /client folders.

## Server
The server is located in the /server folder.
For the server to be able to work properly, a file named **.env** with the following content has to be added to the /server folder.
``` 
CLIENT_ID=xxxxxxxxxxx
CLIENT_SECRET=xxxxxxxxxxx
REDIRECT_URI=http://localhost:8080/callback
```
To get access to these values, contact one of the team members. Alternatively, create an application in the Spotify Dashboard to recieve your own values.

### Run server
Run the following command in the /server folder
`npm run dev`

### Test server
Run the following command in the /server folder
`npm test`

## Client
The client is located in the /client folder.

### Run client
Run the following line in the /client folder
`npm start`

### Test client
Run the following command in the /client folder
`npm test`

# To play the game
To be able to join a game, you need to login with a Spotify account. For the application to be able to fetch your data, your Spotify account has to bee added as a user to the Spotify Dashboard application with the same client id as the one in the .env file.  
