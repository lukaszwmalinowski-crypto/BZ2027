# Obserwatorium Śląskie 2027 - Studio v36

Narzędzie dla GitHub Pages. Główna baza: `data/dane.json`.

## Eksport v36

PDF, wydruk struktury PUP i prezentacja PowerPoint używają oryginalnej niebieskiej firmówki WUP Katowice. Slajdy mają format 16:9, PDF format A4 poziomo z zachowaniem proporcji nagłówka i stopki. Grafika jest osadzona w index.html i działa bez połączenia z internetem.

## Układ v35

Wersja 35 poprawia siatkę list zawodów, układ filtrów, skalowanie wykresu trendów, odstępy mapy i rankingów oraz organizację źródeł. Na telefonie podgląd listy obejmuje 4 zawody, na tablecie 6, na komputerze 8. Przycisk rozwija całość.

Osobne widoki: Mapa, Zawody, Trendy, Bezrobocie, Dane GUS, Rankingi i Źródła. Na telefonie wybór widoku zajmuje jeden wiersz, szczegóły są zwijane, a struktura i historia mają przełącznik. Na tabletach wykresy i karty są w dwóch kolumnach.

Do aktualizacji wyglądu wystarczy podmienić `index.html`; zawiera style, moduły i zapasową migawkę danych. Pełna paczka zachowuje dodatkowe pliki eksportu oraz aktualizacji danych.

## Co dodano

- 1123 sprawdzone zestawienia pełnej struktury bezrobocia dla 20 powiatów i miast.
- 1373 obserwacje liczby bezrobotnych dla 24 powiatów i miast, głównie z lat 2020-2026.
- Przekroje: wiek, wykształcenie, staż pracy i czas pozostawania bez pracy. Oddzielny wybór kobiet i wszystkich bezrobotnych.
- Wybór okresu, historia kategorii, wartości w osobach i procentach, tabela liczbowa, eksport CSV i JSON oraz karta do wydruku / zapisania jako PDF.
- Katalog 2732 dokumentów źródłowych z 29 PUP (w tym Tychy), przypisany do obszaru właściwego urzędu.
- Dostępność danych dla wszystkich 36 jednostek, z jawnym oznaczeniem braków.

Dane PUP zasilają także dotychczasowe wykresy liczby bezrobotnych, porównania i mapę. Nie zastępują serii stopy bezrobocia GUS ani prognozy Barometru Zawodów.

## Jak otworzyć nową sekcję

Wybierz powiat, a następnie przycisk „Przejdź do danych PUP i struktury bezrobocia” pod nazwą powiatu. Możesz też przejść do „Statystyki” i rozwinąć „Bezrobocie w powiatach - historia i struktura”.

## Podmiana na GitHubie

Aby naprawić samo uruchamianie, podmień `index.html` w głównym katalogu dotychczasowego repozytorium. Możesz też wgrać całą zawartość paczki, zastępując istniejące pliki. Zachowaj katalogi `assets`, `js` i `data`. Wersja v32 ma kod i style PUP wbudowane także w `index.html`, dzięki czemu uruchamia się nawet bez osobnych plików JS. Szczegóły: `NAPRAWA_WCZYTYWANIA_V32.md`. Po publikacji GitHub Pages odśwież stronę (Ctrl+F5).

Paczka zawiera kompletną bazę. Nie wgrywaj dużych archiwów PDF do repozytorium aplikacji. Linki do oryginalnych dokumentów są w narzędziu.

Lokalny podgląd po otwarciu `index.html` korzysta z aktualnej migawki danych wbudowanej w HTML. Na GitHub Pages baza jest odczytywana z `data/dane.json`.

## Zakres i braki

Nie każdy pobrany dokument został przekształcony w liczby. Część dotyczy gmin, zawiera skany lub ma niejednoznaczny układ. Do pełnej struktury dopuszczono tylko tabele z uzgodnionymi sumami czterech przekrojów i kobiet. Brak obserwacji nie oznacza zera. Nie sumujemy niepełnego zbioru powiatów do wartości wojewódzkiej.

Dokładny zakres jednostek i okresów: `ZAKRES_DANYCH_PUP_V31.md`. Struktura i miesięczna liczba osób mają odrębne zakresy. Nie łączymy danych powiatu, miasta i gmin w jedną obserwację. Zmiana zasad rejestracji od czerwca 2025 r. wymaga ostrożności przy porównaniach.

## Aktualizacja danych

Centralny JSON ma nowe pola `strukturaPup` i `powiatBezrobocie.pup`. Po ręcznej zmianie danych należy również odświeżyć migawkę `panelInitialSnapshot` w `index.html`, aby podgląd bez serwera korzystał z tej samej wersji.

Skrypty w `scripts/` dokumentują odczyt źródeł. Są przeznaczone do pracy z zachowanym zbiorem materiałów źródłowych, nie do uruchamiania przez użytkownika strony. `PUP_IMPORT_ROOT` wskazuje katalog roboczy oryginalnego zbioru. Nie pobierają samodzielnie aktualizacji z urzędów.

## v33 - porządek w sekcjach

Wykaz dostępności, katalog dokumentów PUP, odnośniki źródłowe i metodologia są w końcowej sekcji „Źródła danych”. W analizie bezrobocia pozostają wyniki, filtry, wykresy i eksport oraz krótki link do źródeł.
