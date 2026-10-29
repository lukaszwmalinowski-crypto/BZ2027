# v58 - baza i artefakty

- Naprawiono rozmiar ikon SVG w nagłówkach struktury bezrobocia; nie mogą rozciągać sekcji i tworzyć czarnych kwadratów.
- Kompletna baza wbudowana w pakiet to pełnoprawne źródło offline i nie powoduje czerwonego komunikatu w nagłówku. Dokładna przyczyna nieudanej próby pobrania z serwera pozostaje w konsoli.
- Service worker v58 usuwa starsze cache i próbuje pobrać świeże `data/dane.json`, używając pamięci podręcznej w razie braku sieci.
- Zachowano dane, eksporty i ikonę PWA.
