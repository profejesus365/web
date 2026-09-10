@echo off
chcp 65001 >nul
title Actualizar enlaces del sitio
cd /d "%~dp0"

echo.
echo   Leyendo enlaces.txt y actualizando la pagina...

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0herramientas\actualizar-enlaces.ps1"

pause
