if [[ -f '.tmp.version_data' ]]; then
    sed -i s/"\"version\":.*/\"version\": \"$(cat .tmp.version_data)\","/ package.json
    yarn build:ci
    ls -al
    echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > .npmrc
    npm publish
fi
