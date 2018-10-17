FROM node:10-alpine

LABEL "maintainer"="Sergey Orlov <priestine1.dev@gmail.com>"
LABEL "license"="MIT"

# Install tools required for the project
RUN apk update && \
    apk upgrade && \
    apk add git && \
    apk add bash

# Install `@priestine/semantics` package globally
RUN npm i -g @priestine/semantics

WORKDIR /home/node
