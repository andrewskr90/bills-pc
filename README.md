# bills-pc aka kyles-pc

A pokemon card/product portfolio application. Import your collection into the application to track the value of your assets.

## App Setup for development ##

-Run `yarn` at the root of the repo, followed by `yarn run bootstrap` to install dependencies in both packages/client and packages/service

-Create .env file and ask Kyle for required variables

-Run `yarn run startDev` within packages/client to startup webpack server

-Run `yarn run server` within packages/service to start up the backend server

## Docker

# Dev
-To build the image, in the root directory, run: `docker build -f Docker/bills-pc/Dockerfile .`

-Run `docker run -p 7070:7070 --env-file .env --env DB_HOST=host.docker.internal <image>` to serve full stack 
build from port 7070

# Prod
ssh
ssh -i "~/.ssh/Thinkpad.pem" ec2-user@ec2-34-215-117-101.us-west-2.compute.amazonaws.com

login
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 529244651941.dkr.ecr.us-west-2.amazonaws.com

App
docker run -d -p 80:7070 --env-file .env <containerId>

Market Scraper
docker run -d --restart unless-stopped --env-file .env <containerId>