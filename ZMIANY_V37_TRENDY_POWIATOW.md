# Wersja 37 – trendy bezrobocia w powiatach

- Nowy przycisk: **Pokaż dostępne trendy PUP (liczba bezrobotnych, 2026)**. Wybiera maksymalnie cztery jednostki mające najwięcej obserwacji w 2026 i pokazuje ich przebieg miesięczny.
- Pod wykresem automatyczne karty kierunku i wielkości zmiany pomiędzy pierwszą i ostatnią dostępną obserwacją w wybranym okresie, z podaniem dat oraz zakresu dostępności.
- Nie mieszamy liczby osób ze stopą bezrobocia. Dla brakujących punktów nie dopisujemy wartości, nie interpolujemy linii.
- Zmiana odczytywana z kolejnych dostępnych obserwacji to zmiana między punktami, nie prognoza. Nie oznacza ciągłości w brakujących okresach.
- Oba tryby działają w `index.html` offline oraz w zewnętrznym `js/county.js`.
