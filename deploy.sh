#!/bin/bash
set -e

echo "Pulling latest code..."
git pull

echo "Cleaning old build..."
rm -rf .next

echo "Building..."
npm run build

echo "Copying static files..."
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

echo "Restarting PM2..."
pm2 restart medarynbook

echo "Deploy complete!"
