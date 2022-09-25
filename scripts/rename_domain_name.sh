#!/bin/bash

INITIAL=arkultur.creative-rift.com
TARGET=arktest.creative-rift.com

find . -type f -not -name ".env" \
    | xargs sed -i "s/${INITIAL}/${TARGET}/g"
