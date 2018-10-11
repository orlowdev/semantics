FROM node:10-slim

RUN apt-get update -y && apt-get install git -qy

WORKDIR /home/node/app
RUN mkdir -p /home/node/app
ADD ./.git /home/node/app

RUN git status