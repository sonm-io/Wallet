#!/usr/bin/env bash

need_rebuild=false

while test $# -gt 0
do
    case "$1" in
        -r) need_rebuild=true
            ;;
        @*) tags="$tags $1"
            ;;
    esac
    shift
done

if [ -z "$tags" ]; then
   tags=''
else
   tags=" --tags $tags"
fi

if  ${need_rebuild} ; then
    echo "Rebuilding"
    rm -rf node_modules
    rm -rf package-lock.json
    npm i
    npm run webpack:one
fi

testrpc \
  -l 10000000 \
  --account="0xcfd4b9b614e30f929296034d5dd7b701783aae0d273fcb9f23130c3d6ead9620,765000000000000000000000000000" \
  --account="0x1da1383caf0b6e14487550d41334a591430c8220ace1133600099b81b71503c7,765000000000000000000000000000" \
  --account="0x2da1383caf0b6e14487550d41334a591430c8220ace1133600099b81b71503c7,765000000000000000000000000000" \
  --account="0x3da1383caf0b6e14487550d41334a591430c8220ace1133600099b81b71503c7,765000000000000000000000000000" \
  --account="0x4da1383caf0b6e14487550d41334a591430c8220ace1133600099b81b71503c7,765000000000000000000000000000" \
  --account="0x5da1383caf0b6e14487550d41334a591430c8220ace1133600099b81b71503c7,765000000000000000000000000000" \
  --account="0x6da1383caf0b6e14487550d41334a591430c8220ace1133600099b81b71503c7,765000000000000000000000000000" \
  --account="0x7da1383caf0b6e14487550d41334a591430c8220ace1133600099b81b71503c7,765000000000000000000000000000" \
  --account="0x8da1383caf0b6e14487550d41334a591430c8220ace1133600099b81b71503c7,765000000000000000000000000000" \
  --account="0x9da1383caf0b6e14487550d41334a591430c8220ace1133600099b81b71503c7,765000000000000000000000000000" \
  > testrpc.log 2>&1 &

TESTRPC_PID=$!

(cd test && truffle migrate)
source env.sh

node ./node_modules/selenium-cucumber-js/index.js${tags} CI_SONM_TOKEN_ADDRESS=0xb29d1e8259571de17429b771ca455210f25b9fce
echo "killing testrpc at PID=$TESTRPC_PID"
kill $TESTRPC_PID