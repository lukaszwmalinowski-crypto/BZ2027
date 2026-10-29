# Rozbudowa bezrobocia powiatowego – wersja 12 (GUS / BDL)

## Jak działa aktualizacja oficjalnych danych

W panelu dostępne są wszystkie 36 jednostek powiatowych województwa śląskiego, widok miesięczny dla dowolnego roku 2016–2026 i widok grudniowy 2016–2025. Użytkownik może wybrać stopę bezrobocia (%) lub liczbę osób, zestawić do czterech powiatów, oglądać mapę wartości / zmian oraz dodać dowolny wariant do listy eksportu PDF i PPTX.

**Stan paczki w chwili przygotowania:** brak pełnego pobrania z API GUS/BDL; zachowane są dane bazowe z wersji 11 (36 stóp za 31.08.2026 oraz historia Rudy Śląskiej). Brakujące lata i liczby osób nie są wyliczane ani uzupełniane szacunkami. Panel pokazuje licznik rzeczywiście dostępnych obserwacji.

### Jedno uruchomienie w Windows

1. Rozpakuj całą paczkę ZIP do folderu. Potrzebny jest zainstalowany **Python 3** i dostęp do internetu.
2. Kliknij dwukrotnie **`AKTUALIZUJ_BDL.bat`**. Alternatywnie w terminalu: `python aktualizuj_bdl.py`.
3. Skrypt pobiera rzeczywiste wartości z Banku Danych Lokalnych, sprawdza kompletność 36 jednostek i zakres danych, po czym uzupełnia **`data/bezrobocie_powiaty_historia.json`**, tworzy **CSV** i osadza zweryfikowaną bazę w **`index.html`**. Nie trzeba ręcznie importować JSON w przeglądarce.
4. Otwórz ponownie `index.html` lub wgraj te zmienione pliki na GitHub Pages (index.html oraz dane). W sekcji „Zmiany bezrobocia w powiatach” będzie widoczna data aktualizacji i liczba obserwacji.
5. Jeśli API jest chwilowo niedostępne lub nie można potwierdzić co najmniej 90 miesięcy stopy dla KAŻDEGO powiatu, skrypt kończy się błędem i nie podmienia starej bazy.

**Na GitHub Pages:** W paczce jest również `.github/workflows/aktualizacja-bdl.yml`. Po umieszczeniu projektu w repozytorium można uruchamiać „Actions → Aktualizacja danych GUS BDL – powiaty → Run workflow”, a plan działa dwa razy w miesiącu (po skonfigurowaniu uprawnień Actions do zapisu repozytorium). W przypadku błędu pobrania pliki się nie zmieniają. GitHub Pages musi publikować aktualizowany branch.

### Źródła i metoda

- [GUS BDL, stopa bezrobocia rejestrowanego – dane miesięczne, P3559](https://bdl.stat.gov.pl/BDL/dane/podgrup/temat/4/12/3559) – 12 zmiennych odpowiadających miesiącom. Dostępność: 2011–2026; w panelu użyto 2016–2026.
- [GUS BDL, liczba bezrobotnych zarejestrowanych według płci – dane miesięczne, P2961](https://bdl.stat.gov.pl/BDL/dane/podgrup/temat/4/12/2961) – pobierany jest **wyłącznie ogółem**, nie suma płci i nie liczba napływu.
- [Identyfikatory 36 powiatów GUS BDL](https://bdl.stat.gov.pl/BDL/metadane/teryt/lista/345) – województwo śląskie ma ID 012400000000.
- [Dokumentacja GUS API BDL](https://api.stat.gov.pl/home/bdlapi) – API umożliwia pobieranie wielu lat dla jednej zmiennej; obowiązują limity wywołań.

Wartości nie są zaokrąglane arbitralnie poza prezentacją stopy do dwóch miejsc po przecinku. Brak danych (`null`) pozostaje brakiem. W latach 2021–2022 występuje zmiana podstaw metodologicznych stopy bezrobocia; od czerwca 2025 r. zmieniły się zasady rejestracji bezrobotnych. Nie należy interpre­tować tych różnic bez zastrzeżeń.

**Zastrzeżenia:** Nie potwierdzono w tym środowisku bezpośredniego pobrania pełnego zbioru GUS – połączenia z BDL były blokowane. Mechanizm aktualizacji został sprawdzony na syntetycznym zestawie testowym; takie dane nie są dołączone do paczki. Przed oficjalną prezentacją warto zestawić kilka odczytów z lokalnym PUP i oznaczyć miesiąc referencyjny.
