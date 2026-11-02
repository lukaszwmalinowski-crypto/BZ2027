# v159 - Fioletowe tło widoczne we wszystkich widokach

## Przyczyna niewidocznej zmiany w v158
Nowa wartość tła w pliku index.html i assets/layout.css była nadpisywana przez późniejszy motyw v83 oraz arkusz v136 z deklaracją !important. Dodatkowo service worker nadal miał cache v157.

## Poprawka
- Dodano **assets/theme-purple-v159.css** jako ostatni arkusz na stronie.
- Ustawiono ciemnofioletowy gradient jako tło body, z zachowaniem jasnych kart.
- Jasne tytuły rozdziałów pozostają czytelne na ciemnym tle.
- Zmieniono nazwę cache PWA na v159 i dodano nowy CSS do listy offline.
- Nie zmieniono danych statystycznych, logiki wykresów ani eksportów.

## Aktualizacja instalacji na GitHub Pages
Po zastąpieniu plików odśwież stronę, a w przypadku zainstalowanej PWA zamknij i otwórz aplikację ponownie.
