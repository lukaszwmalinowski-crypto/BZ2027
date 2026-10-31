# GUS – dane wbudowane offline (v104)

Zlikwidowano import użytkownika z widocznych sekcji Demografia powiatowa i Historia wskaźników gospodarczych. Dane dla AI, mapa, Barometr Zawodów i powiatowe dane PUP są zachowane.

## Pokrycie
- Ludność na 31 grudnia: 16/36 jednostek. 13 miast z istniejącej paczki InfoGZM (2014–2025) + Częstochowa, Bielsko-Biała i powiat częstochowski (2016–2025).
- Historia wersji v104: podawano jeden punkt wynagrodzeń powiatowych (Częstochowa 2025, źródło wtórne). Moduł wycofano w v105 z powodu braku porównywalnych szeregów.
- Wskaźniki gospodarki wojewódzkiej: z dotychczasowej wersji, bez zmian. Miesięczne szeregi 2015–2026 nie zostały wbudowane. Kliknięcie w regionalny wskaźnik pokazuje opis i istniejące porównanie 2025/2026 z jasnym oznaczeniem obliczeń.

**Nie wolno deklarować kompletnej bazy 36 powiatów ani pełnej historii wynagrodzeń**. Żaden brak nie został uzupełniony estymacją.

## Źródła
- GeoTaktyka: https://geotaktyka.pl/analizy/slaskie/czestochowa ; https://geotaktyka.pl/analizy/slaskie/bielsko-biala ; https://geotaktyka.pl/analizy/slaskie/czestochowski
- GUS BDL: https://bdl.stat.gov.pl/bdl/dane/podgrup/temat/40/403/2497
- Częstochowa, wynagrodzenia za 2025 (serwis wtórny na podstawie BDL): https://deweloperuch.pl/statystyki/czestochowa/dane-rzadowe
- Zachowane dane InfoGZM: jak w poprzednich wersjach.

## Aktualizacja
Plik `data/gus_bdl_demografia.json` znajduje się w paczce i jest buforowany przez service workera. Nie trzeba nic ręcznie wgrywać. Automatyczna aktualizacja z GUS BDL w repozytorium wymaga dalszego dopracowania i nie jest gwarantowana. Zmiana `sw.js` unieważnia wcześniejszy cache po publikacji.

## Aktualizacja w wersji v105
Niekompletną kartę „Wynagrodzenia powiatowe” usunięto z interfejsu i usunięto jej jednostkowy zbiór offline. Porównanie regionalne Śląskie–Polska pozostaje w zakładce GUS.
