# bills-pc aka kyles-pc

A pokemon card/product portfolio application. Import your collection into the application to track the value of your assets.

## App Setup for development ##

-Run `yarn` at the root of the repo, followed by `yarn run bootstrap` to install dependencies in both packages/client and packages/service

-Create .env file and ask Kyle for required variables

-Run `yarn run startDev` within packages/client to startup webpack server

-Run `yarn run server` within packages/service to start up the backend server

## Docker

-To build the image, in the root directory, run: `docker build -f Docker/bills-pc/Dockerfile .`

-Run `docker run -p 7070:7070 --env-file .env --env DB_HOST=host.docker.internal <image>` to serve full stack build from port 7070
