# movie-app

## Installation instructions

1. Install [nodejs](https://nodejs.org/en/download/)

2. Run `npm i` in the terminal in the same directory as the package.json file to install dependencies

3. Download and install the oracle client. Further instructions [here](https://oracle.github.io/node-oracledb/INSTALL.html#instosx)

4. In server.js you will need to change the following line of code
`oracledb.initOracleClient({ libDir: '/Users/ryanstrickler/Downloads/instantclient_19_8' });`. The path in `libDir` needs to match the path to your oracle client you installed from the previous step.

5. In apiRoutes.js you will need to change the user and mypw variables to your own CISE credentials.

## Running the app

1. Connect to the UF VPN.

2. Run `node server` in the terminal. If you get an error here due to the port already being in use, you can change the port number in server.js.

3. In your browser, navigate to [localhost:3001/](localhost:3001/)