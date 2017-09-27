#!/usr/bin/env bash

yarn install
./node_modules/.bin/electron-rebuild
mkdir ./workspaces/sonm-api/node_modules
cp -r ./node_modules/web3/* ./workspaces/sonm-api/node_modules/*