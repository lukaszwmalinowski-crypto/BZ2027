# v121 – ludność powiatów i wybór wszystkich przekrojów bezrobocia do prezentacji

- Naprawiono błąd `ReferenceError: firstYear/lastYear is not defined` przy renderowaniu wykresu demografii powiatowej; oś lat, podpis i etykieta zmiany odnoszą się do faktycznego zakresu dostępnych danych.
- Gdy nie ma szeregu ludności, wykres pozostaje pusty z wyraźną informacją, bez generowania pozornego slajdu PPTX.
- Do przełączanych wykresów struktury PUP dodano zakładkę **Płeć** (kobiety i mężczyźni), opartą na liczbach ogółem i kobiet w dokumentach urzędowych. W tym widoku filtr grupy osób ustawiany jest na „Wszyscy bezrobotni”, aby udziały były poprawne.
- Dotychczasowy wybór wykresu „Struktura bezrobotnych” zapisuje oddzielnie Wiek, Wykształcenie, Płeć, Staż pracy i Czas pozostawania bez pracy, wraz z jednostką, okresem i formą (liczby / udziały %); w generatorze trafiają jako edytowalne rankingi.
- W historii zmian można wybrać i zapisać osobno historię liczby kobiet lub mężczyzn; przy braku danych nie dodaje się pustego slajdu.
- Pozostawiono dane i eksporty poza opisanymi poprawkami bez zmian. Cache offline zaktualizowano do v121.
