#!/bin/bash
set -e

echo "=== Medaryn Book Deploy ==="

echo "1. Pulling latest code..."
git pull

echo "2. Cleaning old build..."
rm -rf .next

echo "3. Building..."
if ! npm run build; then
  echo "❌ Build failed — aborting deploy"
  exit 1
fi

echo "4. Verifying build output..."
if [ ! -f ".next/standalone/server.js" ]; then
  echo "❌ server.js not found — build incomplete"
  exit 1
fi

echo "5. Copying static files..."
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

echo "6. Restarting PM2..."
pm2 restart medarynbook

echo "7. Verifying server is up..."
sleep 3
if curl -s http://localhost:3003 > /dev/null; then
  echo "✅ Deploy complete! Server is running."
else
  echo "⚠️ Server may not be responding — check: pm2 logs medarynbook"
fi
