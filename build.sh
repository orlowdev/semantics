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
fi
