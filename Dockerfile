# Ubuntu:16.04 with node and express

FROM ubuntu:16.04
MAINTAINER Chetan Vekariya "chetanvekaria025@gmail.com"

#ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
        apt-get -qq update && \
        apt-get install -y curl && \
        apt-get install -y npm

RUN curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh

RUN apt-get install -y nodejs
RUN apt-get install -y vim


# TODO: Remove these adhoc installments of npm packages once you strip out the server code from client and have a separate package.json for server.
RUN npm install express@4.14.0 && \
    npm install body-parser@1.14.2 && \
    npm install mongoose && \
    npm install crypto && \
    npm install path

ADD ./client/build /login-app/client/build/
ADD ./server/src /login-app/server/src/

WORKDIR /login-app


ARG CACHEBUST=1
CMD node server/src/server.js