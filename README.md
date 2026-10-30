# Obserwatorium Śląskie 2027 - wydanie publikacyjne v84

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


### Nowy wygląd - v83
Nowoczesna warstwa wizualna (jasne karty, miękkie cienie, płaskie przyciski i przełączniki, nowa nawigacja, spójna typografia). Zmiana dotyczy wyłącznie stylów: dane, logika, eksporty (PDF/PPTX/XLSX/AI) i druk pozostają bez zmian. Styl znajduje się w ostatnim bloku `<style id="v83-modern-ui">` w `index.html`.

### Responsywność - v84
Dopracowanie układu na iPadzie 11" (pion i poziom), iPadzie 12,9", telefonach i w Split View: zawijanie akcji w nagłówku, 7 równych kafelków nawigacji, siatki KPI/GUS dopasowane do szerokości, większe cele dotykowe (44 px), brak „przyklejonych” efektów hover na dotyku, poprawka tła na iOS Safari oraz zapas dla starszych przeglądarek (bez `color-mix`). Styl: blok `<style id="v84-responsive-polish">`.

Wersja v88: naprawione wyświetlanie szczegółowej struktury bezrobocia wojewódzkiego (w poprzedniej wersji ukrywała ją reguła CSS). Zsynchronizowano kod modułu PUP w pakiecie awaryjnym osadzonym w HTML.

## v94 – Demografia: 36 jednostek
Pełna lista wszystkich 36 powiatów i miast na prawach powiatu w module demografii; 13 szeregów InfoGZM pozostaje, 23 jednostki oczekują na zweryfikowane wartości GUS.
