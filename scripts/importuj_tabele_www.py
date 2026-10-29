import json,pathlib,re,html,unicodedata,collections
ROOT=pathlib.Path('slaskie-pup-archiwum')
def plain(s):return ' '.join(html.unescape(re.sub('<[^>]+>',' ',s)).split())
def integer(s):
 s=re.sub(r'\s','',s)
 return int(s) if re.fullmatch(r'\d+',s) else None
def norm(s):return ''.join(c for c in unicodedata.normalize('NFKD',s.lower()) if not unicodedata.combining(c)).replace('ł','l')
months=['styczen','luty','marzec','kwiecien','maj','czerwiec','lipiec','sierpien','wrzesien','pazdziernik','listopad','grudzien'];records=[]
for office in ['rudaslaska','czestochowa','myslowice']:
 for f in (ROOT/office).glob('*.html'):
  s=f.read_text();title=plain(re.search(r'<title>(.*?)</title>',s,re.S)[1]);url=re.search(r'<meta[^>]*property="og:url"[^>]*content="([^"]+)"',s)
  if not url:continue
  url=html.unescape(url[1])
  for m in re.finditer(r'<table\b.*?</table>',s,re.I|re.S):
   txt=plain(m[0]);rows=[[plain(c) for c in re.findall(r'<t[dh]\b[^>]*>(.*?)</t[dh]>',r,re.S|re.I)] for r in re.findall(r'<tr\b[^>]*>(.*?)</tr>',m[0],re.S|re.I)]
   found=[]
   if office=='rudaslaska' and 'Bezrobotni zarejestrowani' in txt:
    headers=re.findall(r'<h[1-6]\b[^>]*>(.*?)</h[1-6]>',s[:m.start()],re.S|re.I);years=[re.search(r'Rok\s*(20\d{2})',plain(h),re.I) for h in headers];years=[int(y[1]) for y in years if y]
    if not years:continue
    y=years[-1]
    for row in rows:
     if len(row)<3:continue
     name=norm(row[0]);month=next((i for i,v in enumerate(months,1) if name==v),None)
     if month:found.append(('Ruda Śląska',f'{y}-{month:02d}',integer(row[1]),integer(row[2])))
   elif office=='czestochowa' and 'Liczba bezrobotnych według stanu' in txt:
    dates=re.findall(r'na dzień\s*\d{1,2}[.](\d{1,2})[.](20\d{2})',txt)
    if not dates:continue
    mm,y=map(int,dates[0]);p=f'{y}-{mm:02d}'
    for row in rows:
     if len(row)<3:continue
     label=norm(row[0])
     county='Częstochowa' if re.fullmatch(r'm[.]?\s*czestochowa',label) else 'częstochowski' if label=='powiat czestochowski' else None
     if county:found.append((county,p,integer(row[1]),integer(row[2])))
   elif office=='myslowice' and 'Bezrobotni zarejestrowani' in txt:
    t=norm(title);date=None
    for mm,n in enumerate(months,1):
     dm=re.search(r'\b'+n+r'\b\s*(20\d{2})',t)
     if dm:date=f'{dm[1]}-{mm:02d}';break
    if not date:continue
    for row in rows:
     if len(row)>=3 and norm(row[0])=='bezrobotni zarejestrowani na koniec miesiaca sprawozdawczego':found.append(('Mysłowice',date,integer(row[1]),integer(row[2])))
   for county,p,total,women in found:
    if p<'2020-01' or p>'2026-09' or total is None or women is None or not 0<=women<=total:continue
    records.append({'powiat':county,'okres':p,'liczba_osob':total,'kobiety':women,'zrodlo':url,'dokument':title,'plikArchiwum':'','formularz':'Tabela WWW PUP'})
by=collections.defaultdict(list)
for r in records:by[r['powiat'],r['okres']].append(r)
accepted=[];bad=[]
for key,rs in by.items():
 if len({(r['liczba_osob'],r['kobiety']) for r in rs})>1:bad.append(key)
 else:accepted.append(rs[0])
pathlib.Path('tmp/pup-extract/html_miesieczne.json').write_text(json.dumps(accepted,ensure_ascii=False,indent=2));print('HTML',len(accepted),collections.Counter(r['powiat'] for r in accepted),'conflicts',bad)
