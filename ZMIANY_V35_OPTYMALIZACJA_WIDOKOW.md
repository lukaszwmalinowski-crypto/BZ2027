# Wersja 35 - optymalizacja widoków

- Zawody: pełna szerokość listy, licznik i przycisk pod listą, nazwa nad etykietami; podgląd 4/6/8 pozycji na telefonie/tablecie/komputerze. Rozwinięcie pokazuje całość.
- Usunięty konflikt zagnieżdżonych kontenerów .jobs i dawnych reguł filtrów. Przyciski mapy zachowują naturalną szerokość; nie pojawiają się w widoku zawodów.
- Wybrany profil zawodu jest przy filtrach; pusty profil nie zajmuje miejsca.
- Trendy: podsumowanie nad wykresem, wykres dostosowuje geometrię do szerokości, poprawione etykiety końcowe i marginesy.
- Mapa: krótszy profil i usunięty nieaktualny opis; ustawienia mapy zwinięte po wejściu do widoku.
- Bezrobocie: selektor powiatu zajmuje tylko potrzebną szerokość.
- Rankingi: krótsze wiersze. GUS: zachowany układ kart i mobilne rozwijanie.
- Źródła: dostępność PUP na początku widoku, dokumentacja w rozwijanych grupach.

Walidacja: Chrome, szerokości 390, 834, 1194 oraz 1363 piksele CSS. Wszystkie siedem widoków bez przewijania całej strony w poziomie; sprawdzono rozwijanie listy i wybór zawodu. Test danych obejmuje 1123 struktury i 1373 obserwacje liczby osób. Brak testu na fizycznym iPadzie/Safari. Dane merytoryczne zachowane.

Wdrożenie: podmień index.html na GitHubie. Zawiera aktualne moduły i style; pełna paczka zachowuje zasoby eksportu i aktualizacji danych.
