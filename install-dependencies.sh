#!/usr/bin/env bash

yarn install
cd ./workspaces/sonm-api
../../node_modules/.bin/electron-rebuild
cd node_modules/web3/packages/web3-eth-accounts
../../../../../../node_modules/.bin/electron-rebuild
cd ../../../../../../