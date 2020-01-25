#!/bin/bash

PBJS="yarn run pbjs"

ROOT_DIR=`git rev-parse --show-toplevel`
FILES=`git status --porcelain | grep -E '\.proto'`
FORCE=false

# get flags
while test $# -gt 0; do
  case "$1" in
    -f|--force)
      FORCE=true
      break
      ;;
    *)
      break
      ;;
  esac
done

if [ ! -d "$ROOT_DIR/shared/proto" ] || [ "$FORCE" = true ]; then
  rm -rf $ROOT_DIR/shared/proto

  shopt -s nullglob
  for filename in `find . -name "*.proto" -type f`; do
    if [[ $filename == *"node_modules"* ]]; then
      continue
    fi
    echo $filename

    DIRNAME=`dirname $filename`
    FILENAME=`basename $filename .proto`

    OUTPUT_DIR="../shared/proto/$DIRNAME"

    # if output directory doesn't exist
    if [ ! -d "$OUTPUT_DIR" ]; then
      mkdir -p $OUTPUT_DIR
    fi

    ${PBJS} -t static-module -p $ROOT_DIR/proto -w commonjs -o $OUTPUT_DIR/$FILENAME.js $filename
  done

  exit 0
fi

while read status filename; do
  if [[ $filename == *"node_modules"* ]]; then
    continue
  fi
  echo $filename

  # file is deleted
  if [ $status = "D" ]; then
    rm $ROOT_DIR/$filename
    continue;
  fi

  # file is renamed
  if [ $status = "R" ]; then
    OLD_FILE_RAW=$(cut -d'>' -f1 <<< "$filename")
    OLD_FILE=${OLD_FILE_RAW%??}
    NEW_FILE_RAW=$(cut -d'>' -f2 <<< "$filename")
    NEW_FILE=${NEW_FILE_RAW#?}

    OLD_FILE_DIRNAME=`dirname $OLD_FILE`
    OLD_FILENAME=`basename $OLD_FILE .proto`
    OLD_FILE_JS="shared/$OLD_FILE_DIRNAME/$OLD_FILENAME.js"

    rm $ROOT_DIR/$OLD_FILE_JS
    filename=$NEW_FILE
  fi

  DIRNAME=`dirname $filename`
  FILENAME=`basename $filename .proto`

  OUTPUT_DIR="$ROOT_DIR/shared/$DIRNAME"

  # if output directory doesn't exist
  if [ ! -d "$OUTPUT_DIR" ]; then
    mkdir -p $OUTPUT_DIR
  fi

  ${PBJS} -t static-module -p $ROOT_DIR/proto -w commonjs -o $OUTPUT_DIR/$FILENAME.js $ROOT_DIR/$filename
done < <(git status --porcelain | grep -E '\.proto')

find $ROOT_DIR/shared/proto -type d -empty -delete

