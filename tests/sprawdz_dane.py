"""Kontrola integralności bazy i niezależnych wartości referencyjnych PUP."""
import json,pathlib,re
ROOT=pathlib.Path(__file__).resolve().parents[1]
d=json.loads((ROOT/'data/dane.json').read_text());p=d['strukturaPup'];rows=p['obserwacje'];keys=set()
for r in rows:
 key=r['powiat'],r['okres'];assert key not in keys;keys.add(key)
 assert r['powiat'] in d['barometr']['powiaty']
 assert '2020-01'<=r['okres']<='2026-09'
 assert 0<=r['kobiety']<=r['ogolem']
 for g,n in [('wiek',6),('wyksztalcenie',5),('staz',7),('czas',6)]:
  a,b=r[g],r[g+'Kobiety'];assert len(a)==len(b)==n
  assert all(type(v) is int and v>=0 for v in a+b)
  assert sum(a)==r['ogolem'] and sum(b)==r['kobiety']
  assert all(w<=t for w,t in zip(b,a))
lookup={(r['powiat'],r['okres']):r for r in rows}
# Values checked against the original city/county PDFs, not calculated from the importer.
a=lookup['Tychy','2026-09'];assert (a['ogolem'],a['kobiety'])==(1596,784);assert a['wiek']==[183,297,438,435,149,94];assert a['czas']==[232,302,290,349,297,126]
a=lookup['Tychy','2020-12'];assert (a['ogolem'],a['kobiety'])==(1903,1019);assert a['wiekKobiety'][-1]==0
b=lookup['bieruńsko-lędziński','2026-09'];assert (b['ogolem'],b['kobiety'])==(581,298);assert b['wiek']==[82,114,153,127,77,28]
m={(r['powiat'],r['okres']):r for r in p['miesieczne']};assert len(m)==len(p['miesieczne'])
assert m['Ruda Śląska','2025-12']['liczba_osob']==1714
assert m['Częstochowa','2025-12']['liczba_osob']==4342
assert m['częstochowski','2025-12']['liczba_osob']==2854
for key,r in m.items():assert 0<=r['kobiety']<=r['liczba_osob']
for key,r in lookup.items():assert m[key]['liczba_osob']==r['ogolem'] and m[key]['kobiety']==r['kobiety']
# file:// fallback and GitHub Pages must contain exactly the same observations.
s=(ROOT/'index.html').read_text();snap=re.search(r'<script[^>]*id="panelInitialSnapshot"[^>]*>(.*?)</script>',s,re.S);assert json.loads(snap[1])==d
assert len(d['barometr']['powiaty'])==36 and len(p['urzedy'])==31
assert len(keys)==1123 and len(m)==1373
print(f'OK: {len(keys)} struktur, {len(m)} obserwacji liczby osób; sumy, zakresy, jednostki i migawka zgodne.')
