# Obserwatorium - zmiany v153

## Samodzielna zakładka Demografia

- Dodano czwarty główny dział **Demografia** obok Barometru Zawodów, Bezrobocia i Sytuacji gospodarczej.
- Oryginalne karty z liczbą ludności na 30.06.2026 r. oraz historią ludności powiatów i miast (2014-2025, pokrycie częściowe) przeniesiono do nowej zakładki **bez kopiowania ani zmieniania ich identyfikatorów i obsługi**.
- W Sytuacji gospodarczej pozostawiono wskaźniki gospodarcze, BAEL i REGON. Usunięto z jej paska podsumowań zduplikowaną kartę populacji.
- Dodano Demografię do **ciągłego trybu prezentacji**. Tryb obejmuje teraz 8 sekcji, widocznych jedna pod drugą.
- Dodano nowy dział do nawigacji tabletu i telefonu, z czterema równymi przyciskami na telefonie.

## Raport Urzędu Statystycznego w Katowicach, 2025

Dodano oficjalny, lokalnie zapisany zbiór `data/demografia_slaskie_2020_2025_gus.json` z danymi z publikacji **Sytuacja demograficzna województwa śląskiego w 2025 r.** z 8 lipca 2026 r.:
- liczba mieszkańców ogółem, kobiety, mężczyźni, miasta i wieś: 2020-2025;
- urodzenia żywe i zgony: 2020-2025;
- przyrost naturalny: 2020-2025 (urodzenia minus zgony);
- saldo migracji na pobyt stały: 2020-2025.

Dane zachowano również w centralnym `data/dane.json`, w kopii wbudowanej w HTML i w pliku eksportu dla AI.

## Nowe wykresy

1. Liczba ludności w latach 2020-2025, przełącznik pięciu serii.
2. Urodzenia i zgony, zestawione słupki w latach 2020-2025.
3. Saldo migracji stałych, ujemny szereg 2020-2025.

Wykresy zbudowano w SVG, z czytelną siatką, etykietami, obsługą dotyku i poprawionymi proporcjami na telefonie. Dodano źródło i metodologię w zakładce Źródła oraz metadane w eksportach PowerPoint i Word.

## Zakres, ograniczenia i daty

- Dane za 2025 r. odnoszą się do **31 grudnia 2025 r.** lub całego roku 2025; nie zastępują nowszego stanu z 30.06.2026 r.
- Historia ludności powiatów w oryginalnej aplikacji wciąż ma niepełne pokrycie. Nie imputowano danych dla brakujących jednostek.
- Wykresy demograficzne są opisem historycznym, nie prognozą na 2027 r.
- W tym wydaniu nie zmieniono danych Barometru Zawodów, bezrobocia, BAEL ani REGON.

## Źródło

Urząd Statystyczny w Katowicach, *Sytuacja demograficzna województwa śląskiego w 2025 r.*, opublikowano 08.07.2026: https://katowice.stat.gov.pl/publikacje-i-foldery/ludnosc/sytuacja-demograficzna-wojewodztwa-slaskiego-w-2025-r-%2C8%2C3.html
