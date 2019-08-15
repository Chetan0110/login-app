# Ubuntu:16.04 with node and expres
FROM ubuntu:16.04
MAINTAINER Chetan Vekariya "chetanvekaria025@gmail.com"

RUN apt-get update && \
        apt-get -qq update && \
        apt-get install -y curl && \
        apt-get install -y npm

RUN curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh

RUN apt-get install -y nodejs
RUN apt-get install -y vim

RUN mkdir -p /usr/login-app
WORKDIR /usr/login-app
RUN mkdir -p client/build
RUN mkdir -p src

COPY client/build client/build/
COPY src src/
COPY package.json package.json

RUN npm install

EXPOSE 4000

CMD NODE_ENV=prod node src/server.js