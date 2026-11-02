# Obserwatorium · Rynek Pracy · 2027

**Wersja v144.** Zmieniono nazwę prezentowaną w dokumentach Word i PowerPoint, metadanych eksportów oraz w tytule i manifeście aplikacji. Zachowano logo graficzne, dotychczasowe dane i funkcje. Szczegóły: `ZMIANY_V144.md`.

---

## Wersja 135 - redakcja dokumentów Word i PowerPoint

- W dokumentach DOCX i PPTX długie myślniki (–, —) zastępowane są zwykłym znakiem `-`.
- W dokumentach nie są publikowane teksty techniczne dotyczące obsługi aplikacji, podglądu, mechanizmu wyboru i pominięć generatora.
- Zachowano istotne komentarze metodologiczne i odwołania do źródeł statystycznych.
- Nie zmieniono danych źródłowych, układu aplikacji i mechanizmu wyboru analiz.

# Obserwatorium Śląskie 2027 — v133

# v133 — stabilizacja i kontrola jakości (01.11.2026)

1. **Jawne zakresy danych**: rozwijany, krótki panel w trzech głównych obszarach: Barometr (strona mapy), Bezrobocie i GUS z datami, zakresem terytorialnym, ograniczeniami i odsyłaczem do źródeł. Nie zmienia liczb.
2. **Kontrola materiałów**: po otwarciu „Moich materiałów” system sprawdza zaznaczone analizy i sygnalizuje brak zawartości, wykresy zapisane tylko jako tekst oraz identyczne wybory. Przed eksportem wymagającym uwagi użytkownik jest informowany. Nie generuje dokumentu, gdy wszystkie wybory są puste.
3. **Spójność wykresów**: wyłącznie nieinwazyjne korekty skalowania SVG, czytelności tytułów/legend i precyzji odstępów. Nie zmieniono kolorów semantycznych map i klasyfikacji zawodów.
4. **Utrzymanie kodu**: nowa warstwa `assets/obserwatorium-v133.css` i `assets/obserwatorium-v133.js`, z wąsko określonymi selektorami, bez mnożenia globalnych reguł `!important`. Uaktualniono wersję pamięci offline.
5. **Kontrola integralności**: `scripts/check_v133_integrity.py` audytuje pliki, sumy danych, okresy, pakiet offline i składnię linkowania.

### Świadomie bez ryzykownej przebudowy
Nie usuwano 80+ odziedziczonych bloków CSS hurtowo. Pełna refaktoryzacja wymagająca testów przeglądarkowych każdego widoku jest osobnym etapem. Nie aktualizowano automatycznie niezaimportowanych danych BAEL/REGON i nie symulowano braków demograficznych.

---
**Wersja 129:** nowy wygląd okna „Moje materiały” (PowerPoint w kolorze niebieskim, Word w kolorze turkusowym, licznik wyborów, responsywność). Szczegóły: `ZMIANY_V129.md`.

# Obserwatorium Śląskie 2027 — v128

**Moje materiały**: zaznacz wybrane wykresy, mapy, statystyki i listy zawodów. W jednym koszyku możesz zmienić kolejność oraz usunąć zbędne pozycje. Następnie wybierz **Generuj PowerPoint** (slajdy 16:9 na firmówce WUP) albo **Generuj Word DOCX** (edytowalny raport A4 z tabelami i wykresami). Pojedynczy wybór danych obsługuje oba formaty.

**Word offline:** biblioteka do tworzenia plików DOCX jest dołączona lokalnie. Raport zawiera stronę tytułową, sekcje z wybranymi analizami, wykresy i edytowalne dane tabelaryczne, źródła oraz numerację stron. W razie braku danych aplikacja pomija element i wyświetla komunikat, zamiast generować pusty rozdział.

**Uruchamianie:** rozpakuj całą paczkę ZIP, nie tylko `index.html`. Otwórz `index.html` lub opublikuj katalog na GitHub Pages. Nie usuwaj folderu `assets`, bo zawiera biblioteki eksportu.

---

# Wersja 126 - czytelne połączenia linii wykresów PPTX (01.11.2026)

**Wykresy liniowe w prezentacjach WUP** są teraz natywnymi, edytowalnymi wykresami PowerPoint. Każda seria jest rysowana jako jeden ciągły przebieg, bez nakładania niezależnych odcinków i nieestetycznych styków. Zachowano punkty pomiaru i rzeczywiste wartości (bez sztucznego wygładzania). Luki w danych pozostają przerwami.

Poprawiono podziałkę osi na regularne, zaokrąglone wartości (bez sztucznych cyfr po przecinku przy liczbie osób), delikatne linie pomocnicze, znaczniki oraz legendę dla wielu serii. Zachowano firmówkę WUP, inne typy wykresów i mechanizm „Moja prezentacja”. Cache offline ma identyfikator v126, aby starsze skrypty nie były używane po aktualizacji.

> **Aktualizacja v125 (31.10.2026):** poprawki generatora PowerPoint i szablonu slajdów; szczegóły w `ZMIANY_V125.md`.

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


## Zmiany v127

Zobacz `ZMIANY_V127.md`. Globalne czyszczenie zaznaczeń jest w „Mojej prezentacji”; podgląd PDF ma powrót do narzędzia, wykresy liniowe PPTX mają adaptacyjne etykiety liczbowe.


## v130 - Word jak raport analityczny
Nowy generator DOCX zachowuje wspólny koszyk „Moje materiały”. Układ editorial: tytuł, podsumowanie z faktów, kluczowe wskaźniki, płynne rozdziały z wykresami i tabelami, źródła. Bez osobnej pustej strony tytułowej.

## Wersja 131 - bezrobocie rejestrowane WUP
Dane źródłowe za wrzesień 2026 i szeregi miesięczne 2020-2026 w `data/bezrobocie_wup_2020_2026.json` (także osadzone offline w `data/dane.json` i `index.html`). W zakładce „Sytuacja gospodarcza” pod kartą „Bezrobocie rejestrowane” jest rozszerzenie „Dane miesięczne WUP” z 16 przełączanymi wskaźnikami i wyborem roku. Wskaźnik stopy bezrobocia Śląskie–Polska pozostaje odrębny.


## Wersja 132 – porównanie od 2 do 5 powiatów

Porównywarka w Barometrze Zawodów generuje wykres i tabelę dla wszystkich pięciu wybranych jednostek. Na ekranie telefonu wykres i tabela są przewijane wewnątrz modułu. Przyciskiem „Wyczyść” można usunąć wszystkie pięć wskazań. Dokładny opis: ZMIANY_V132.md.


## Aktualizacja v134 (01.11.2026)

Sekcje „Bezrobocie rejestrowane” (Śląskie i Polska, 2016–2025 i 2026) oraz „Dane miesięczne WUP” (2020–2026) zostały przeniesione z „Sytuacji gospodarczej” do głównej zakładki „Bezrobocie”. Ustawienia obu wykresów można nadal zapisywać w „Moich materiałach”. Dane źródłowe i generatory eksportu pozostały bez zmian.

## Aktualizacja v136 - miękki fiolet

Wersja 136 zachowuje wszystkie funkcje v135 i wprowadza nową, lżejszą warstwę wyglądu na podstawie dostarczonej wersji "miękki fiolet". Szczegóły: `ZMIANY_V136.md`. Po publikacji nadpisz **wszystkie pliki** z ZIP (nie sam `index.html`), aby zadziałał nowy arkusz stylów i uaktualniona pamięć offline.
