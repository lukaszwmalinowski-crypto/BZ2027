# v125 – stabilniejszy generator prezentacji WUP (31.10.2026)

- Naprawiono przechwytywanie danych liczbowych dla wykresów GUS: REGON (2016–2025 i widok bieżący), BAEL (Śląskie/Polska) i bezrobocia. Wartości są zapisywane z etykiet SVG i rysowane jako edytowalne wykresy PowerPoint zamiast potencjalnie pustych obrazów.
- Poprawiono obsługę historii PUP, w tym odczyt wartości z wykresu przy niedostępnej tabeli historii.
- Naprawiono układ slajdów: długie tytuły i warianty przenoszone do podtytułu, bez kolizji z treścią; numeryczne etykiety wartości na wykresach słupkowych mają własną kolumnę, bez zawijania cyfr.
- Wybór pojedynczej karty statystycznej, pojedynczego sygnału, pojedynczej pozycji rankingu oraz jednodanego szeregu nie jest już pomijany tylko dlatego, że zawiera mniej niż 2–3 elementy.
- Zachowano mapy, porównywarkę powiatów, pełne listy zawodów, firmówkę WUP, brak duplikatów i zapisane wybory.
- Zmieniono identyfikator cache PWA na v125 i usunięto nieistniejące zasoby z listy pre-cache.

## Testy (lokalny Chromium / PowerPoint)
- W prawdziwym interfejsie zaznaczono 11 wykresów (5 przekrojów bezrobocia, historia PUP, trend Barometru, REGON, BAEL, GUS–bezrobocie, ludność) i uzyskano 12-slajdowy PPTX z tytułowym.
- Osobny test mapy Barometru, mapy wybranego zawodu i porównywarki dwóch miast dał poprawny 4-slajdowy PPTX.
- Wygenerowane pliki otwarto i wyrenderowano w LibreOffice; skontrolowano slajdy wizualnie.
- Nie przetestowano każdej możliwej kombinacji w przeglądarce Safari / Keynote; nie twierdzimy, że wszystkie przypadki są rozwiązane.
