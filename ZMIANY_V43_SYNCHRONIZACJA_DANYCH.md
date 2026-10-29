# v43 - naprawa danych Gliwic i pozostałych powiatów

Błąd: `index.html` zawierał starą kopię `panelInitialSnapshot` (1123 zestawienia struktury), a `data/dane.json` zawierał nową (1389). Uruchomienie offline korzystało ze starej bazy. Ponadto kopia modułu `js/pup.js` w `panelModuleBundle` była nieaktualna.

Naprawa: zapisano identyczną aktualną bazę w `index.html` i `data/dane.json`; zsynchronizowano wbudowane moduły z plikami JS. Zweryfikowano poprawność JSON oraz obecność obserwacji Gliwic, powiatu gliwickiego i Tychów. Test nie obejmował uruchomienia kliknięć w przeglądarce.

Po rozpakowaniu uruchomić `index.html`; przy publikacji na GitHub Pages wgrać całą paczkę, a nie tylko dane.json.
