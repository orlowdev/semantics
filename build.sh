if [[ -f '.tmp.version_data' ]]; then
    # STEP 1: NPM
    # Add version to package.json
    sed -i s/"\"version\":.*/\"version\": \"$(cat .tmp.version_data)\","/ package.json
    # Install @priestine/semantics dependencies
    yarn build:ci
    # Put NPM access token to .npmrc for publishing
    echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > .npmrc
    # Publish new version of the app to NPM
    npm publish

    # STEP 2: DOCKER
    # Install Docker for publishing new image
    apk add docker
    # Start docker daemon
    service docker start
    # Build new tagged with new version of the app
    docker build . -t priestine/semantics:$(cat .tmp.version_data) --no-cache
    # Build new latest image
    docker build . -t priestine/semantics:latest --no-cache
    # Log in to Docker Cloud
    docker login -u $DOCKER_USER -p $DOCKER_PASSWORD
    # Publish images to Docker Cloud
    docker push priestine/semantics
fi
