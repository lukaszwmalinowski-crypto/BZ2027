# Studio danych 2027 — v16: korekta przestrzeni interfejsu

**Zakres:** warstwa CSS, bez zmiany danych, obsługi mapy oraz mechanizmu eksportu PDF/PPTX.

- Naprawiono zerowy lewy padding pierwszego wskaźnika (pozostałość po wcześniejszym motywie).
- Uporządkowano marginesy wewnętrzne pięciu kart KPI i responsywne podziały 5/3/2 kolumn.
- Zwiększono odległości między przyciskami widoku mapy, odstępy wewnątrz bloków filtrów oraz wokół pól wyboru.
- Poprawiono rytm odstępów nagłówków, mapy, profilu powiatu, benchmarku, trendów, kart GUS, rankingów i list zawodów.
- Zwiększono wygodę kliknięć w małych elementach sterujących; poprawiono okno wyboru zawartości raportu.
- Oddzielono reguły ekranowe od układu wydruku.
- Przeniesiono odziedziczone późne reguły CSS do sekcji `<head>` w celu poprawienia struktury dokumentu; zachowano ich kolejność.

**Ograniczenie testowe:** test składni i struktury, bez potwierdzonego zrzutu z aktualnego środowiska przeglądarki. Zalecany wizualny QA po publikacji, zwłaszcza na 390, 768, 1024 i 1440 px.
