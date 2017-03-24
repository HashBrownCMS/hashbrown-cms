#!/bin/bash

cat certs/server/privkey.pem > privkey.pem

cat certs/server/cert.pem > cert.pem

cat certs/ca/intermediate.crt.pem > chain.pem

cat certs/server/cert.pem certs/ca/intermediate.crt.pem > fullchain.pem

cat certs/ca/root.crt.pem > root.pem
