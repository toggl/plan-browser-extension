#!/bin/sh

export RELEASE=`node ./bin/tag.js`
git add . && git commit -m "Release v$RELEASE" && git tag v$RELEASE && git push && git push --tags
