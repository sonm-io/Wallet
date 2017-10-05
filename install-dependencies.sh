#!/usr/bin/env bash

yarn install
cd node_modules/grpc
LDFLAGS=-L/usr/local/opt/openssl/lib CPPFLAGS=-I/usr/local/opt/openssl/include ../../node_modules/.bin/electron-rebuild

#cd ./workspaces/sonm-api
#../../node_modules/.bin/electron-rebuild
#cd node_modules/web3/packages/web3-eth-accounts
#../../../../../../node_modules/.bin/electron-rebuild
#cd ../../../../../../