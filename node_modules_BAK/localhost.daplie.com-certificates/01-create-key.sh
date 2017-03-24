#!/bin/bash

mkdir -p certs/server
openssl genrsa \
  -out certs/server/privkey.pem \
  2048
