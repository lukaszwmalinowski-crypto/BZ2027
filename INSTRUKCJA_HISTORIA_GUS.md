# Historia wskaźników GUS – import danych

W sekcji GUS / Kondycja gospodarki kliknij Zatrudnienie, Wynagrodzenia lub Produkcja sprzedana przemysłu. Rozwiń „Wczytaj oficjalne dane historyczne (CSV)” i wskaż plik z danymi źródłowymi.

Kolumny: `metric;period;mode;slaskie;polska;unit`.

`metric`: `zatrudnienie_sektor_przedsiebiorstw`, `wynagrodzenie_brutto`, `produkcja_sprzedana_przemyslu`. `period`: `YYYY-MM`. `mode`: `value` (poziom) lub `yoy` (zmiana r/r w procentach). Obie lokalizacje muszą być policzone według tej samej definicji i jednostki. Przykładowy szablon zawiera tylko nagłówki — bez wymyślonych obserwacji.

Wykresy obsługują okresy 12 miesięcy / 3 lata / 5 lat / cały dostępny szereg, prezentują dwie linie, a dane są zapisywane lokalnie w przeglądarce. Import zastępuje poprzedni zestaw. Nie jest to automatyczny import XLSX z GUS.

Źródło arkuszy GUS: https://katowice.stat.gov.pl/opracowania-biezace/komunikaty-i-biuletyny/inne-opracowania/sytuacja-spoleczno-gospodarcza-wojewodztwa-slaskiego-we-wrzesniu-2026-r-%2C2%2C180.html

Uwaga: dane 2015–2026 nie zostały automatycznie pobrane, ponieważ dostęp do plików źródłowych nie powiódł się. Widok nie sugeruje, że taki szereg już istnieje w aplikacji.
