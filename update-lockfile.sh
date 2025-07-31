#!/bin/bash

echo "Updating lockfile after dependency changes..."

# Remove node_modules and lockfile to ensure clean install
rm -rf node_modules
rm -f bun.lock

# Reinstall dependencies
bun install

echo "Lockfile updated successfully!"
echo "You can now run: eas build -p android --profile preview"
