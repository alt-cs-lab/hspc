# README

## HSPC API Side Instructions
This is a guide for how to setup the api side of high school programming competition project for development. This guide should be followed prior to the one for the client side.


## Required Software
* Node v18.9.0.
    * NVM is a greate tool to manage node versions.
    * https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/
* Docker. Either engine or desktop will work.
    * Docker engine (Apache 2.0 license) https://docs.docker.com/engine/install/
    * Docker desktop (Free for personal/education) https://docs.docker.com/get-docker/
    * Docker desktop for wsl https://docs.docker.com/desktop/windows/wsl/

## First time Setup
> Ensure required software is installed.
1. Setup environment.
    * Create a .env file.
    * Copy fields from .env.example
    * Populate fields
1. Compose the database. `docker compose up -d post_db`
1. Populate the database. `./populate.sh`
    * Also useful to call after doing lots of calls from client and want to wipe changes for consistency.
    * Linux files need to be given execute permisions. `chmod u+x populate.sh`
1. Install node packages. `npm install`
1. Launch the api. `npm run debug`

> If you need to access the psql shell, run launch_db.sh.

## Project Layout.
Source files live in src/. <br/>
Controllers (enpoints) use express-validator Validation Chain API.
> https://express-validator.github.io/docs/validation-chain-api <br />
> Use the `badRequestCheck` and `accessLevelCheck` as in the /team endpoint (teams.js controller file).

Services back the controllers and contact the database.

Utilities are miscellaneous helpers.


## Testing
Tests require the postgress container running. Testing is done with jest against controller endpoints. `npm test`
> If developing on VS code, you can install the jest extension to debug tests.

## Docker
>docker build -t me/demo-node .\
>docker run -it me/demo-node sh

## For Querying Database
Run commands: 
>docker exec -it [DB_CONTAINER] sh\
>psql [DB_NAME] -U [DB_USERNAME] -w [DB_PASSWORD]\
>[YOUR QUERY];

The client is included as a submodule for testing and deployment. Pull up the client module to keep versions in sync.

