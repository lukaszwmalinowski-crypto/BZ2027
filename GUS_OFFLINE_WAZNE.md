# Dane GUS / demografia – tryb offline (v100)

W paczce zapisano **13 istniejących serii demograficznych** 2014–2025 z InfoGZM jako plik `data/gus_bdl_demografia.json` (z oznaczeniem źródła). Pozostałych 23 serii **jeszcze nie pobrano** i nie należy twierdzić, że są dostępne.

Po pierwszym otwarciu pod adresem GitHub Pages service worker zachowuje dane i pliki aplikacji w pamięci urządzenia. W przypadku instalacji PWA baza jest dostępna offline, o ile Safari/Chrome nie wyczyści pamięci witryny. Przy otwarciu `index.html` lokalnie w systemie plików mogą występować ograniczenia `fetch` — do niezawodnego trybu offline zalecana jest zainstalowana PWA.

## Jak uzupełnić wszystkie 36 jednostek bez ręcznego przepisywania

W repozytorium uruchom workflow GitHub Actions: „Aktualizacja demografii GUS BDL”. Po skutecznym pobraniu skrypt nadpisze `data/gus_bdl_demografia.json` rzeczywistymi danymi 36 jednostek, a następna publikacja umożliwi ich lokalne zapisanie. Ograniczenia: obecna automatyzacja dotyczy wyłącznie rocznej liczby ludności, nie wszystkich danych gospodarczych; skrypt należy zweryfikować wobec metadanych API.

Tę paczkę można uruchamiać offline; nie należy utożsamiać działania offline z kompletnością danych.
