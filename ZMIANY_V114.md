# v114 – usunięcie nakładających się i powtarzających elementów

Podstawa: v113. Dane i mechanizmy obliczeniowe niezmienione.

- Usunięty powtarzający się pas tytułu (Barometr Zawodów / Bezrobocie / Sytuacja gospodarcza oraz podtytuł) – bieżącą sekcję identyfikuje istniejąca nawigacja.
- Ukryte dodatkowe, powtarzające się duże tytuły podwidoków; pozostają tytuły merytoryczne wewnątrz kart.
- Przeniesione pola „Dodaj” na koniec kart do normalnego przepływu (bez `position:absolute` i bez sztucznego `padding-top:48px`).
- Ograniczone zagnieżdżone selektory wyboru prezentacji, które powodowały nadmiar checkboxów.
- Mapa i profil układają się w jednej kolumnie na tabletach, a w dwóch na szerokich ekranach; sygnały są czytelniejsze.
- Uspójniona siatka kart benchmarku i bezpieczne zawijanie długich etykiet.
- Ograniczenia: nie przeprowadzono testów Safari na fizycznych urządzeniach. Zmiany były testowane przez izolowane uruchomienie HTML+JS w Chromium.

## Kontrola końcowa

- Widok w Chromium z uruchomionym lokalnie kodem HTML, CSS i JavaScript: 1440 px, 834 px (pionowy iPad), 390 px (iPhone).
- Wysokość i szerokość elementów mapy na 834 px: mapa oraz profil mają po 794 px; brak wąskiej karty z pustym polem obok.
- Brak poziomego przewijania całej strony na 1440 px, 834 px i 390 px.
- Naprawiony service worker: usunięto odwołania do nieistniejących `v112` CSS/JS oraz błędne wywołanie `cache.put`.
- Pliki GUS, Barometru, PUP i pozostałe źródłowe dane zachowane bez zmian.
- Uwaga: na testowych zrzutach lokalnie osadzonej strony logo może nie zostać wczytane, ponieważ zasoby obrazów mają adresy względne; w paczce jest oryginalny plik logo.
- Do końcowej weryfikacji pozostają Safari na fizycznych urządzeniach i rzeczywisty eksport PowerPoint/PDF.
