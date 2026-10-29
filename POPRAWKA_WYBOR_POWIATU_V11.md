# Wersja 11 - prawidłowy powiat w eksporcie PDF/PPTX

## Przyczyna błędu
Panel przechowywał niezależny wybór powiatu w module bezrobocia i w profilu powiatu. Eksport odczytywał tylko drugi wybór, a przy braku aktywnego powiatu podstawiał Katowice. W konsekwencji po wskazaniu np. powiatu częstochowskiego w dolnym module wydruk mógł obejmować Katowice.

## Poprawki
- Wybory powiatu w górnym profilu i dolnym module bezrobocia są synchronizowane.
- Okno wyboru zawartości raportu posiada wyraźne pole „Powiat / miasto dla raportu”.
- Generator PDF i PPTX korzysta z tego samego aktualnego powiatu.
- Nie następuje już ciche podstawienie Katowic, gdy wybrany jest widok wojewódzki; przed eksportem trzeba wskazać powiat.
- Bez zmian pozostają regionalne wykresy BAEL, REGON, bezrobocia wojewódzkiego i dotychczasowa checklista.

## Test ręczny
1. W sekcji „Zmiany bezrobocia w powiatach” wybierz „częstochowski”.
2. W głównym profilu powinien automatycznie pojawić się powiat częstochowski.
3. Otwórz „Generuj PDF”. W polu powiatu ma widnieć „częstochowski”.
4. Zaznacz „Strona tytułowa” i „Profil powiatu i mapa”, pozostałe odznacz. Wygeneruj PDF.
5. Potwierdź, że na stronie tytułowej i mapie jest powiat częstochowski, nie Katowice.
6. Powtórz eksport do PPTX.
7. Wybierz „Województwo śląskie” w głównym selektorze: okno eksportu ma wymagać wskazania powiatu, a nie samoczynnie wybrać Katowice.

## Ograniczenia
Uzupełnienie pełnych szeregów bezrobocia powiatowego pozostaje osobnym zadaniem: ta poprawka dotyczy wyboru jednostki do raportu.
