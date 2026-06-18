#!/bin/bash
# Portfolio Website Testing Script

echo "=========================================="
echo "Portfolio Website Testing Script"
echo "=========================================="
echo ""

# Check if files exist
echo "1. Checking file structure..."
if [ -f "index.html" ] && [ -f "content/data.json" ] && [ -f "styles/styles.css" ] && [ -f "content/app.js" ]; then
    echo "   ✅ All core files present"
else
    echo "   ❌ Some files are missing"
    exit 1
fi

# Validate JSON
echo ""
echo "2. Validating JSON..."
if python3 -c "import json; json.load(open('content/data.json'))" 2>/dev/null; then
    echo "   ✅ data.json is valid"
else
    echo "   ❌ data.json has syntax errors"
    exit 1
fi

# Check resume file
echo ""
echo "3. Checking resume file..."
if [ -f "assets/karthik_F25.pdf" ]; then
    echo "   ✅ Resume file found: assets/karthik_F25.pdf"
    echo "   File size: $(du -h assets/karthik_F25.pdf | cut -f1)"
else
    echo "   ❌ Resume file not found"
fi

# File sizes
echo ""
echo "4. File sizes:"
echo "   - index.html: $(du -h index.html | cut -f1)"
echo "   - data.json: $(du -h content/data.json | cut -f1)"
echo "   - styles.css: $(du -h styles/styles.css | cut -f1)"
echo "   - app.js: $(du -h content/app.js | cut -f1)"

# Start server
echo ""
echo "5. Starting local web server..."
echo "   URL: http://localhost:8080"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""
echo "=========================================="
echo "Opening website in browser..."
echo "=========================================="

# Try to open in browser
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:8080" &
elif command -v open &> /dev/null; then
    open "http://localhost:8080" &
fi

# Start Python HTTP server
python3 -m http.server 8080

