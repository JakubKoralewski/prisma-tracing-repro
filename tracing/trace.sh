#!/bin/bash
set -e
pwd_before=$(pwd)
cd $(dirname "$0")
cd ..

pnpm next build
echo "Built web app"
output=$(mktemp "${TMPDIR:-/tmp/}$(basename $0).XXX")
node --require ./tracing/opentelemetry.js ./node_modules/next/dist/bin/next start -p 3000 &> $output &
profile_id=$!
echo profile_id=$profile_id
trap "kill $profile_id 2>&1 /dev/null" EXIT
# trap "cat $output" EXIT
echo "Profiling pid: $profile_id"
echo "Output: $output"
echo "Wait:"
until grep -q -i 'started server' $output
do
  if ! ps $profile_id > /dev/null
  then
    echo "The server died" >&2
    cat $output
    exit 1
  fi
  echo -n "."
  sleep 1
done
echo "Server started $(head -1 $output)"
echo "Stressing"
pnpm stress:api
# pnpm stress:e2e 50

echo "Stopping server"
kill $profile_id
wait $profile_id || true

cd $pwd_before
