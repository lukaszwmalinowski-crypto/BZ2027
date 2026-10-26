# Prognoza rynku pracy 2027 – panel analityczny WUP Katowice

Statyczna aplikacja przygotowana do publikacji przez GitHub Pages.

## Najważniejsze funkcje
- profil wybranego powiatu i mapa województwa,
- analiza zawodu na mapie,
- trendy 2024–2027 i benchmark wojewódzki,
- automatyczne sygnały analityczne,
- porównanie do 3 powiatów,
- profil zawodu w 36 jednostkach,
- eksport PDF, PPTX i XLSX,
- tryb prezentacyjny,
- responsywny widok telefon/tablet/desktop,
- stan powiatu i zawodu zapisywany w adresie URL.

## Struktura danych
Katalog `data/` zawiera pliki JSON będące przygotowanym punktem aktualizacji danych:
- `powiaty.json` – wartości 2026–2027 i komentarze,
- `trendy-historyczne.json` – lata 2024–2025,
- `bezrobocie.json` – stopa bezrobocia,
- `zawody.json` – macierz statusów zawodów,
- `mapa.json` – geometria SVG,
- `meta.json` – metadane panelu.

Aktualny `index.html` zachowuje zgodny fallback danych, dzięki czemu aplikacja działa także po otwarciu lokalnym. Przy kolejnej większej aktualizacji danych można przebudować fallback na podstawie tych plików JSON.

## Publikacja GitHub Pages
1. Wgraj całą zawartość katalogu do repozytorium.
2. Wejdź w **Settings → Pages**.
3. Wybierz **Deploy from a branch**.
4. Branch: `main`, folder: `/ (root)`.
5. Zapisz ustawienia.

Nie usuwaj katalogu `assets/` – zawiera lokalną bibliotekę generatora PowerPoint.


## v3.1
Poprawiono moduł porównania powiatów: trzy jawne pola wyboru, automatyczne odświeżanie po zmianie oraz przycisk Wyczyść.


## v3.3
Lista powiatów w porównywarce jest wbudowana bezpośrednio w HTML i inicjalizowana niezależnie od mapy.




## Nowość w v3.5

- moduł **Historia struktury ocen 2023–2027** dla wszystkich 36 jednostek,
- porównanie udziałów procentowych: deficyt, równowaga, nadwyżka, bez oceny,
- dane 2023 z raportu wojewódzkiego Barometru Zawodów; 2024–2027 z danych panelu.


## v3.6 - historia 2022

Oś historii została rozszerzona do 2022–2027. Dla 2022 pokazujemy zweryfikowany kontekst regionalny z raportu Barometru Zawodów. Brakujące pełne udziały powiatowe nie są imputowane.


## v3.7 - historia 2020-2027
- oś historyczna rozszerzona do 2020 r.,
- 2020-2022 prezentowane jako zweryfikowany kontekst archiwalny bez imputowania brakujących udziałów powiatowych,
- 2021: 33 grupy deficytowe w prognozie wojewódzkiej,
- pełny wykres udziałów powiatowych pozostaje od 2023 r.


## v3.8 - archiwum 10 lat

Historia została przebudowana: zamiast wspólnego wykresu jest domyślnie zwinięty moduł z osobnymi statystykami dla lat 2017-2026. Dane wojewódzkie pochodzą z raportu Barometru Zawodów 2026.


## v3.9 - zawody w archiwum
- karty lat 2017-2026 są rozwijane,
- dla 2021-2026 osadzono zweryfikowane wojewódzkie listy zawodów deficytowych,
- pełne listy równowagi/nadwyżki otwierają oficjalny widok Barometru,
- dla 2017-2020 dostępny jest link do oficjalnej archiwalnej edycji do czasu pełnej weryfikacji list.


## v3.10
- naprawiony zagnieżdżony HTML archiwum,
- kompaktowy akordeon roczników,
- wyszukiwanie zawodu w osadzonych listach deficytów 2021–2026,
- filtrowanie listy zawodów w obrębie rozwiniętego roku.


## v3.11
- przebudowany moduł archiwum do poprawnego akordeonu,
- naprawione rozwijanie roczników,
- kompaktowy układ kart,
- wyszukiwarka zawodu w archiwum.


## v3.12
- naprawiono rozwijanie archiwum rocznego; działa niezależnie od inicjalizacji pozostałych modułów,
- usunięto podwójny chevron przy przycisku „Pokaż zawody”.


## v3.13
- naprawiono błędne cudzysłowy w handlerach akordeonu archiwum,
- przyciski `Pokaż zawody` poprawnie rozwijają panel roku.


## v3.14
- ujednolicone chevrony w elementach rozwijanych i polach wyboru,
- archiwum bez dopisku „dla chętnych”,
- czerwona ramka aktywnej sekcji „Analiza zawodu”, resetowana po wyczyszczeniu wyboru.


## v3.15
- usunięto globalną wyszukiwarkę „Sprawdź zawód w archiwum”.


## v3.16
- Profil zawodu otrzymuje czerwony stan aktywny po wyborze zawodu.
- Archiwum ma osobną bursztynowo-złotą ramkę i akcent nagłówka.


## v3.17
- Widok startowy po odświeżeniu: **Województwo śląskie - średnie** zamiast Katowic.
- Mapa startuje bez zaznaczonego powiatu.
- Profil i trend pokazują średnie wojewódzkie; wybór powiatu przełącza panel na profil lokalny.


## v3.18
- naprawiono inicjalizację JavaScript po module archiwum,
- widok startowy poprawnie pokazuje Województwo śląskie i średnie,
- mapa renderuje się od razu po wejściu na stronę.


## v3.19
- widok wojewódzki jest także wpisany jako bezpieczny stan bazowy w HTML,
- średnie 2027 są widoczne od razu po odświeżeniu,
- inicjalizacja widoku wojewódzkiego jest ponawiana po zbudowaniu mapy.


## v3.20
- ujednolicono prezentację stopy bezrobocia: wszędzie widoczna jest data **stan na 31.08.2026 r.**


## v3.21

- usunięto eksport PNG mapy i wykresu; pozostają eksporty PDF, PPTX i XLSX.


## v3.23
- usunięto techniczny opis/instrukcję spod mapy.
