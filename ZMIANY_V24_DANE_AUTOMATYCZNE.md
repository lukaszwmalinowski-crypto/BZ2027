# Zmiany v24

- Usunięto z panelu interfejs wyboru pliku `dane.json`.
- Przy publikacji na GitHub Pages ładowane są automatycznie świeże dane z `data/dane.json`.
- Lokalny podgląd działa bez serwera dzięki wbudowanej migawce startowej; **migawka nie jest źródłem aktualizacji**.
- W przypadku awarii sieci pokazywany jest wyraźny komunikat o użyciu możliwie nieaktualnej migawki.
- Ukryto import/eksport danych w module powiatowym, który należy obsługiwać przez osobny edytor.
- Wyłączono odczyt wcześniejszych lokalnych importów z localStorage.
- Nie zmieniono wykresów, kolorystyki ani funkcji raportowania.
