if [[ -f '.tmp.version_data' ]]; then
    sed -i s/\"version\":.*/\"version\": \"$(cat .tmp.version_data)\"/ package.json
fi
