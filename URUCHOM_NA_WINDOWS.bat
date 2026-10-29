@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
 start "" "http://127.0.0.1:8765/"
 py -3 -m http.server 8765 --bind 127.0.0.1
) else (
 where python >nul 2>nul
 if %errorlevel%==0 (
  start "" "http://127.0.0.1:8765/"
  python -m http.server 8765 --bind 127.0.0.1
 ) else (
  echo Brak Pythona. Wgraj panel na GitHub Pages lub uzyj przycisku Wskaz plik dane.json.
  pause
 )
)
