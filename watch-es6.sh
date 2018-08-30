#!/bin/bash

NODE_DIR="$(npm root -g)"

babel --presets $NODE_DIR/babel-preset-env/ --plugins $NODE_DIR/@babel/plugin-transform-modules-systemjs --watch ./src/Client/client.js --source-maps ./src/Client/client.js --out-file ./public/js/client.js
