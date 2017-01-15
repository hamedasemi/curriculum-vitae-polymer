# Fortum ROST v1.0
Link to Confluence article: [Setting up a local development environment for the Web app](https://apegroup.atlassian.net/wiki/display/FORTUM/Setting+up+a+local+development+environment+for+the+Web+app)


## Getting started
---------------
1. Download and install [NodeJS](https://nodejs.org) (>=v6.0.0) if you don't have it already.

2. Clone the source code from Github. In the terminal type.

    `git clone git@github.com:apegroup/fortum-rost-web.git`

## Dependencies
------------
To install all the needed dependencies use the terminal to `cd` into the project folder and type:

    npm install

## View the project
Browse to http://localhost:4000 (if Browser Sync is running ).
Browser Sync will automatically refresh the webpage when changes in the files are detected.

## Development
-----------
1. Start Gulp.

    ```sh
    DEBUG=true npm run gulp
    ```

2. Start the Connect and Api Server

    ```sh
    DEBUG=true ENV=dev npm start
    ```

3. Start Browser Sync. This will open the project in your default browser.

    ```sh
    DEBUG=true npm run gulp sync
    ```

4. To stop the Node.js server and services type the following in the terminal.

    ```sh
    DEBUG=true npm stop
    ```

5. Testing

   ```sh
    npm run test:app
    ```



## Directory structure
-------------------
* `bin` - Startup enviroment script.
* `app` - the source code for Fortum Rost v1.0 app Side Web Application. This folder contains all assets, components, elements and shared resources.
* `gulp` - this folder contains all gulp plugins and tasks to build the project.
* `server` - lightweight NodeJS server.
* `www` - Distribution folder.
* `package.json` - node.js dependencies.


