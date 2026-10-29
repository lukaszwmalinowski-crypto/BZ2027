# Wersja v32 - wczytywanie danych

Podmień plik index.html w głównym katalogu repozytorium. Zawiera kod czterech modułów, style PUP i bazę startową. Nie wymaga osobnych plików JS do uruchomienia.

Gdy data/dane.json jest dostępny i ma pełną strukturę PUP, narzędzie korzysta z tej bazy. Jeśli jest starszy, brakuje go albo serwer nie odpowie w ciągu 10 sekund, uruchamia się na danych wbudowanych w HTML. Komunikat na górze informuje o wybranym źródle danych.

Pełna paczka zachowuje katalogi i pozostałe funkcje. Zewnętrzny plik assets/pptxgen.bundle.js jest nadal potrzebny do eksportu PowerPoint. Do bieżących aktualizacji podmieniaj data/dane.json; plik index.html zawiera kopię startową z 29.10.2026.
