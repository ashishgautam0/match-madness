@echo off
echo ================================================
echo Match Madness - Dependency Installation
echo ================================================
echo.

echo Checking if dependencies are already installed...
if exist "node_modules" (
    echo Dependencies already installed!
    echo.
    goto :menu
) else (
    echo Installing dependencies...
    call npm install
    echo.
    echo Installation complete!
    echo.
)

:menu
echo ================================================
echo What would you like to do?
echo ================================================
echo 1. Start development server
echo 2. Build for production
echo 3. Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto :dev
if "%choice%"=="2" goto :build
if "%choice%"=="3" goto :end

:dev
echo.
echo Starting development server...
echo Open http://localhost:3000 in your browser
echo Press Ctrl+C to stop the server
echo.
call npm run dev
goto :end

:build
echo.
echo Building for production...
call npm run build
echo.
echo Build complete! Output is in the 'out' directory
echo.
pause
goto :menu

:end
echo.
echo Goodbye!
pause
