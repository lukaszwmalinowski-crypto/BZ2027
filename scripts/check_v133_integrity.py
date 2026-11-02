#!/usr/bin/env python3
"""Kontrola integralności danych / zasobów wydania v133. Nie modyfikuje plików."""
from pathlib import Path
import re,json,hashlib,sys
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(encoding='utf-8')

def embedded(id):
    m=re.search(r'<script\b[^>]*\bid="'+re.escape(id)+r'"[^>]*>(.*?)</script>',html,re.S)
    assert m, f'Nie ma osadzonego JSON {id}'
    return json.loads(m.group(1))

data=json.loads((root/'data/dane.json').read_text(encoding='utf-8'))
inline=embedded('panelInitialSnapshot')
assert data==inline, 'Baza wbudowana niezgodna z data/dane.json'
assert data['barometr']['podsumowanie']['counties']==36
assert data['barometr']['podsumowanie']['occupations']==168
assert len(data['strukturaPup']['obserwacje'])>1300
assert len(data['strukturaPup']['miesieczne'])>1300
meta=data['gus']['aktualnoscZweryfikowana']
assert meta['baelSlaskie']['najnowszyOkresWykresu']=='2025-Q4'
assert meta['regonSlaskie']['najnowszyOkresWykresu']=='2026-08'
assert meta['bezrobocie']['najnowszyOkresWykresu']=='2026-09'
assert len(json.loads((root/'data/gus_bdl_demografia.json').read_text())['series'])==16
wup=embedded('wupMonthlyDetailedData')
assert wup['meta']['latest_month']=='2026-09'
assert len(wup['metrics'])==16
bundled=embedded('panelModuleBundle')
for name in ['js/app.js','js/gus.js','js/county.js','js/pup.js','js/layout.js']:
    assert name in bundled, f'Brak modułu awaryjnego {name}'
    assert (root/name).exists(),f'Brak modułu {name}'
assert "obserwatorium-slaskie-v133" in (root/'sw.js').read_text()
assert 'assets/obserwatorium-v133.css' in html and 'assets/obserwatorium-v133.js' in html
refs=set(re.findall(r'(?:src|href)="((?:assets|js|icons|data)/[^"?#]+)',html))
refs.update(re.findall(r"'\./((?:assets|js|icons|data)/[^']+)'",(root/'sw.js').read_text()))
missing=[r for r in sorted(refs) if not (root/r).is_file()]
assert not missing, 'Nieistniejące zasoby: '+repr(missing)
for path in ['assets/obserwatorium-v111.js','assets/obserwatorium-presentations-v118.js','assets/obserwatorium-word-v130.js','data/dane.json']:
    print('Zachowany zasób:',path, hashlib.sha256((root/path).read_bytes()).hexdigest()[:16])
print('OK: integralność źródeł, JSON offline, 36/168, metadane, cache,',len(refs),'zasobów')
