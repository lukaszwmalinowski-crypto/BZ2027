# v50 – kontrola aktualności danych GUS

Ocena z 29.10.2026.

- Bezrobocie wojewódzkie: dane wrzesień 2026 już obecne i potwierdzone w WUP / GUS: 4,8% i 83 604 osób.
- BAEL: dane Śląskie II kwartał 2026 zostały już opublikowane (29.09.2026), ale nie zostały wprowadzone do wykresów — nie dopisujemy liczb niezweryfikowanych w tabelach.
- REGON: dostępne są nowsze tablice za wrzesień 2026 (12.10.2026); regionalne wartości wymagają importu.
- Dodany panel statusów i oficjalnych źródeł w zakładce Dane GUS.
- Działający wcześniej skrypt aktualizacji BDL znajduje się w `aktualizuj_bdl.py`; potrzebuje dostępu do API, nie jest automatycznym aktualizatorem REGON/BAEL.

Nie należy mylić dat publikacji nowych tabel z faktyczną datą aktualizacji wykresów. Danych o nieznanej wartości nie interpolowano.
