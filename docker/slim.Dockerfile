FROM node:10-slim

LABEL "maintainer"="Sergey Orlov <priestine1.dev@gmail.com>"
LABEL "license"="MIT"

# Install tools required for the project
RUN apt-get update && \
    apt-get upgrade -qq && \
    apt-get install git -qq

# Install `@priestine/semantics` package globally
RUN npm i -g @priestine/semantics

WORKDIR /home/node
