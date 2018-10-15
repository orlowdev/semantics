FROM node:10-alpine

# Install tools required for the project
RUN apk update && \
    apk upgrade && \
    apk add git && \
    apk add bash

# Install `@priestine/semantics` package globally
RUN npm i -g @priestine/semantics

WORKDIR /home/node
