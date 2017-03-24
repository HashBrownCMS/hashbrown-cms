#!/bin/bash

mkdir -p certs/tmp
openssl req -new \
  -sha256 \
  -key certs/server/privkey.pem \
  -out certs/tmp/csr.pem \
  -subj "/C=US/ST=Utah/L=Provo/O=Daplie Inc/CN=localhost.daplie.com"
