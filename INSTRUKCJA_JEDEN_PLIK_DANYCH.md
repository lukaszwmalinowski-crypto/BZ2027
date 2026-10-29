# Aktualizacja danych — jeden plik

Aplikacja na GitHub Pages wczytuje **data/dane.json** przy każdym otwarciu strony. Wszystkie główne wskaźniki wykresów i map korzystają z tego pliku.

1. Otwórz `data/dane.json` w repozytorium GitHub.
2. Zmień konkretne wartości w odpowiedniej sekcji (Barometr: `barometr`, BAEL i REGON: `gus`, powiaty: `powiatBezrobocie`). Nie usuwaj pól ani nie zmieniaj nazw powiatów.
3. Zapisz zmiany przez **Commit changes**. GitHub Pages opublikuje najnowszy plik; przy ponownym otwarciu strony aplikacja pobierze jego aktualną wersję.
4. W `meta.wersja` wpisz datę aktualizacji. Jest widoczna na stronie jako kontrola wersji.
5. Automatyzacja GUS/BDL (jeśli uruchomiona) aktualizuje pole `powiatBezrobocie.bdl` **w tym samym pliku**, bez zmieniania HTML.

## Ważne
- GitHub Pages nie pobiera danych z GUS automatycznie samą podmianą pliku: do tego służy osobne zadanie GitHub Actions.
- Kiedy `dane.json` ma błędną strukturę, aplikacja wyświetla komunikat zamiast pokazywać nieaktualne dane z HTML.
- Strona jest statyczna i nie wymaga Apps Script ani serwera aplikacyjnego.
- Przycisk F5/odświeżenie strony pobiera plik ponownie. GitHub może potrzebować krótkiego czasu na publikację commitu.
- Część redakcyjnych podpisów i opisów metodologicznych ma stałą treść; przy zmianie dat odniesienia lub metodologii trzeba zweryfikować je również merytorycznie.
- Dane historyczne powiatów GUS za wszystkie miesiące nie zostały dodane w tej paczce – wpisy z `powiatBezrobocie.bdl` pozostają takie jak w v18, dopóki nie zostanie wykonana aktualizacja.
