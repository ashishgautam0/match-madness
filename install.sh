#!/bin/bash

echo "================================================"
echo "Match Madness - Dependency Installation"
echo "================================================"
echo ""

# Check if dependencies are installed
if [ -d "node_modules" ]; then
    echo "Dependencies already installed!"
    echo ""
else
    echo "Installing dependencies..."
    npm install
    echo ""
    echo "Installation complete!"
    echo ""
fi

# Menu
while true; do
    echo "================================================"
    echo "What would you like to do?"
    echo "================================================"
    echo "1. Start development server"
    echo "2. Build for production"
    echo "3. Exit"
    echo ""
    read -p "Enter your choice (1-3): " choice

    case $choice in
        1)
            echo ""
            echo "Starting development server..."
            echo "Open http://localhost:3000 in your browser"
            echo "Press Ctrl+C to stop the server"
            echo ""
            npm run dev
            ;;
        2)
            echo ""
            echo "Building for production..."
            npm run build
            echo ""
            echo "Build complete! Output is in the 'out' directory"
            echo ""
            ;;
        3)
            echo ""
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo "Invalid choice. Please enter 1, 2, or 3."
            ;;
    esac
done
