#!/bin/bash

PBJS="yarn run pbjs"
PBTS="yarn run pbts"

ROOT_DIR=`git rev-parse --show-toplevel`
OUTPUT_DIR="$ROOT_DIR/shared/proto"
OUTPUT="$OUTPUT_DIR/index.js"
OUTPUT_TS="$OUTPUT_DIR/index.d.ts"
ALL_FILES=""

rm -rf $OUTPUT_DIR
mkdir -p $OUTPUT_DIR

shopt -s nullglob

for filename in `find . -name "*.proto" -type f`; do
  if [[ $filename == *"node_modules"* ]]; then
    continue
  fi
  echo $filename
  ALL_FILES+="$filename "
done

${PBJS} -t static-module -w commonjs -o $OUTPUT $ALL_FILES
${PBTS} -o $OUTPUT_TS $OUTPUT
