# v122 – poprawki generatora prezentacji (31.10.2026)

## Wykryte w pliku Keynote użytkownika

19 slajdów; puste slajdy: porównanie powiatów, trend 2024–2027, historia PUP i demografia powiatowa. Wykształcenie i staż pracy były pokazane jako surowy tekst; na slajdzie gospodarczym występował nieczytelny układ.

## Poprawki

1. W momencie zaznaczenia wykresu przechwytujemy realne wartości, etykiety i serie danych dla trendu Barometru, historii PUP, wykresu ludności i porównania powiatów.
2. Karty struktury PUP (wiek, wykształcenie, płeć, staż i czas bez pracy) zapisują pełne kategorie i wartości, również po przełączeniu powiatu i okresu.
3. Wykresy liniowe odtwarzamy z danych jako edytowalne linie, punkty, osie i podpisy w PPTX, zamiast polegać na często pustych obrazach SVG. Rankingi przedstawiamy jako edytowalne słupki.
4. Kontrola białych grafik przy konwersji SVG do PNG; nie tworzymy pustego slajdu bez danych.
5. Generator podaje komunikat, które elementy nie miały danych, i oznacza liczbę poprawnie wygenerowanych analiz.
6. Wybór porównania powiatów wymaga co najmniej dwóch wartości. Zachowano firmówkę WUP i pozostałe funkcje.

## Testy

- Syntetyczny test przechwytywania: 5 typów danych (trend, słupki PUP, historia PUP, demografia i porównanie).
- Test rzeczywistego generowania pliku PPTX w Chromium w środowisku izolowanym.
- Otwarcie pliku w python-pptx i wizualny podgląd w LibreOffice.
- Nie ukończono kompleksowego testu całego interfejsu na urządzeniach mobilnych.
