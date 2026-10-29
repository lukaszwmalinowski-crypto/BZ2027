@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==================================================
echo   GUS/BDL: historia bezrobocia 36 powiatow
 echo   Aktualizacja: 2016-2026 - miesiecznie
 echo ==================================================
where py >nul 2>nul
if %errorlevel% equ 0 (py -3 aktualizuj_bdl.py) else (python aktualizuj_bdl.py)
if errorlevel 1 (
 echo.
 echo Nie udalo sie pobrac danych. Sprawdz internet, dostep do API BDL i Python 3.
 echo Nie nadpisano poprzednich danych.
)
echo.
pause
