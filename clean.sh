#!/usr/bin/env bash
rm -rf ./node_modules/*
rm -rf ./workspaces/front/node_modules/*
rm -rf ./workspaces/back/node_modules/*
rm -rf ./workspaces/sonm-api/node_modules/*
rm ./workspaces/front/package-lock.json
rm ./workspaces/back/package-lock.json
rm ./workspaces/sonm-api/package-lock.json