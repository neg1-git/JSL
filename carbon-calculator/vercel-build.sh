#!/bin/bash
set -e
# Install dependencies, allowing postinstall scripts
npm install --ignore-scripts=false
# Approve any pending scripts (esbuild)
npm approve-scripts --allow-scripts-pending || true
# Ensure vite binary is executable
chmod +x ./node_modules/vite/bin/vite.js || true
chmod +x ./node_modules/.bin/vite || true
# Build the project
npx vite build
