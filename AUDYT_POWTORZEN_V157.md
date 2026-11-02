# Audyt powtórzeń danych w Obserwatorium - v157

Data kontroli: 02.11.2026. Podstawa: pełna paczka v156, struktura DOM, moduły JavaScript, źródła danych i opisy kart. Audyt służy uporządkowaniu prezentacji; nie stanowi ponownej walidacji wszystkich liczb w GUS.

## Zidentyfikowane i poprawione powtórzenia

1. **Sytuacja gospodarcza - cztery pierwotne KPI**: wcześniejsze KPI ludności, stopy bezrobocia, liczby bezrobotnych i REGON były powielane obok dedykowanych kart. Wcześniejszy kod usuwał tylko KPI ludności. W v157 usuwany jest cały wtórny zestaw KPI, pozostają dedykowane wykresy REGON, osobna karta demografii i regionalne bezrobocie rejestrowane.
2. **Demografia - karta najnowszego stanu**: powtarzała w dodatkowych kafelkach dwa wskaźniki (-27,4 tys. ubytku naturalnego i -2,2 tys. salda migracji), które są już dostępne w regionalnym raporcie demograficznym niżej. Zamiast nich pozostawiono krótki opis procesów depopulacji i starzenia się ludności, z pełnym źródłem.
3. **Demografia - interpretacja pod wykresami**: dotychczas przepisywała ponownie konkretne liczby urodzeń, zgonów, ubytku naturalnego i migracji. Teraz podaje relację i wniosek, oraz wskaźnik dzietności jako dodatkowy kontekst; szczegółowe wartości są w kartach KPI i na wykresach.
4. **Zakres danych powiatowych**: etykieta „wybór 36” nie odpowiadała selektorowi zawierającemu 16 jednostek z zapisanymi szeregami. Podpis poprawiono tak, by nie sugerował dostępności danych dla wszystkich 36 jednostek.
5. **Demografia - okres źródeł**: notatka kierowała do karty z 30.06.2026 „niżej”, choć jest ona powyżej wykresów rocznych. Poprawiono odwołanie.
6. **Informacje o źródłach powiatowych**: skrócono jedno powtarzające się objaśnienie o dostępności offline; odsyłacze i metodologię pozostawiono.

## Powtórzenia uzasadnione, pozostawione

- **Barometr Zawodów:** liczby deficytów/równowagi w karcie powiatu, trendzie i rankingach odpowiadają innym pytaniom analitycznym; nie są wymiennymi prezentacjami tego samego wykresu.
- **Bezrobocie:** aktualny stan, przebieg miesięczny, struktura PUP i porównanie powiatów są odrębnymi analizami. Nie wolno łączyć z BAEL z uwagi na odmienne definicje.
- **Demografia:** ludność na 31.12.2025 i 30.06.2026 to różne okresy; oba należy zachować, wyraźnie opisując daty.
- **Rankingi 2027:** wykresy największych/najmniejszych wskazań i najczęściej/najrzadziej deficytowych zawodów opisują odmienne skrajne zbiory.
- **Źródła:** odnośniki przy wykresach pomagają czytelnikowi zweryfikować bezpośrednie dane, a dział „Źródła” dokumentuje całość.

## Kontrole techniczne

- Kod źródłowy i moduł JS osadzony w HTML są identyczne w zmodyfikowanej części `js/layout.js`.
- Zestawy danych (`data/*.json`, wewnętrzne snapshoty) nie zostały zmienione.
- Lista głównych zakładek i ciągły tryb prezentacji pozostały bez zmian.
- Zmieniono nazwę pamięci podręcznej PWA, aby przeglądarka pobrała nową wersję.

## Ograniczenia audytu

Analiza dotyczy zduplikowanego *sposobu przedstawiania* danych i oznaczeń. Nie wprowadza nowych danych statystycznych ani nie potwierdza ich bieżącej aktualności w źródłach zewnętrznych. Automatyczna przeglądarka w środowisku wykonawczym blokowała dostęp do lokalnej aplikacji, dlatego pełny test wizualny na konkretnych urządzeniach pozostaje do sprawdzenia po publikacji.
