import os,json,glob,re,unicodedata,collections
from artifact_tool import Blob,SpreadsheetFile
root='/mnt/data/fix_v41'; path=root+'/data/dane.json'
data=json.load(open(path)); db=data['strukturaPup']
files=glob.glob('/mnt/data/Struktura*.xlsx'); files.sort()
lookup={'Piekary':'Piekary Śląskie','Ruda Śl.':'Ruda Śląska','Siemianowice Śl.':'Siemianowice Śląskie'}
county_names=set(data['barometr']['powiaty'])
def county(s):
 s=lookup.get(s,s)
 if s in county_names:return s
 for n in county_names:
  if n.casefold()==s.casefold():return n
 return None
groups={'czas':list(range(2,8)),'wiek':list(range(8,14)),'wyksztalcenie':list(range(14,19)),'staz':list(range(19,26))}
months={'styczeń':1,'luty':2,'marzec':3,'kwiecień':4,'maj':5,'czerwiec':6,'lipiec':7,'sierpień':8,'wrzesień':9,'grudzień':12}
records=[];issues=[];fileinfo=[]
for f in files:
 fn=os.path.basename(f).lower();year=int(re.search(r'20\d\d',fn).group());mon=next((num for name,num in months.items() if name in fn),None)
 if not mon:issues.append(('unknown_month',fn));continue
 period=f'{year}-{mon:02d}'; wb=SpreadsheetFile.import_xlsx(Blob.load(f))
 sheets={n:wb.worksheets.get_item(f'Tablica {n}').get_range('A5:Q40').values for n in range(1,26)}
 headers={n:wb.worksheets.get_item(f'Tablica {n}').get_range('A1:Q4').values for n in range(1,26)}
 valid=0
 for i in range(36):
  label=sheets[1][i][0];n=county(label)
  if not n:issues.append((period,'unknown_county',label));continue
  def num(v):
   if isinstance(v,(int,float)) and v>=0:return int(v)
   if isinstance(v,str) and v.strip().isdigit():return int(v.strip())
   return None
  total=num(sheets[1][i][2]);women=num(sheets[1][i][3]);rec={'powiat':n,'okres':period,'ogolem':total,'kobiety':women,'zrodlo':'Arkusz WUP Katowice: '+os.path.basename(f),'dokument':os.path.basename(f),'formularz':'tablice_wup_1_25','podstawaTerytorialna':'wiersz powiatu/miasta w arkuszu WUP'}
  correct=True
  for g,ids in groups.items():
   vals=[];w=[]
   for k in ids:
    row=sheets[k][i];other=county(row[0])
    if other!=n:correct=False;issues.append((period,n,g,k,'name mismatch',row[0]));break
    vals.append(num(row[2]));w.append(num(row[3]))
   rec[g]=vals;rec[g+'Kobiety']=w
   if None in vals or None in w or sum(vals)!=total or sum(w)!=women:correct=False;issues.append((period,n,g,'sum',sum(x or 0 for x in vals),total,sum(x or 0 for x in w),women))
  if correct:
   rec['tabeleWup']=[{'nr':k,'tytul':str(headers[k][0][1] or ''),'wartosci':[{'kolumna':c+1,'etykieta':str(headers[k][3][c] or headers[k][2][c] or headers[k][1][c] or ('Wskaźnik '+str(c+1))),'wartosc':num(sheets[k][i][c])} for c in range(2,len(sheets[k][i])) if num(sheets[k][i][c]) is not None]} for k in range(1,26)]
   records.append(rec);valid+=1
 fileinfo.append((period,valid));print(period,valid,'/',36,flush=True)
existing={(r['powiat'],r['okres']):r for r in db['obserwacje']}
for r in records:existing[(r['powiat'],r['okres'])]=r
db['obserwacje']=sorted(existing.values(),key=lambda r:(r['powiat'],r['okres']))
db['meta']['liczbaObserwacji']=len(db['obserwacje']);db['meta']['liczbaPowiatow']=len(set(r['powiat'] for r in db['obserwacje']));db['meta']['uzupelnienieWUP']='Pełne tabele 1–25 z 14 arkuszy WUP: 2021–2026; walidacja sum wszystkich grup i kobiet'; db['meta']['liczbaPelnychObserwacjiWUP']=len(records)
# align monthly records to validated source including county corrections
monthly={(r['powiat'],r['okres']):r for r in db['miesieczne']}
for r in records:
 key=r['powiat'],r['okres'];monthly[key]={'powiat':r['powiat'],'okres':r['okres'],'liczba_osob':r['ogolem'],'kobiety':r['kobiety'],'zrodlo':r['zrodlo'],'dokument':r['dokument']}
db['miesieczne']=sorted(monthly.values(),key=lambda r:(r['powiat'],r['okres']))
# ensure main powiat data also corrected
pup=data['powiatBezrobocie']['pup'];print('pup shape',type(pup).__name__,list(pup)[:8] if isinstance(pup,dict) else '',flush=True)
with open(path,'w') as f:json.dump(data,f,ensure_ascii=False,separators=(',',':'))
with open(root+'/data/wup_import_diagnostics.json','w') as f:json.dump({'okresy':fileinfo,'uwagi':issues[:300],'liczbaUwag':len(issues)},f,ensure_ascii=False,indent=2)
print('VALID',len(records),'ISSUES',len(issues)); print('GLIWICE',[(r['okres'],r['ogolem']) for r in records if r['powiat']=='Gliwice'])
