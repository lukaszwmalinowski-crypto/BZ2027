# Bezrobocie powiatowe - moduł v10

Moduł zawiera **36 wartości stopy bezrobocia na 31.08.2026** przeniesionych z panelu v7 oraz **17 dodatkowych zweryfikowanych obserwacji Rudy Śląskiej**: 10 wartości grudniowych z lat 2016-2025 i 7 wartości miesięcznych styczeń-lipiec 2026. Dla innych powiatów długie szeregi nadal są niekompletne. Sekcja jest domyślnie zwinięta, ale otwiera się w trybie prezentacji.

## Import danych

1. Otwórz moduł „Zmiany bezrobocia w powiatach”.
2. Przygotuj CSV UTF-8 z separatorem `;` i nagłówkami `powiat;okres;stopa_proc;liczba_osob;zrodlo` (szablon w `data/`).
3. W kolumnie `okres` używaj `YYYY-MM`: np. `2025-12` lub `2026-09`. `stopa_proc` może zawierać przecinek dziesiętny. Liczba osób może być pusta, jeżeli źródło jej nie zawiera.
4. Wczytaj CSV. Dane są przechowywane **lokalnie w przeglądarce** (localStorage). Nie są wysyłane na serwer. Możesz też importować JSON zawierający listę `entries` w tym samym schemacie.
5. Po imporcie zweryfikuj liczbę okresów i jednostek oraz daty przed eksportem.

Nie wolno wypełniać braków przez interpolację ani domyślnym wskaźnikiem wojewódzkim. Brak danych oznacza brak punktów na wykresie. Na mapie „Zmiana” potrzebne są co najmniej dwie wartości z kolejnych dostępnych okresów.

Źródła:
- GUS: https://publikacje.new.stat.gov.pl/portal-publikacje/bezrobotni-zarejestrowani-i-stopa-bezrobocia-stan-w-koncu-wrzesnia-2026-r
- GUS BDL: https://bdl.stat.gov.pl/BDL/dane/podgrup/temat/4/12/3559
- WUP Katowice: https://wupkatowice.praca.gov.pl/rynek-pracy/statystyki-i-analizy

## Eksport

W checkliście PDF/PPTX dostępnych jest pięć dodatkowych wariantów. Jeśli brak odpowiednich danych, warianty historyczne pozostają wyszarzone. Eksport mapy uwzględnia wybrany okres i sposób prezentacji. W trybie prezentacji moduł pozostaje widoczny.

**Status:** Interfejs i import działają na dostępnych danych; pełne dane dla powiatów 2016-2026 wymagają uzupełnienia z oficjalnych tablic GUS/BDL.

Dodatkowe źródło zweryfikowanej historii Rudy Śląskiej: https://rudaslaska.praca.gov.pl/stopy-bezrobocia (wartości po korekcie, publikacja powiatowego urzędu pracy). Dane za sierpień 2026 dla Rudy Śląskiej pozostają z bazowego zestawu panelu v7.


## Wersja 12 - uzupełnianie z GUS/BDL
Aktualizacja automatyczna i zakres 2016-2026: zobacz `AKTUALIZACJA_BDL_2016_2026.md`. Pełna baza nie jest obecnie wbudowana w tę paczkę; uruchom aktualizację przez `AKTUALIZUJ_BDL.bat`.
