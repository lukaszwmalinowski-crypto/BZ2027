#!/bin/bash
# Lokalne uruchomienie panelu przez HTTP (macOS). Nie wymaga internetu.
cd "$(dirname "$0")" || exit 1
if ! command -v python3 >/dev/null 2>&1; then
 echo "Brak python3. Zainstaluj Python 3 lub opublikuj panel na GitHub Pages."
 read -r -p "Enter, aby zamknąć..." _
 exit 1
fi
URL="http://127.0.0.1:8765/"
(sleep 1; open "$URL") &
echo "Panel: $URL (zakończ Ctrl+C)"
python3 -m http.server 8765 --bind 127.0.0.1
