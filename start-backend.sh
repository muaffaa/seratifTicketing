#!/bin/bash
export DB_HOST=localhost
export DB_NAME=seratif2026
export DB_USER=root
export DB_PASS=admin123
export APP_URL=http://localhost:5173

exec php -S localhost:8000 -t ~/Documents/myRepo/seratif2026/backend ~/Documents/myRepo/seratif2026/backend/index.php