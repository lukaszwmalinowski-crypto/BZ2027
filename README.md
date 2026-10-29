**Studio v29** — zobacz `ZMIANY_V29_EKSPORT_BEZ_PUSTYCH_SLAJDOW.md`. Wersja usuwa ozdobny baner startowy i blokuje generowanie wykresów przy braku porównywalnych danych. Aktualizacja danych: `data/dane.json` na GitHub Pages.

# Obserwatorium Śląskie 2027 — Studio v24

Samodzielna aplikacja analityczna dla GitHub Pages. **Nie zawiera edytora danych ani logo WUP.**

## Funkcje

- Interaktywna mapa wszystkich 36 jednostek województwa śląskiego.
- Profile powiatów i 168 grup zawodów, trendy, porównania i rankingi.
- Bezrobocie, BAEL, REGON, dane historyczne i źródła.
- Tryb prezentacji oraz wybór treści do PDF i PPTX, eksport XLSX.
- Responsywny interfejs oraz uproszczony dostęp do filtrów na pierwszym ekranie.

## Instalacja

1. Wgraj zawartość paczki do głównego katalogu repozytorium GitHub.
2. W Settings → Pages wybierz Deploy from a branch, main, /(root).
3. Otwórz opublikowaną aplikację w przeglądarce.

## Dane

Dane liczbowe pochodzą z `data/dane.json`. Aplikacja pobiera plik przy otwieraniu strony. Aktualizuj go poza panelem, np. osobnym edytorem, a następnie podmień na GitHubie. Nie wszystkie opisy metodologiczne są automatyczne. Pełna historia bezrobocia wszystkich powiatów wymaga weryfikacji i uzupełnienia oficjalnymi danymi.

## Pliki

- `index.html` — interfejs.
- `js/` — logika aplikacji i integracja centralnej bazy.
- `data/dane.json` — baza danych statystycznych.
- `assets/pptxgen.bundle.js` — generowanie PowerPoint.
- `.github/workflows` i `aktualizuj_bdl.py` — opcjonalne aktualizacje BDL.

Nie edytuj danych w `index.html`. Edytor jest osobnym narzędziem, nie jest częścią tego repozytorium.

## Ważne dla v22
Zobacz `WAZNE_JAK_URUCHOMIC.md` — naprawiono informację o braku danych podczas lokalnego podglądu. Panel nadal korzysta z jednego pliku `data/dane.json`.

## Zmiana v24 — brak ręcznego wczytywania plików

GitHub Pages zawsze pobiera aktualne `data/dane.json`; nie ma przycisku wyboru pliku. Otwarcie `index.html` bezpośrednio z dysku działa na wbudowanej migawce startowej. Migawka służy tylko do lokalnego podglądu i nie zastępuje centralnego JSON na GitHubie. Zobacz `WAZNE_JAK_URUCHOMIC.md`.
