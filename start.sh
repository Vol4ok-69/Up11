#!/bin/bash
echo "Stopping Up11..."
docker compose down

echo "Starting Up11 Development Environment..."

echo "Starting Docker services..."
docker compose up -d

echo "Waiting 5 seconds for backend..."
sleep 5

echo "Starting frontend..."
cd frontend
npm run dev
