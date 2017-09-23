#!/bin/bash

isClean=$(git status | grep 'working tree clean')

if [[ -z $isClean ]]; then git stash; fi
git checkout gh-pages
git reset --hard origin/master
cat .gitignore | grep -v 'dist' > tmp.txt
mv tmp.txt .gitignore
npm run prod
git add .
git commit -m 'gh-pages'
git push origin gh-pages -f
git checkout -
if [[ -z $isClean ]]; then git stash pop; fi
