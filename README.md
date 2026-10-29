# Obserwatorium Śląskie 2027 - wydanie publikacyjne v78

To jest odchudzona paczka do publikacji jako statyczna strona (np. GitHub Pages).

- Wgraj **zawartość tego folderu** do katalogu głównego repozytorium, tak aby `index.html` znajdował się w jego głównym katalogu.
- W GitHub Pages wybierz publikację z gałęzi i katalogu głównego (`/`).
- Nie usuwaj folderów `data`, `assets`, `js` ani `icons` oraz plików `manifest.webmanifest` i `sw.js`.
- Opis źródeł danych: `ZRODLA_DANYCH_I_AKTUALIZACJA.md`.

**Uwaga:** Wersja publikacyjna nie zawiera historii zmian, skryptów importu ani testów deweloperskich. Zachowaj poprzednią pełną paczkę v77 jako archiwum robocze.

Wersja v79: wspólny widok wojewódzki we wszystkich zakładkach; bez samoczynnego przełączania na Tychy.


### Eksport do AI (v80)
Przycisk **Dane dla AI** pobiera JSON z profilem wybranego powiatu lub województwa, obserwacjami historycznymi, jednostkami i źródłami. Wgraj ten plik do ChatGPT lub innego modelu analitycznego. Braki danych są jawnie oznaczone jako null. Dane o 13 miastach GZM nie są rozciągane na pozostałe powiaty.

### Eksport do AI z kontekstem (v81)
Eksport „Dane dla AI” zawiera teraz blok `kontekst_regionalny_gus`, tj. ustrukturyzowane wskaźniki z biuletynu US Katowice za lipiec 2026, numery stron i zasady interpretacji. Raport jest historycznym kontekstem wojewódzkim (także przy eksporcie powiatu); link do nowszego wydania we wrześniu 2026 służy kontroli aktualności i nie oznacza zaimportowania jego liczb.

### Gospodarka regionu - v82
Na karcie Dane GUS znajdują się cztery wskaźniki z biuletynu US Katowice za lipiec 2026 (zatrudnienie, płace, produkcja sprzedana przemysłu, inwestycje). Kafelki korzystają z wbudowanego bloku `aiRegionalGusContext` współdzielonego z eksportem do AI. Dane są historyczne, regionalne, nie powiatowe; odsyłacze i metodologia są w Źródłach.
