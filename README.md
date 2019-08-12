# login-app
  App which provides signup and login pages to create and authenticate user

## Setup

* Clone the project
* Go to client directory
* Run `yarn install`
* Go to server directory
* Run `yarn install`
* Start the client by running `yarn start` in client directory
* Start the backend server by running `yarn start` in server directory

## Run Using Docker
  Run following commands to run app using docker 
### MongoDB Setup
* docker pull mongo:3.4.17
* docker run -d -p 27017-27019:27017-27019 --name mongodb mongo:3.4.17
* docker network inspect bridge (IPv4 address of mongodb container)
* Give IPv4 address found in above step in the server.js mongodb connection
### Server Setup
* docker build -t login-app .
* docker run -d -p 80:4000 --name loginApp --rm login-app
  Navigate to `localhost` on your browser