> **Aktualizacja v123 (31.10.2026):** wybory do prezentacji przeniesione do jednolitych stopek kart i map. Szczegóły: `ZMIANY_V123.md`.

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


## v97 – iPhone
Usunięto odstęp między nagłówkiem a wyborem widoku: końcowe reguły CSS + wymuszenie kolejności i układu przez JS na ekranach do 767px.

## v104 — GUS bez ręcznego importu
W GUS usunięto pola do wczytywania CSV i przyciski szablonów. Demografia: 16/36 jednostek z osadzonymi szeregami ludności (13 InfoGZM + Częstochowa, Bielsko-Biała i powiat częstochowski). Niekompletna karta „Wynagrodzenia powiatowe” została usunięta; porównania Śląskie–Polska pozostają w GUS. Pozostałe powiaty są nadal na liście, ale brakujących liczb nie zastępujemy szacunkami. Pełne informacje o pokryciu: `GUS_WBUDOWANE_V104.md`.

## Zmiany v105 (30.10.2026)
- Jednolita, pastelowa kolorystyka sekcji związana z głównymi przyciskami. Nie zmienia znaczenia kolorów danych na mapach i wykresach.
- Usunięto kartę „Wynagrodzenia powiatowe” (dostępne tylko jedno miasto i jeden rok). Pozostają wynagrodzenia regionalne Śląskie–Polska.
- Zaktualizowano identyfikator pamięci offline.

## Poprawka v106 (30.10.2026)
- Skorygowano motywy kolorystyczne: akcent wyłącznie na obramowaniu kart i małych etykietach; usunięto tła i wewnętrzne cienie z nagłówków.
- Naprawiono problem nachodzenia paska koloru na tytuły „Struktura bezrobocia” i „Archiwum”, bez modyfikowania danych i legend.
- Dodano podstawowe zabezpieczenia zawijania tekstu i odświeżono pamięć offline.


## Aktualizacja v116 – trwały wybór do prezentacji

- Można dodać cały panel „Struktura bezrobocia i historia zmian”.
- Checkbox zaznaczony dla wybranego powiatu, miesiąca i wariantu wykresu nie znika po chwili.
- Ponowne odznaczenie usuwa pozycję; wybory są zapisywane w pamięci przeglądarki.


## Prezentacja na firmówce WUP – v118

Wybierz panele przez „Dodaj” → „Moja prezentacja” → „Generuj PPTX”. Każdy slajd korzysta z oryginalnej firmówki WUP Katowice jako tła 16:9. Generator zapewnia kartom, wykresom i mapom bezpieczny obszar między logotypami i stopką. Tytułowy slajd powstaje automatycznie. Zmiana nie dotyczy plików z danymi ani innych eksportów.


## v120 – mapy i przełączane wykresy w „Mojej prezentacji”

Mapę konkretnego zawodu wybierzesz w sekcji **Barometr Zawodów → Mapa i profil → Wybierz zawód, aby pokazać jego mapę → Dodaj tę mapę**. Dodatkowo przy wykresach trendów, bezrobocia i GUS dostępny jest przełącznik **Dodaj ten wykres**, który zapamiętuje aktualnie wyświetlany wariant. Możesz wrócić do innych ustawień i zapisać kolejne widoki. Identyczne konfiguracje nie dublują slajdów. Szczegóły: `ZMIANY_V120.md`.


## v122 – generator bez pustych wykresów

- Wykresy demografii, historii PUP, trendu Barometru i porównywarki są zapisywane z wartościami liczbowymi, a generator odtwarza je w PowerPoint jako edytowalne elementy.
- Zestawienia kategorii (wiek, wykształcenie, płeć, staż pracy, czas pozostawania bez pracy) zachowują opisy i wartości.
- Brak danych lub wykres niezapisany przed wyrenderowaniem powoduje pominięcie slajdu i czytelny komunikat z nazwami brakujących analiz zamiast pustej planszy.
- Uwaga: wykresy wybrane w starszych wersjach mogą mieć zapisany pusty obraz; odznacz i zaznacz je ponownie w v122, aby zapisać nowe dane liczbowe.


**Aktualizacja v124:** naprawia uruchamianie aplikacji w trybie pliku lokalnego i na serwerze po dodaniu zakładki Płeć; szczegóły: `ZMIANY_V124.md`.
