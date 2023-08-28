#!/bin/bash

echo "Starting build"

npm install --omit=dev

cd client
npm install --omit=dev --legacy-peer-deps
npm run build
cd ../

echo "Build complete"