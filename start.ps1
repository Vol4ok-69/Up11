Write-Host "Stopping Up11..."
docker compose down

Write-Host "Starting Up11 Development Environment..."

Write-Host "Starting Docker services..."
docker compose up -d

Start-Sleep -Seconds 5

Write-Host "Starting frontend..."
cd frontend
npm run dev
