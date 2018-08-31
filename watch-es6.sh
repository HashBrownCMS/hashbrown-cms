#!/bin/bash

NODE_DIR="$(npm root -g)"

babel --presets $NODE_DIR/@babel/preset-env/ --plugins $NODE_DIR/@babel/plugin-transform-modules-commonjs --watch ./src/Client/client.js --source-maps --out-file ./public/js/client.js
