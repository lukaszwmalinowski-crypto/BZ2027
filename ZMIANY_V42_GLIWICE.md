# v42 – poprawa danych Gliwic i automatyczny wybór wskaźnika

Wybór jednostki, dla której historia stopy bezrobocia jest niewystarczająca (mniej niż dwa punkty w wybranym roku), automatycznie przełącza wykres na **liczbę zarejestrowanych bezrobotnych**, o ile dostępne są co najmniej dwa okresy. Dotyczy m.in. miasta Gliwice. Użytkownik nadal może ręcznie wybrać stopę bezrobocia; brakujące wartości nie są interpolowane. Dane WUP z v41 pozostają bez zmian. Zaktualizowano zarówno zewnętrzny plik JS, jak i jego kopię wbudowaną w index.html do pracy offline.
