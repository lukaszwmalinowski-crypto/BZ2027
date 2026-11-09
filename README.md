# Wydanie v182 - 36 autorskich profili rynku pracy (04.11.2026)

W panelu **„Co mówi nam mapa?”** umieszczono 36 redakcyjnie opracowanych, indywidualnych diagnoz i 144 oddzielne perspektywy: PUP, pracodawcy, poszukujący pracy oraz uczniowie. Nie są one automatycznie układane z powtarzalnych szablonów zdań. W każdej jednostce podano miejscowy problem, funkcję w regionie oraz ostrożnie sformułowane kierunki działań.

**Dane wyjściowe i daty:** Barometr Zawodów - prognoza na 2027 r. wraz z komentarzami ekspertów; bezrobocie powiatowe GUS 30.09.2026; cudzoziemcy wykonujący pracę GUS - 31.12.2025; dojazdy do pracy GUS/NSP - **2021** (dane historyczne); kontekst inwestycji i transformacji na podstawie KSSE i Terytorialnego Planu Sprawiedliwej Transformacji 2030. Dane o dojazdach nie dowodzą przyczyn niskiego bezrobocia i nie są aktualnym pomiarem z 2026 r. Źródła merytoryczne: https://barometrzawodow.pl/ , https://katowice.stat.gov.pl/ , https://www.ksse.pl/granice-strefy-2953 , https://transformacja.slaskie.pl/ .

**Zakres zmian:** wyłącznie logika i treść panelu pod mapą, jego jednozdaniowy nagłówek tezy oraz pamięć podręczna PWA. Pozostałe 36 powiatowych danych statystycznych, mapy, układy Apple i mechanizmy eksportu pozostają bez zmian. Tekst dodany do „Moich materiałów” zawiera wybraną perspektywę i tezę lokalną. Redakcyjne profile są przypisane do prognozy 2027; po aktualizacji Barometru wymagają ponownego przeglądu.

---

## Audyt powtórzeń danych (v157)

Wersja v157 usuwa niepotrzebnie powielane KPI w Sytuacji gospodarczej, upraszcza opis demografii i poprawia podpis liczby dostępnych jednostek. Dane źródłowe pozostają bez zmian. Szczegóły: `AUDYT_POWTORZEN_V157.md`.

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

## v153 - osobna Demografia

Zakładka Demografia zawiera oryginalne karty ludności 2026 i profilu powiatowego oraz trzy nowe wykresy rocznych danych GUS 2020-2025. Wszystkie dane działają offline. Pełny zakres i ograniczenia opisano w `ZMIANY_V153.md`.


## v164
- wyrównanie wysokości kart w Bezrobociu i Barometrze na szerokich ekranach
- wspólna dolna linia stopek akcji i przycisków Dodaj
- równiejsze wysokości kafli sygnałów i benchmarku


## v170 - Cudzoziemcy wykonujący pracę (GUS 2025)
W zakładce Sytuacja gospodarcza pojawił się rozwijany panel „Cudzoziemcy wykonujący pracę w województwie śląskim” z danymi za 2025 r. Zawiera 12 miesięcy, 36 powiatów, strukturę obywatelstw i płci. Wykresy można dodać do Moich materiałów i wyeksportować jako natywne, edytowalne wykresy PowerPoint. Poprawiono także eksport lipiec 2025 vs lipiec 2026 w panelu gospodarki - słupki kolumnowe, ze wskazaniem wartości szacunkowej za 2025. Pozostały interfejs Apple nie został zmieniony.


### Wersja v175 - korekta zakładki Cudzoziemcy
- Pełna szerokość wykresu struktury obywatelstw (GUS 2025).
- Wykres osób w module Ukraina: etykiety osi wyłącznie w pełnych osobach.
- Zachowanie wybranego powiatu podczas przełączania GUS/PUP (zgodne nazwy miast i powiatów).
- Odświeżony klucz cache PWA, pozostałe dane oraz wygląd innych działów bez zmian.

## Wersja v183 - Trendy i kompetencje

Nowa zakładka główna "Trendy i kompetencje" przedstawia dwa regionalne badania firm
(WUP Katowice / Grupa BST 2026, N=470; WUP Katowice / EU-CONSULT /
Grupa BST 2025, N=513), cztery obszary przemian pracy oraz wybór powiatu.
Wyniki procentowe z badań dotyczą województwa, a nie poszczególnych powiatów.
Powiatowe odniesienia powstają wyłącznie na podstawie statusów zawodów z
pełnej macierzy Barometru Zawodów 2027 (168 grup x 36 jednostek).
Nie są one lokalnym pomiarem umiejętności cyfrowych ani prognozą liczby etatów.
Wykresy i komentarze można dodać do Moich materiałów, a regionalne wykresy
są eksportowane do PPTX jako edytowalne obiekty.


---

## Instrukcja GitHub Pages

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



---

## Ważne: uruchamianie

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



---

## Historia zmian Dark Analytics v2.1

Obserwatorium BZ2027 - Dark Analytics v2.1 (naprawa)

Wersja przygotowana od oryginalnej paczki main(2), a nie od uszkodzonej v2.
Poprawiono: ciemny CSS jest dołączony poza kodem JavaScript; w v2 trafił do napisu HTML w skrypcie.
Dodano: lekkie animacje kart, słupków, przycisków oraz obsługę preferencji ograniczenia ruchu.
Zachowano: wszystkie oryginalne pliki danych, skrypty i funkcje eksportu.
Zmieniono identyfikator pamięci podręcznej PWA.
Uwaga: jeżeli stary service worker wyświetla starą wersję, odśwież stronę z pominięciem cache lub usuń dane witryny.

