# Wersja 29 - eksport bez pustych slajdów i krótszy ekran startowy

- Usunięto cały ozdobny baner „INTERAKTYWNY ATLAS DANYCH / 2027”, w tym duży tytuł i grafikę orbit. Wybór danych pojawia się od razu pod nawigacją.
- Eksport powiatowej historii bezrobocia wymaga co najmniej dwóch obserwacji **wybranego powiatu** w wybranym okresie i dla wybranego wskaźnika. Jeden miesiąc nie tworzy trendu.
- Porównanie powiatów wymaga co najmniej dwóch powiatów, w tym powiatu raportu, i co najmniej dwóch **wspólnych** okresów. Nie tworzymy wykresu na podstawie nieporównywalnych serii.
- Mapy powiatowe wymagają danych w co najmniej 30 z 36 jednostek. Tryb zmian wymaga wartości również w poprzednim okresie.
- BAEL 2026 Śląskie / Polska jest wyłączone z eksportu dopóki wykres przedstawia jedynie Polskę 2026 i Śląskie 2025.
- Niedostępne pozycje checklisty są wyszarzone i pokazują przyczynę. Stan wybranych pozycji uwzględnia tylko dostępne dane.
- Zasady obowiązują wspólnie w PDF i PowerPoint; główne zweryfikowane moduły pozostają bez zmian.

Uwaga: generator nie pobiera nowych danych. Historia bezrobocia w Częstochowie nadal wymaga uzupełnienia w `data/dane.json`.

- Poprawiono fizyczne indeksy i identyfikatory relacji slajdów PowerPoint po sortowaniu, aby kolejność w pliku odpowiadała kolejności logicznej.
- Test dla Częstochowy: 18 slajdów zamiast 24; usunięte puste i nieporównywalne sekcje; zweryfikowano też PDF.
