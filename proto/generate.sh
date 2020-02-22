#!/bin/bash

PBJS="yarn run pbjs"

ROOT_DIR=`git rev-parse --show-toplevel`
OUTPUT="$ROOT_DIR/shared/proto.js"
ALL_FILES=""

rm -f $OUTPUT

shopt -s nullglob

for filename in `find . -name "*.proto" -type f`; do
  if [[ $filename == *"node_modules"* ]]; then
    continue
  fi
  echo $filename
  ALL_FILES+="$filename "
done

${PBJS} -t static-module -w commonjs -o $OUTPUT $ALL_FILES
