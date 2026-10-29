# Źródła danych i instrukcja aktualizacji — panel v9

**Stan przeglądu:** 28.10.2026. **Uwaga:** zakresy i daty dotyczą danych faktycznie osadzonych w panelu.

## Jak aktualizować dane

1. Pobierz najnowsze publikacje ze wskazanych oficjalnych stron i sprawdź datę odniesienia, jednostkę miary oraz metodologię.
2. Zaktualizuj wymienione pliki w `data/` i odpowiadające im **osadzone dane w `index.html`**. Obecna aplikacja nie podmienia automatycznie wartości na wykresie po zmianie samego JSON.
3. Dla powiatowego bezrobocia możesz importować CSV/JSON w module. Dane importowane pozostają w lokalnym `localStorage` bieżącej przeglądarki. Użyj „Zapisz bazę JSON”, aby zachować wynik. Jeśli nowe dane mają być wspólne dla wszystkich użytkowników, trzeba je także osadzić w plikach projektu.
4. Przed publikacją sprawdź daty na kartach, kompletność 36 jednostek, sumy ocen, spójność danych wojewódzkich z powiatowymi, BAEL dla porównywalnych kwartałów oraz eksport PDF i PPTX.
5. Nie dopisuj wartości do brakujących okresów na podstawie interpolacji lub wartości z innego roku.

## Zestawy danych i źródła

### 01 · Barometr Zawodów — prognozy, trendy i archiwum

**Barometr Zawodów 2027 – mapa, profil powiatu, zawody i rankingi**  
Stan danych: 2027 • 36 jednostek, 168 grup; cykl: roczna.  
Aktualizacja: Po udostępnieniu kolejnej prognozy odśwież oceny zawodów, komentarze, liczniki oraz profil zawodu. Rankingi i benchmark powstają z tych danych.  
Pliki: `data/powiaty.json`, `data/zawody.json`, `data/meta.json`  
Źródła: [Oficjalne publikacje Barometru Zawodów](https://barometrzawodow.pl/index.php/modul/publikacje)

**Trendy powiatowe i wojewódzkie**  
Stan danych: 2024–2027; cykl: roczna.  
Aktualizacja: Zaktualizuj szeregi 2024–2025 oraz prognozę 2026–2027; sprawdź, czy liczba grup ocenianych w latach jest porównywalna.  
Pliki: `data/trendy-historyczne.json`, `data/powiaty.json`  
Źródła: [Prognozy i raporty roczne](https://barometrzawodow.pl/index.php/modul/publikacje)

**Historia struktury ocen powiatowych**  
Stan danych: 2023 (udziały procentowe); cykl: archiwum.  
Aktualizacja: Zestawienie archiwalne. Przy zmianach definicji lub korekcie raportu sprawdź wartości dla wszystkich 36 jednostek.  
Pliki: `data/historia_2023.json`  
Źródła: [Publikacje Barometru Zawodów](https://barometrzawodow.pl/index.php/modul/publikacje)

**Archiwum 10 lat i listy zawodów deficytowych**  
Stan danych: 2017–2026; listy 2021–2026; cykl: roczna.  
Aktualizacja: Dopisz nową edycję archiwum, zweryfikuj liczby kategorii, listy zawodów i kontekst 2022. Lata 2017–2020 mają w panelu przede wszystkim odsyłacze do prognoz.  
Pliki: `data/historia_2017_2026_wojewodztwo.json`, `data/historia_zawody_2021_2026.json`, `data/historia_2022_kontekst.json`  
Źródła: [Prognoza wojewódzka 2026](https://barometrzawodow.pl/modul/prognozy-na-plakatach?county=&form-group%5B%5D=all&province=12&publication=province&year=2026), [Archiwum publikacji](https://barometrzawodow.pl/index.php/modul/publikacje)

### 02 · Bezrobocie — region i powiaty

**Bezrobocie rejestrowane – województwo i Polska**  
Stan danych: Miesiące I–IX 2026; historia 2016–2025; cykl: miesięczna.  
Aktualizacja: Co miesiąc: stopa bezrobocia i liczba zarejestrowanych osób w województwie oraz wartości Polski. Zachowaj porównywalność metodologii i okresów.  
Pliki: `data/gus_woj_slaskie.json`  
Źródła: [WUP Katowice – statystyki](https://wupkatowice.praca.gov.pl/rynek-pracy/statystyki-i-analizy), [GUS – tablice miesięczne](https://publikacje.new.stat.gov.pl/portal-publikacje/bezrobotni-zarejestrowani-i-stopa-bezrobocia-stan-w-koncu-wrzesnia-2026-r)

**Bezrobocie – 36 powiatów i miast**  
Stan danych: 31.08.2026 • tylko jedna data w bazie; cykl: miesięczna.  
Aktualizacja: Zaktualizuj stopę bezrobocia we wszystkich 36 jednostkach do wspólnego miesiąca, uzupełnij liczbę bezrobotnych i sprawdź zgodność z województwem.  
Pliki: `data/bezrobocie.json`, `data/bezrobocie_powiaty_historia.json`  
Źródła: [GUS – tablice powiatowe](https://publikacje.new.stat.gov.pl/portal-publikacje/bezrobotni-zarejestrowani-i-stopa-bezrobocia-stan-w-koncu-wrzesnia-2026-r), [BDL – wskaźniki miesięczne](https://bdl.stat.gov.pl/BDL/dane/podgrup/temat/4/12/3559)

**Historia i porównania bezrobocia powiatowego**  
Stan danych: 2016–2026 • niekompletne; cykl: do uzupełnienia.  
Aktualizacja: Brak pełnego szeregu miesięcznego i historycznego. Importuj prawdziwe obserwacje CSV/JSON w module. Dane zaimportowane w przeglądarce nie zapisują się automatycznie w pliku projektu – eksportuj bazę JSON.  
Pliki: `data/bezrobocie_powiaty_historia.json`, `data/bezrobocie_powiaty_szablon.csv`  
Źródła: [BDL – stopa bezrobocia w powiatach](https://bdl.stat.gov.pl/BDL/dane/podgrup/temat/4/12/3559), [GUS – zestawienia XLSX](https://publikacje.new.stat.gov.pl/portal-publikacje/bezrobotni-zarejestrowani-i-stopa-bezrobocia-stan-w-koncu-wrzesnia-2026-r)

### 03 · GUS / BDL — BAEL, REGON, demografia

**BAEL – Śląskie na tle Polski**  
Stan danych: Historia: 2016–2025; 2026 bez potwierdzonych wartości Śląskiego; cykl: do uzupełnienia.  
Aktualizacja: Zestaw kwartalne wskaźniki aktywności zawodowej i zatrudnienia dla Śląskiego i Polski z tych samych kwartałów. W bazie regionalne wartości 2026 są puste: koniecznie uzupełnij je z tabel GUS, bez interpolacji.  
Pliki: `data/gus_woj_slaskie.json`  
Źródła: [US Katowice – BAEL II kw. 2026](https://publikacje.new.stat.gov.pl/portal-publikacje/aktywnosc-ekonomiczna-ludnosci-w-wojewodztwie-slaskim-w-2-kwartale-2026-r), [GUS – BAEL Polska](https://ssgk.stat.gov.pl/04.2026/Rynek_pracy_BAEL.html)

**REGON – podmioty gospodarki narodowej**  
Stan danych: Historia 2016–2025; stan VIII 2026; cykl: miesięczna / roczna.  
Aktualizacja: Zaktualizuj liczby podmiotów za najnowszy miesiąc, podział kategorii i szereg na 10 tys. mieszkańców. Nie mieszaj wartości bezwzględnych z wskaźnikami względnymi.  
Pliki: `data/gus_woj_slaskie.json`  
Źródła: [US Katowice – najważniejsze informacje](https://katowice.stat.gov.pl/zakladka1/), [Bank Danych Lokalnych GUS](https://bdl.stat.gov.pl/bdl/start)

**Ludność województwa śląskiego**  
Stan danych: 30.06.2026; cykl: półroczna.  
Aktualizacja: Po nowej publikacji GUS zmień liczbę mieszkańców oraz datę. Wartość w panelu podana jest w tysiącach.  
Pliki: `data/gus_woj_slaskie.json`  
Źródła: [GUS – stan ludności 30.06.2026](https://publikacje.new.stat.gov.pl/portal-publikacje/ludnosc-stan-i-struktura-ludnosci-oraz-ruch-naturalny-w-przekroju-terytorialnym-w-2026-r-stan-w-dniu-30-czerwca)

### 04 · Dane pomocnicze i techniczne

**Geometria mapy i podział terytorialny**  
Stan danych: 36 jednostek • warstwa techniczna; cykl: w razie zmian.  
Aktualizacja: To nie są statystyki. Aktualizuj kształty mapy i listę jednostek wyłącznie przy zmianie granic lub układu administracyjnego.  
Pliki: `data/mapa.json`  
Źródła: [Geoportal – dane przestrzenne (referencyjnie)](https://www.geoportal.gov.pl/)

**Metadane i wskaźniki na nagłówku**  
Stan danych: Prognoza 2027; stopa 4,8% w pliku meta; cykl: przy aktualizacji.  
Aktualizacja: Sprawdź liczbę zawodów, rok prognozy, datę i wskaźnik wojewódzki. W niektórych modułach te same wartości są zapisane również wewnątrz HTML.  
Pliki: `data/meta.json`, `data/gus_woj_slaskie.json`  
Źródła: [WUP Katowice](https://wupkatowice.praca.gov.pl/rynek-pracy/statystyki-i-analizy), [Barometr Zawodów](https://barometrzawodow.pl/index.php/modul/publikacje)

## Wymagające szczególnej uwagi

- **BAEL 2026 – woj. śląskie:** pola regionalne w `data/gus_woj_slaskie.json` są puste; mimo opublikowania danych za II kwartał 2026 nie wprowadzono niepotwierdzonych wartości.
- **Bezrobocie w powiatach:** wbudowano wartości z sierpnia 2026 dla 36 jednostek; historia 2016–2026 jest niekompletna, a liczba bezrobotnych w wierszach bazowych pozostaje pusta.
- **Źródła i dane pomocnicze:** mapę SVG i metadane aktualizuj w razie zmiany granic, prognozy lub dat statystycznych.

## Wykaz plików w katalogu data/

- `bezrobocie.json`
- `bezrobocie_powiaty_historia.json`
- `bezrobocie_powiaty_szablon.csv`
- `gus_woj_slaskie.json`
- `historia_2017_2026_wojewodztwo.json`
- `historia_2022_kontekst.json`
- `historia_2023.json`
- `historia_zawody_2021_2026.json`
- `mapa.json`
- `meta.json`
- `powiaty.json`
- `trendy-historyczne.json`
- `zawody.json`

## Aktualizacja v10 – bezrobocie w powiatach

Moduł jest domyślnie zwinięty. Wszystkie 36 jednostek mają tylko wartość bazową za sierpień 2026. Dla Rudy Śląskiej dołączono sprawdzone wartości roczne (grudzień 2016–2025) i miesięczne (styczeń–lipiec 2026) z PUP Ruda Śląska: https://rudaslaska.praca.gov.pl/stopy-bezrobocia . Pełną historię pozostałych powiatów uzupełniaj z GUS/BDL. Dane osadzone w HTML oraz JSON muszą być aktualizowane spójnie.


## Uzupełnienie 2026-10-28 – miesięczne bezrobocie 36 powiatów

**Źródło podstawowe:** GUS/BDL, grupa P3559 – stopa bezrobocia (miesięcznie) i P2961 – liczba bezrobotnych ogółem (miesięcznie). Powiaty: BDL/TERYT dla woj. śląskiego (012400000000).

**Fizyczny plik:** `data/bezrobocie_powiaty_historia.json` oraz po aktualizacji `data/bezrobocie_powiaty_historia.csv`. Aby dane pojawiły się również w otwieranym offline panelu, skrypt `aktualizuj_bdl.py` wstawia je do znacznika `countyUnemploymentBDLSeed` w `index.html`.

**Jak aktualizować:** Uruchom `AKTUALIZUJ_BDL.bat` (Python 3, internet) lub w GitHub Actions workflow `Aktualizacja danych GUS BDL – powiaty` (po konfiguracji repozytorium). Instrukcja: `AKTUALIZACJA_BDL_2016_2026.md`.

**Weryfikacja:** przed nadpisaniem sprawdzane są 36 powiatów i min. 90 obserwacji stopy na powiat. Odczyty liczby bezrobotnych dostępne są po odnalezieniu kompletnych 12 wskaźników „ogółem” w P2961. Braki nie są zastępowane szacunkami.

**Status paczki:** pełna historia nie została jeszcze pobrana z API w środowisku przygotowania; należy uruchomić powyższy updater i sprawdzić licznik w panelu.
