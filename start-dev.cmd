@echo off
set "NODE_DIR=C:\Program Files\nodejs"
set "PATH=%PATH%;%NODE_DIR%"
cd /d "%~dp0"
"%NODE_DIR%\npm.cmd" run dev -- --hostname 0.0.0.0 --webpack
