# Prognoza rynku pracy 2027 – województwo śląskie

Statyczny, responsywny panel przygotowany do publikacji w **GitHub Pages**.

## Zawartość

- `index.html` – kompletna aplikacja (dane, geometria mapy, logika i style są osadzone w pliku),
- `.nojekyll` – wyłącza przetwarzanie Jekyll w GitHub Pages,
- `README.md` – instrukcja publikacji.

## Publikacja na GitHub Pages

1. Utwórz nowe repozytorium na GitHubie, np. `prognoza-rynku-pracy-2027`.
2. Wgraj do głównego katalogu repozytorium pliki z tej paczki.
3. Wejdź w **Settings → Pages**.
4. W sekcji **Build and deployment** wybierz **Deploy from a branch**.
5. Wybierz gałąź `main` oraz katalog `/ (root)` i zapisz.
6. Po publikacji strona będzie dostępna pod adresem w rodzaju:
   `https://NAZWA-UZYTKOWNIKA.github.io/prognoza-rynku-pracy-2027/`

## Responsywność

Panel ma osobne układy dla:

- komputerów,
- tabletów (do ok. 1100 px),
- telefonów (do ok. 820/600 px),
- bardzo wąskich ekranów (do 390 px).

Na urządzeniach dotykowych mapa działa przez dotknięcie powiatu; tooltip typu hover jest wyłączony, a dane wybranego powiatu pojawiają się w panelu poniżej mapy.

## PDF

Przycisk generowania PDF korzysta z funkcji drukowania przeglądarki. W oknie drukowania warto włączyć **Grafika w tle**, aby zachować kolory.

## Aktualizacja

Ponieważ aplikacja jest statyczna, aktualizacja polega na podmianie `index.html` w repozytorium.
