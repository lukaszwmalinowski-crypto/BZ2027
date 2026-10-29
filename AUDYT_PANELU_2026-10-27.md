# Audyt panelu Prognoza Rynku Pracy 2027
**Wersja:** v7 | **Data:** 27 października 2026 r. | **Zakres:** ostatnia wersja v6 przekazana do sprawdzenia, uzupełniona i przetestowana w przeglądarce.

## Wynik
Wersja v6 zawierała poważny błąd inicjalizacji mapy i braki w wizualizacji BAEL 2026. W wersji v7 naprawiono błędy techniczne i zwiększono przejrzystość dostępności danych. W tabeli niżej rozróżniono **działające funkcje** od **braków źródłowych**, których nie można poprawić bez potwierdzenia oryginalnych danych GUS.

| Obszar | Wynik audytu | Uwagi |
|---|---|---|
| Mapa województwa | POPRAWIONO / PRZETESTOWANO | 36 ścieżek mapy; błąd klasy `county` na dekoracyjnym punkcie legendy trendów mógł przerwać inicjalizację; selektory zostały ograniczone do `#map`. |
| Profil powiatu | PRZETESTOWANO | 36 jednostek w bazie, 37 pozycji na liście z opcją wojewódzką; wybór jednostki działa. |
| Zawody 2027 | SPRAWDZONO | 168 grup zawodów; kompletna macierz 168 × 36; wartości statusów: D, DD, R, N, X. |
| Sumy ocen dla powiatów | SPRAWDZONO | W 36 jednostkach suma kategorii równa się 168. |
| Trendy 2024-2027 | PRZETESTOWANO | Dane powiatowe dostępne na wszystkie 4 lata; przełączniki kategorii, liczba/udział i liniowy/słupkowy. Zmieniona w latach liczba ocenianych grup jest objaśniona. |
| Bezrobocie rejestrowane | PRZETESTOWANO | Miesięczna stopa 2026 (I-IX), porównanie Polski i Śląskiego, wartości historyczne 2016-2025 oraz liczba bezrobotnych miesięcznie i historycznie. |
| Kluczowe liczby IX 2026 | ZWERYFIKOWANO | Woj. śląskie: 4,8% stopy bezrobocia; 83 604 zarejestrowanych bezrobotnych (30.09.2026), według WUP Katowice. |
| Stopy bezrobocia powiatów | DANE STARSZE - OPISANE | Karta powiatu i mapa odnoszą się do 31.08.2026, mimo że wskaźnik wojewódzki jest już z września. Porównania uwzględniają odrębne daty. |
| BAEL: Śląskie na tle Polski | POPRAWIONO WIZUALIZACJĘ | Widok historyczny pokazuje obie serie. Widok 2026 pokazuje wartość Śląskiego z IV kw. 2025 i polskie wartości z I-II kw. 2026 jako RÓŻNE okresy. Nie jest to pełne porównanie 2026. |
| BAEL: dane regionalne 2026 | BRAK W DOSTARCZONEJ BAZIE | US Katowice opublikował informację za II kw. 2026 w dniu 29.09.2026. Dane liczbowe Śląskiego za I i II kw. 2026 nie zostały jeszcze bezspornie odczytane i zweryfikowane z tabel źródłowych. Nie wprowadzono liczb wymyślonych lub interpolowanych. |
| BAEL: integralność pliku JSON | POPRAWIONO | Sprzeczny zapis aktywności zawodowej w IV kw. 2025 (54,9% przy wskaźniku zatrudnienia 55,0%) poprawiono do 56,5% zgodnie z osadzonym szeregiem historycznym; wymaga końcowego potwierdzenia tabelą GUS. |
| REGON | PRZETESTOWANO | Widok na 10 tys. ludności (2016-2025) i liczba podmiotów na sierpień 2026. Różne jednostki przedstawione osobno. |
| Rankingi 2027 | POPRAWIONO | Cztery zestawienia po 10 pozycji; ranking zawodów w deficycie uwzględnia teraz statusy D oraz DD. |
| Profil zawodu | PRZETESTOWANO | Po wyborze zawodu aktywny jest profil w 36 jednostkach i możliwość zaznaczenia go do eksportu. |
| Porównywarka powiatów | W PANELU | Wybór do trzech jednostek; kompletność danych źródłowych powiatów sprawdzona. |
| Archiwum | W PANELU | Lata 2017-2026, listy zawodów 2021-2026, starsze karty częściowo kierują do oficjalnego źródła. |
| Eksport PDF | PRZETESTOWANO | Przy zaznaczeniu tylko 3 wykresów utworzono dokument PDF o 3 stronach (bez pozostałych sekcji). PDF powstaje przez systemowy dialog drukowania, opcja „Zapisz jako PDF”. |
| Eksport PowerPoint | PRZETESTOWANO | Wygenerowano plik PPTX w przeglądarce; test wyboru dwóch elementów dał 2 slajdy. |
| Checklista BAEL | ULEPSZONO | Oddzielne pozycje do eksportu: aktywność historyczna, zatrudnienie historyczne, aktywność 2026, zatrudnienie 2026. Przy eksporcie poprzednio wybrany wskaźnik zostaje przywrócony. |
| Tryb prezentacji | W PANELU | Zachowano wcześniejszy tryb pełnoekranowy, w tym rankingi; nie przeprowadzono odrębnego testu wizualnego na projektorze. |

## Sprawdzone relacje i ograniczenia
- 36 powiatów/miast na prawach powiatu występuje spójnie we wszystkich pięciu zestawach `powiaty`, `mapa`, `bezrobocie`, `trendy-historyczne` i w macierzy zawodów.
- Zestawy regionalne BAEL 2026 w bazie zawierają `null` (brak danych Śląskiego), dlatego rysowanie serii 2026 byłoby nierzetelne. Widok 2026 jasno to komunikuje i pokazuje ostatni potwierdzony punkt regionalny (IV kw. 2025).
- Aplikacja ma wewnętrzne dane rezerwowe w `index.html`. Katalog `data/` zawiera kopię i metadane, lecz **sama edycja JSON bez aktualizacji osadzonych danych w HTML nie odświeży wykresów**. To nie jest aplikacja aktualizująca się automatycznie.
- Zmiana prezentacji PDF nie oznacza tworzenia PDF przez bibliotekę JS: użytkownik wybiera „Zapisz jako PDF” w oknie drukowania przeglądarki.
- Wyniki „Barometru Zawodów 2027” i szeregi historyczne nie zostały niezależnie porównane pozycja po pozycji z każdą źródłową publikacją - kontrola dotyczy kompletności i spójności przekazanego zbioru danych.

## Źródła referencyjne
- WUP Katowice, rynek pracy - statystyki: https://psz.praca.gov.pl/web/wojewodzki-urzad-pracy-w-katowicach/rynek-pracy/statystyki-i-analizy
- US Katowice, BAEL w województwie śląskim, II kw. 2026, publikacja z 29.09.2026: https://publikacje.new.stat.gov.pl/portal-publikacje/aktywnosc-ekonomiczna-ludnosci-w-wojewodztwie-slaskim-w-2-kwartale-2026-r
- GUS, BAEL - Polska 2026: https://ssgk.stat.gov.pl/Rynek_pracy_BAEL.html
- BDL GUS, BAEL w przekroju terytorialnym: https://bdl.stat.gov.pl/bdl/dane/podgrup/temat/4/623/3969
