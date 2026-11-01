# Zmiany v126 — wykresy liniowe w prezentacjach

- Zastąpiono rysowanie linii przez wiele niezależnych obiektów `ShapeType.line` jednym natywnym wykresem liniowym PowerPointa na slajd. Dzięki temu punkty i odcinki mają spójne połączenia we wszystkich seriach.
- Wykresy pozostają edytowalne w PowerPoincie. Zachowano wartości, liczbę serii i daty oraz nie zastosowano interpolacji wygładzającej wartości pośrednich.
- Brak pomiarów jest zapisywany jako luka (`displayBlanksAs: gap`), a nie połączenie przez nieistniejący punkt.
- Zaokrąglono zakresy osi i jednostki podziałki, ograniczono grubość linii oraz zmniejszono znaczniki punktów.
- Zachowano firmówkę WUP i pozostałe typy slajdów.
- Zmieniono nazwę cache usługi offline na v126.

## Kontrola

W Chrome (silnik Chromium) przetestowano przeglądarkową bibliotekę PowerPoint używaną w aplikacji na pięciu szeregach: Barometr Zawodów, ludność Katowic, BAEL Śląskie/Polska, miesięczne bezrobocie Śląskie/Polska i REGON. Wygenerowano 6-slajdowy plik PPTX z rzeczywistymi danymi zawartymi w paczce; plik zweryfikowano i wyrenderowano w LibreOffice. Nie przetestowano prezentacji na komputerze Mac w Keynote.
