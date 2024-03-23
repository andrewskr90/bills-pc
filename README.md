# bills-pc aka kyles-pc

A pokemon card/product portfolio application. Import your collection into the application to track the value of your assets.

## App Setup for development ##

-Run `yarn` at the root of the repo, followed by `yarn run bootstrap` to install dependencies in both packages/client and packages/service

-Create .env file and ask Kyle for required variables

-Run `yarn run startDev` within packages/client to startup webpack server

-Run `yarn run server` within packages/service to start up the backend server

## Docker

### Dev
-To build the image, in the root directory, run: `docker build -f Docker/bills-pc/Dockerfile .`

-Run `docker run -p 7070:7070 --env-file .env --env DB_HOST=host.docker.internal <image>` to serve full stack 
build from port 7070

### Deploy to Prod

#### Local machine
- merge into master, create a new release/tag
- build and push new image to aws ECR:
    - aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 529244651941.dkr.ecr.us-west-2.amazonaws.com
    - docker build -f Docker/bills-pc-app.Dockerfile -t bills-pc-app .
    - docker tag bills-pc-app:latest 529244651941.dkr.ecr.us-west-2.amazonaws.com/bills-pc-app:latest
    - docker push 529244651941.dkr.ecr.us-west-2.amazonaws.com/bills-pc-app:latest

#### EC2 instance
- ssh into instance
    - `ssh -i "~/.ssh/Thinkpad.pem" ec2-user@ec2-54-185-51-99.us-west-2.compute.amazonaws.com`
- log into ECR, pull new image, replace old container with new
    - `aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 529244651941.dkr.ecr.us-west-2.amazonaws.com`
    - `docker pull 529244651941.dkr.ecr.us-west-2.amazonaws.com/bills-pc-app`
    - `docker stop bills-pc-app` stops old container
    - `docker remove bills-pc-app` frees up the name for new container
    - `docker run -d -p 7070:7070 --env-file .env --name bills-pc-app --network bills-pc <containerId>` this places container on same network as NGINX container, bills-pc. NGINX config references bills-pc-app, which acts like an ip address. This makes naming the container bills-pc-app crucial

#### Hints
- NGINX run command: `docker run -p 80:80 -p 443:443 -v /home/ec2-user/etc/pki/tls/certs:/etc/nginx/certs --network=bills-pc --name bills-pc-nginx <containerId>`
- market price scraper run command: `docker run -d --restart unless-stopped --env-file .env --name bills-pc-market-price-scraper 043e7b835e06`
- `docker inspect bills-pc` this shows info on the network, ensuring each container shares the same network, and other important info
- NGINX container can still be running while the app container is removed and restarted
- market price scraper does not require to be on the same network, it communicates with the app over https://billspc.io
