# v117 — eksport wybranych analiz do PowerPointa

- Dedykowany układ slajdu 16:9, a nie tekst `innerText` w jednym polu.
- Rankingi są rysowane jako edytowalne słupki, wskaźniki jako karty liczbowe, a SVG/PNG są skalowane bez deformacji.
- Usunięto etykiety sterowania aplikacją i formularze z treści prezentacji.
- Dopasowanie kontekstu powiatu/regionu oraz redukcja duplikatów.
- Zapis struktury wskaźników/rankingów w koszyku przy nowym wyborze.
- Zachowanie dotychczasowych danych, obsługi mapy, eksportów i wyborów.
- Slajdy są tworzone na podstawie danych dostępnych w momencie zaznaczenia.

## Testy wykonane 31.10.2026

- Generowanie pliku PowerPoint 16:9 na podstawie 14 wskazanych elementów z przykładowej prezentacji.
- W wygenerowanym pliku: 12 slajdów (strona tytułowa + 11 slajdów danych).
- Weryfikacja otwarcia oraz renderowania w LibreOffice.
- Kontrola przepełnień slajdów: pozytywna.
- Test funkcji przy użyciu Node.js z rzeczywistą biblioteką PptxGenJS.
- Nie sprawdzono pełnej ścieżki interaktywnej w Safari na iOS ani w produkcyjnym GitHub Pages.

Ważne: slajdy map i trendów korzystają z grafiki z chwili wyboru; typowe rankingi i kafle liczbowe są edytowalnymi obiektami PowerPoint.
