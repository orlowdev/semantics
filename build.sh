if [[ -f '.tmp.version_data' ]]; then
    sed -i s/"\"version\":.*/\"version\": \"$(cat .tmp.version_data)\","/ package.json;
    echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > .npmrc
    npm publish

    docker build . -t priestine/semantics:$(cat .tmp.version_data)
    docker login -u $DOCKER_USER -p $DOCKER_PASSWORD
    docker push priestine/semantics
fi
