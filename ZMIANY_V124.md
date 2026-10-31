# v124 - naprawa uruchamiania aplikacji po dodaniu przekroju Płeć

- Naprawiono błąd startowy `Cannot read properties of undefined (reading '0')` w module PUP: etykiety kategorii Płeć pochodzą z `labelsFor`, a nie z nieistniejącej `db.etykiety.plec`.
- Uodporniono tabelę przekrojów na brak danych oraz uzupełniono opis o płeć.
- Naprawiono także CSV PUP: płeć generuje osobne wiersze Kobiety i Mężczyźni, nie odwołuje się do nieistniejącej tablicy.
- Zaktualizowano zarazem `js/pup.js` i *wbudowaną kopię modułu* w `index.html` (tryb lokalny/offline).
- Zmieniono wersję cache service worker na v124. Dane oryginalne pozostawiono bez zmian.
- Czytelna nazwa województwa w komunikatach PUP zamiast wewnętrznego identyfikatora `__WOJ__`.
