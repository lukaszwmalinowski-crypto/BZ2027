# Obserwatorium Śląskie 2027 — raport kontroli v133

## Zakres wydania

Wdrożenie skupia się na jawnej aktualności danych, spójnej prezentacji kontrolek przy wykresach oraz kontroli kompletności wybranych analiz. Dotychczasowe algorytmy, bazy danych i eksporty PPTX/DOCX pozostają bez zmian. Nie dodawano niezweryfikowanych wartości ani domniemanych aktualizacji danych GUS.

## Potwierdzone testy

- Porównano całą bazę osadzoną w HTML z plikiem `data/dane.json`: identyczne obiekty JSON.
- Zachowano 36 jednostek i 168 grup zawodowych Barometru.
- Sprawdzono bazę demograficzną: 16 pełnych szeregów spośród 36 możliwych jednostek.
- Zweryfikowano w metadanych BAEL do IV kw. 2025, REGON do sierpnia 2026 i bezrobocie wojewódzkie do września 2026.
- Sprawdzono obecność plików wbudowanych oraz wszystkich 36 zasobów objętych audytem referencji (HTML i service worker).
- Test wyizolowanych kontrolek w Chromium, przy szerokościach 900 oraz 390 px: bez błędów JavaScript i poziomego przewijania.
- Test kontroli eksportu: wybory z danymi, wybory puste, blokada pustego zbioru, świadome potwierdzanie przy brakach, brak niepotrzebnego potwierdzenia przy poprawnych danych.
- Porównanie SHA-256 potwierdza niezmienione pliki głównego generatora PowerPoint, Word, modułu wyboru analiz i danych.

## Zidentyfikowany dług technologiczny

W odziedziczonym pliku HTML jest 84 wewnętrznych bloków CSS i ponad 4100 wystąpień `!important`. Usuwanie ich hurtowo bez pełnego testu wszystkich ekranów i wariantów niosłoby wysokie ryzyko regresji. Zamiast tego w wersji v133 zastosowano jedną nową, ograniczoną do modułów warstwę stylów. Pełne wydzielenie i scalanie reguł powinno nastąpić w kolejnym etapie, po stworzeniu automatycznych testów wizualnych dla każdego widoku.

## Granice potwierdzenia

Nie udało się przeprowadzić pełnego testu kompletnej aplikacji z dużą bazą w środowisku przeglądarkowym: bezpośrednia nawigacja `file://` oraz lokalny serwer HTTP były blokowane przez środowisko. Testowano osobno kontrolki oraz integralność danych i skryptów. Nie deklarujemy ukończonej walidacji Safari i wszystkich kombinacji generatorów. Nie wykonywano migracji istniejących zapisanych analiz w pamięci przeglądarki.
