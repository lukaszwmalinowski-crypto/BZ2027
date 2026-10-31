# Audyt responsywności Obserwatorium – 30.10.2026

Badana podstawa: v102. Wydanie v103 zawiera precyzyjną poprawkę CSS na telefonach oraz poprawkę nazwy dostępności przycisku instalacji.

## Potwierdzony błąd

Na ekranach 375, 390 i 430 CSS px niewidoczna część nagłówka miała nadmierną wysokość. Reguła `body.compactUI #siteHeader .headerMeta {flex:1 1 320px!important}` sprawiała, że krótki status zajmował 320 px. Cały nagłówek: 476 px.

## Naprawa

Dla viewportów do 767 px element `.headerMeta` otrzymuje `flex:0 0 auto!important`, zaś `.headerRight` `justify-content:flex-start!important`. Nagłówek zajmuje ok. 169 px, a filtr przesuwa się z y=498 do y=191 (różnica 307 px). Nie ingerowano w dane ani funkcje analityczne.

## Zweryfikowane rozmiary (emulacja Chromium)

375×667, 390×844, 430×932, 768×1024, 834×1194, 1194×834, 1032×1376, 1366×768, 1920×1080. Na wszystkich testowanych rozmiarach szerokość dokumentu nie przekroczyła szerokości viewportu.

## Pozostałe kwestie

- W iPad mini 768 px siedem przycisków nawigacji ma małe odstępy i typografię.
- Na telefonach 10-pikselowe etykiety dolnej nawigacji wymagają powiększenia; wartości statusu danych są obcinane.
- W widoku iPad Pro 11 pionowo mapa i szczegółowy panel są ciasne, choć nie wychodzą poza ekran.
- Plik `index.html` ma ok. 16 MB, a bazowy JSON ok. 15 MB; warto ograniczyć masę aplikacji i ilość powielonego CSS.
- Nie badano natywnego Safari iOS ani iPadOS, VoiceOver ani wydruków PDF/PPTX na rzeczywistych urządzeniach.

## Wykonane kontrole interakcji

W emulacji 390 px: wybór Tychów, otwarcie Bezrobocia, GUS, Więcej oraz Eksportuj. Brak błędów JavaScript i poziomego przewijania podczas tych akcji. Dodano `aria-label` dla ikonowego przycisku instalacji.
