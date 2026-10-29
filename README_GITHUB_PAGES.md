# Obserwatorium Śląskie 2027 - Studio v21

Panel analityczny przeznaczony do publikacji na GitHub Pages. Wersja bez logo WUP i bez wbudowanego edytora danych.

1. Prześlij zawartość paczki do głównego folderu repozytorium.
2. W Settings → Pages włącz publikację z gałęzi main i katalogu /(root).
3. Otwórz adres GitHub Pages. Panel automatycznie pobiera `data/dane.json`.

## Aktualizacja

Zmiany danych liczbowych: podmień tylko plik `data/dane.json`. Sprawdź poprawność i okresy danych oraz opisy metodologiczne zapisane w HTML. Edytor danych jest osobnym narzędziem i nie znajduje się w tej paczce.

## Interfejs v21

Ekran główny zawiera wybór powiatu, przełącznik mapy i analizę zawodu. Eksport PDF/PPTX/XLSX znajduje się w menu „Eksportuj” w nagłówku. Wszystkie wcześniejsze sekcje analityczne zostały zachowane.

Od v24 nie ma wyboru pliku w aplikacji. Dane na GitHub Pages ładują się automatycznie; szczegóły w `WAZNE_JAK_URUCHOMIC.md`.
