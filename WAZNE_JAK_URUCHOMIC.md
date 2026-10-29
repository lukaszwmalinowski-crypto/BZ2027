# Studio v24 - automatyczne dane, bez wyboru pliku

## GitHub Pages
1. Wyślij całą zawartość archiwum na GitHub (nie sam `index.html`).
2. W repozytorium muszą być `index.html`, `js/` oraz `data/dane.json`.
3. Po otwarciu strony automatycznie jest pobierany `data/dane.json` bez używania pamięci cache.
4. **Kolejna aktualizacja: edytuj tylko `data/dane.json` na GitHubie i zatwierdź Commit changes.** Po wdrożeniu GitHub Pages odśwież stronę.

## Podgląd z komputera
Możesz bezpośrednio otworzyć `index.html`; wykresy korzystają wtedy z wbudowanej, tylko do odczytu **migawki startowej**. Nie trzeba wskazywać pliku. Uwaga: lokalna migawka nie odświeża się po zmianie `data/dane.json` na GitHubie. Aktualne dane zobaczysz pod adresem GitHub Pages.

## Gdy GitHub nie udostępni JSON
Zamiast pustego panelu zostanie pokazana migawka startowa z widocznym ostrzeżeniem, że może być nieaktualna. Należy sprawdzić adres `.../data/dane.json` na opublikowanej stronie. Panel nigdy nie prosi o przesłanie pliku danych.

## Edytor
Edytor danych pozostaje osobnym narzędziem. Z panelu usunięto możliwość lokalnego importu danych powiatowych i pominięto zapisy localStorage, aby stare wartości nie przesłaniały aktualizacji z GitHuba.
