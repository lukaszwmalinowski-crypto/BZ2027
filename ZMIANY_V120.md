# v120 – mapy zawodów i każdy przełączany wykres w prezentacji

- Dodano widoczny wybór „Mapa do prezentacji” bezpośrednio przy mapie Barometru.
- Dodano przycisk „Wybierz zawód, aby pokazać jego mapę”, który otwiera filtr „Widok mapy i analiza zawodu” i ustawia kursor w polu „Analiza zawodu”.
- Można zapisać każdą mapę Barometru w wybranym trybie oraz mapę konkretnego zawodu dla 36 jednostek. Zmiany wyboru zawodu i trybu pozwalają zachować różne mapy w jednej prezentacji.
- Dodano „Dodaj ten wykres” do trendu Barometru, struktury i historii bezrobocia PUP, wykresu powiatowego, wykresów GUS/BAEL/REGON/demografii oraz regionalnych porównań gospodarczych.
- Klucz identyfikacji uwzględnia aktualne przełączniki typu wykresu, kategorii, okresu, grupy, powiatu i dostępnych selektorów. Zaznaczenie pozostaje trwałe tylko dla identycznego wariantu, a inne warianty można dodać osobno.
- Generator PPTX na firmówce WUP zachowuje obrazy SVG wybranych wykresów, zamiast zamieniać je na tekst lub automatycznie zastępować wskaźnikami. Wykresy zbudowane z pasków HTML są prezentowane jako edytowalne rankingi.
- Powtarzające się identyczne konfiguracje są ignorowane w koszyku i w generatorze.
- Dane statystyczne, funkcje eksportu Excel i AI oraz istniejące listy zawodów pozostały bez zmian.
- Zaktualizowano cache PWA do v120.

## Jak wybrać mapę zawodu
Barometr Zawodów → Mapa i profil → Wybierz zawód, aby pokazać jego mapę → Analiza zawodu → wybierz grupę zawodów → Dodaj tę mapę → Moja prezentacja → Generuj PPTX.

## Weryfikacja
Test Chromium (1280px) z wbudowaną bazą: start aplikacji bez błędów JS; 10 wyborów wykresów plus wybór mapy; mapa zawodu zapisana z nazwą i SVG; dwa warianty przełączanego trendu zachowane jako odrębne elementy. Eksport PPTX z mapą zawodu i trendem, otwarcie i render 3 slajdów w LibreOffice. Test strony z osadzonymi plikami wykonano na about:blank ze względu na ograniczenia nawigacji lokalnej przeglądarki. Nie przeprowadzono pełnego testu w Safari ani GitHub Pages.
