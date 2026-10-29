# v57 - naprawa eksportu PPTX

- Poprawiono wywołanie API PptxGenJS `addSlide({masterName:'MASTER'})`, wcześniej przekazywano zwykły napis.
- Dodano przechwytywanie wyjątków w przycisku generowania prezentacji, z komunikatem o rzeczywistej przyczynie niepowodzenia.
- Zsynchronizowano `js/app.js` z kopią osadzoną w `index.html` używaną offline.
- Zachowano ikonę PWA, dane, wygląd i pozostałe eksporty.
