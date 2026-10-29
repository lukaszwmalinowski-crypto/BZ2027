# Niebieska firmówka WUP Katowice

Oryginalny obraz 13.jpg jest osadzony w narzędziu. Kolor jest stały, bez dodatkowego wyboru.

- PowerPoint: tło w układzie każdego slajdu, również okładki. Treść przesunięta i dopasowana do miejsca między nagłówkiem a stopką. Slajdy 16:9.
- PDF: osobne okno raportu z przyciskiem „Drukuj lub zapisz jako PDF”, izolowane od stylów panelu. A4 poziomo. Nagłówek i stopka powtarzają się na stronach, logo zachowuje proporcje.
- Drukuj/PDF w strukturze PUP: ten sam nagłówek i stopka, A4 poziomo.
- W ustawieniach wydruku pozostaw skalę 100%, wyłącz dodatkowe nagłówki i stopki przeglądarki.
- Dane i układ interfejsu z v35 zachowane.

Walidacja: wygenerowano kontrolny PPTX z pięcioma podstawowymi slajdami, sprawdzono osadzenie oryginalnej grafiki i położenie treści. Kontrolny raport PDF z Tychów wyrenderowano w WeasyPrint i sprawdzono strony. Końcowy wygląd może zależeć od silnika wydruku i wersji PowerPoint. Pobieranie PPTX w środowisku przeglądarki testowej nie zostało potwierdzone.

Wdrożenie: podmień index.html; istniejący plik assets/pptxgen.bundle.js nadal musi być dostępny do eksportu PPTX.
