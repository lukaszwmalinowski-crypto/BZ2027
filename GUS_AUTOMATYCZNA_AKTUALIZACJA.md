# GUS BDL – automatyczne zasilanie (wersja 99)

Wersja 99 zawiera **mechanizm automatycznego pobrania**, ale nie zawiera jeszcze nowo pobranego kompletnego szeregu GUS: środowisko przygotowania paczki nie mogło połączyć się z API BDL. Brakujących danych nie zastępowano szacunkami.

## Uruchomienie bez ręcznego przepisywania

1. Umieść wszystkie pliki paczki w głównym katalogu repozytorium GitHub Pages, łącznie z ukrytym folderem `.github`.
2. W GitHub wybierz **Actions → Aktualizacja demografii GUS BDL → Run workflow**.
3. Workflow sprawdzi metadane wybranej zmiennej, pobierze wszystkie jednostki poziomu powiatowego z woj. śląskiego i zapisze `data/gus_bdl_demografia.json` tylko wtedy, gdy rozpozna minimum 30 jednostek. Przy błędzie nie zastępuje istniejącego pliku.
4. Odśwież aplikację. Raz w miesiącu workflow spróbuje zaktualizować dane automatycznie. W repozytorium wymagane są uprawnienia zapisu dla GitHub Actions.

**Zakres obecnej automatyzacji:** ludność ogółem (demografia), 2014–2026 w zakresie publikacji GUS. Pozostałe dane gospodarcze i struktura ludności nie są jeszcze objęte automatycznym pobieraniem.

**Kontrola merytoryczna:** wskaźnik BDL o identyfikatorze 72305 wymaga potwierdzenia metadanych i zgodności dat odniesienia na pierwszym uruchomieniu. Skrypt ma zabezpieczenia przed publikacją niepełnego zestawu. Nie stanowi to potwierdzenia poprawnego pobrania ani kompletności danych za 2026 r.

**Źródło:** https://api.stat.gov.pl/Home/BdlApi (licencja CC BY 4.0, przypisanie: Główny Urząd Statystyczny, Bank Danych Lokalnych).
