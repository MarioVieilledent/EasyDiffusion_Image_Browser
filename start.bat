@echo off
start cmd /k "npm install && node server.js"

cd front
start cmd /k "npm install && npm run dev"