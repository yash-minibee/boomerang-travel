@echo off
echo Starting all dev servers...
echo.

start "PHP Backend :8080" cmd /k "php -S localhost:8080"
start "Frontend :5173"    cmd /k "cd frontend && npm run dev"
start "Admin :5174"       cmd /k "cd admin && npm run dev"

echo.
echo PHP Backend  → http://localhost:8080/backend/api/packages.php
echo Frontend     → http://localhost:5173
echo Admin        → http://localhost:5174
echo.
echo Close the opened terminals to stop the servers.
