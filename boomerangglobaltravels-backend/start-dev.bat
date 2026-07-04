@echo off
echo Starting PHP dev server on http://localhost:8080
echo API endpoints: http://localhost:8080/api/packages.php etc.
echo.
php -S localhost:8080 -t "%~dp0"
