# v56 - ikona i PWA

- Dołączono oryginalny znak jako ikony PNG 48-512 px, bez zmiany czarnego środka i kolorów.
- Dodano ikony maskowalne 192 i 512 px z bezpiecznymi marginesami.
- Dodano `manifest.webmanifest`, favicon, ikonę iOS oraz `sw.js` do cache offline.
- Serwis worker rejestruje się przez HTTPS lub localhost, nie przez `file://`.
- Na GitHub Pages należy przesłać **zawartość** paczki do głównego katalogu repozytorium, zachowując `manifest.webmanifest`, `sw.js` i `icons/` obok `index.html`.
- Aktualizacje danych/HTML wymagają ponownego wdrożenia; po otwarciu online nawigacja pobiera świeże `index.html`, a bez internetu korzysta z cache.
