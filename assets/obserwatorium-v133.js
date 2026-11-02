/* Obserwatorium 133: jawne okresy źródeł, kontrola eksportu i stan danych.
   Bez modyfikowania bazy, wykresów, wyborów i generatorów. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const asArray=v=>Array.isArray(v)?v:[];
 const numeric=v=>typeof v==='number'&&Number.isFinite(v);
 const fit=s=>String(s??'').trim();
 function detailsData(){
  const d=window.PANEL_DATA||{};
  const m=d.gus?.aktualnoscZweryfikowana||{};
  const p=d.barometr?.podsumowanie||{};
  const pup=d.strukturaPup?.meta||{};
  const period=v=>{const s=fit(v);return /^\d{4}-Q[1-4]$/.test(s)?s.slice(0,4)+' · '+s.slice(-2).replace('Q','kw. '):/^\d{4}-\d\d$/.test(s)?s.slice(5)+'.'+s.slice(0,4):s||'nieustalony'};
  const provinceUnempPeriod=period(m.bezrobocie?.najnowszyOkresWykresu||'2026-09');
  const baelPeriod=period(m.baelSlaskie?.najnowszyOkresWykresu||'2025-Q4');
  const regonPeriod=period(m.regonSlaskie?.najnowszyOkresWykresu||'2026-08');
  const baelNewer=period(m.baelSlaskie?.najnowszaZnanaPublikacja||'2026-Q2');
  const regonNewer=period(m.regonSlaskie?.najnowszaZnanaPublikacja||'2026-09');
  return {
   barometr:{overview:'Barometr 2027 · stopa powiatów 09.2026 · BAEL '+baelPeriod+' · REGON '+regonPeriod,entries:[
    ['Zakres','Barometr Zawodów 2027 dla 36 powiatów i miast na prawach powiatu. Każda jednostka ma ocenę 168 grup zawodów.'],
    ['Okres główny','Prognoza na 2027 rok z porównaniem do edycji 2026.'],
    ['Stopa bezrobocia powiatów','Stan na 30.09.2026 dla 36 jednostek. Regionalna stopa i liczba osób są również za 09.2026.'],
    ['Demografia, BAEL, REGON','Demografia historyczna do 2025, BAEL do '+baelPeriod+', REGON do '+regonPeriod+'; dokładny zakres w zakładce Dane GUS.'],
    ['Co aktualizować','Przy nowej edycji trzeba odświeżyć: mapę, profil powiatu, analizę zawodów, rankingi, komentarze i liczniki.'],
    ['Interpretacja','Ocena grup zawodowych nie oznacza liczby ofert pracy ani liczby wolnych miejsc.']]},
   unemployment:{overview:'Powiaty i województwo: 09.2026 · WUP: I-IX 2026 · Barometr: 2027',entries:[
    ['Stopa powiatowa na mapie','Główna mapa i podpowiedzi po najechaniu: stan na 30.09.2026 dla wszystkich 36 jednostek. Zachowano sierpień 2026 do porównania.'],
    ['Stopa wojewódzka','Wskaźnik wojewódzki: 4,8% · stan na 30.09.2026. Nie należy traktować go jako stopy każdego powiatu.'],
    ['Liczba bezrobotnych w województwie','Dane regionalne WUP: ostatni stan na 30.09.2026, z historią miesięczną 2020-2026.'],
    ['Struktura bezrobocia PUP','Pełne tablice struktury: '+(pup.liczbaPowiatow||36)+' jednostek · lata 2021-2026; ostatni import WUP z dnia '+fit(pup.pobrano||'2026-10-29')+'.'],
    ['Co aktualizować','Powiatowe stopy są już uzupełnione do 09.2026; przy kolejnych aktualizacjach pobierz komplet 36 stawek z tej samej daty. Uzupełnij także BAEL, REGON i pozostałe serie kontekstowe.'],
    ['Porównywalność','Od czerwca 2025 r. obowiązują zmienione zasady rejestracji bezrobotnych.']]},
   gus:{overview:'Demografia 2014-2025 · BAEL do '+baelPeriod+' · REGON do '+regonPeriod,entries:[
    ['Demografia','Wbudowane szeregi historyczne ludności: 16 z 36 jednostek · zakres zależnie od źródła 2014-2025 lub 2016-2025. Nowszy stan 30.06.2026 jest do importu.'],
    ['BAEL',`W aplikacji zapisano dane wojewódzkie do ${baelPeriod}. Nowsza znana publikacja: ${baelNewer} - wymaga przepisania wartości.`],
    ['REGON',`W aplikacji zapisano szereg regionalny do ${regonPeriod}. Nowsza znana publikacja: ${regonNewer} - wymaga importu.`],
    ['Kontekst gospodarczy','Osobny blok kontekstowy GUS: lipiec 2026 - dane regionalne, nie powiatowe.'],
    ['Co aktualizować','Najszybciej widać tu braki w BAEL, REGON oraz w pełnym pokryciu demografii dla wszystkich 36 jednostek.']]}
  }
 }
 function insertStrips(){
  const configs=detailsData();
  for(const [area,views] of [['barometr',['map']],['unemployment',['unemployment']],['gus',['gus']]]){
   for(const view of views){
    const pane=$('compact-'+view);if(!pane||pane.querySelector(':scope > .v133DataStrip'))continue;
    const model=configs[area],d=document.createElement('details');d.className='v133DataStrip';d.dataset.v133Area=area;
    const sum=document.createElement('summary');sum.innerHTML='<span class="v133Dot" aria-hidden="true"></span><strong>Zakres i aktualność danych</strong><span class="v133Overview"></span><span class="v133Chevron" aria-hidden="true">⌄</span>';
    sum.querySelector('.v133Overview').textContent=model.overview;
    const inner=document.createElement('div');inner.className='v133Details';
    model.entries.forEach(([head,desc])=>{const entry=document.createElement('div');entry.className='v133Entry';const strong=document.createElement('strong');strong.textContent=head;const text=document.createElement('span');text.textContent=desc;entry.append(strong,text);inner.append(entry)});
    const link=document.createElement('button');link.type='button';link.className='v133SourceJump';link.textContent='Źródła i metodologia';link.addEventListener('click',()=>{
     const original=document.querySelector('.compactNavButton[data-view="sources"]');
     if(original)original.click();
     const source=$('sourceRegistry');if(source)source.open=true;
     $('atlasSources')?.scrollIntoView({block:'start',behavior:'smooth'});
    });inner.append(link);d.append(sum,inner);
    pane.insertBefore(d,pane.firstChild);
   }
  }
 }
 function seriesValid(data){
  if(!data||typeof data!=='object')return false;
  if(data.kind==='bars')return asArray(data.rankings).some(r=>numeric(Number(r.value)));
  if(data.kind==='series'||data.kind==='line')return asArray(data.series).some(s=>asArray(s.values).some(numeric));
  // Fallback for other chart producers: count explicitly supplied numeric rows.
  return asArray(data.rows).some(r=>numeric(Number(r.value)))||asArray(data.points).some(p=>numeric(p?.value));
 }
 function evidence(item){
  const st=item.structured||{};
  const numericChart=seriesValid(st.chartData)||seriesValid(item.chartData);
  const tabular=asArray(st.rankings).some(r=>numeric(Number(r.value)))||
   asArray(st.metrics).some(r=>fit(r.value)&&fit(r.value)!=='-')||
   asArray(st.occupationList?.rows).length>0||asArray(st.signals).length>0;
  const map=Boolean(st.map)||Boolean(item.svg&&item.svg.includes('<svg'));
  const image=Boolean(item.png&&item.png.startsWith('data:image/'));
  const text=fit(item.text).replace(/(?:Do prezentacji|Dodaj|Wybrane ✓)/gi,' ').trim();
  return {numericChart,tabular,map,image,text: text.length>35};
 }
 function checkBasket(){
  const selected=asArray(window.OBSERWATORIUM_PRESENTATION?.items).filter(x=>x&&x.included!==false);
  const missing=[],weak=[],seen=new Set();let dup=0;
  for(const item of selected){
   const key=item.selectionKey||[item.title,item.unit,item.period].join('|');
   if(seen.has(key)){dup++;continue}seen.add(key);
   const e=evidence(item);const ok=e.numericChart||e.tabular||e.map||e.image;
   if(!ok&&!e.text){missing.push(`${fit(item.title)||'Bez tytułu'} · ${fit(item.unit)||'brak jednostki'}`);continue}
   const looksChart=/wykres|histori|trend|demograf|porówn|mapa|struktura/i.test([item.title,item.elementRef,item.kind].join(' '));
   if(looksChart&&!ok)weak.push(`${fit(item.title)||'Analiza'}: zapisano tylko tekst, bez struktury wykresu`);
  }
  const valid=selected.length-missing.length;
  return {total:selected.length,valid,missing,weak,dup};
 }
 function renderAudit(){
  const dialog=$('v111Basket');if(!dialog)return;
  let ui=$('v133BasketAudit');if(!ui){
   ui=document.createElement('section');ui.id='v133BasketAudit';ui.className='v133BasketAudit';ui.setAttribute('aria-live','polite');
   const list=$('v111BasketList');list?.insertAdjacentElement('afterend',ui);
  }
  const result=checkBasket();ui.replaceChildren();
  ui.dataset.status=(result.missing.length||result.weak.length||result.dup)?'warning':'ok';
  const title=document.createElement('strong');title.textContent=result.total?`Kontrola eksportu: ${result.valid} z ${result.total} analiz z zawartością`:'Kontrola eksportu: nie wybrano analiz';ui.append(title);
  const issues=[...result.missing.map(s=>'Brak zawartości: '+s),...result.weak,...(result.dup?[`Zduplikowane wybory: ${result.dup}`]:[])];
  const p=document.createElement('p');p.textContent=issues.length?`${issues.length} uwag przed eksportem. Możesz poprawić wybory lub świadomie kontynuować.`:'Nie wykryto pustych lub powtórzonych wyborów. Sprawdź daty i zakresy na wykresach.';ui.append(p);
  if(issues.length){const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Pokaż uwagi';const ul=document.createElement('ul');issues.forEach(x=>{const li=document.createElement('li');li.textContent=x;ul.append(li)});details.append(summary,ul);ui.append(details)}
  for(const id of ['v111Generate','v128GenerateDocx']){const b=$(id);if(b){b.disabled=!result.total;b.setAttribute('aria-describedby','v133BasketAudit')}}
 }
 function attachAudit(){const dlg=$('v111Basket');if(!dlg||dlg.dataset.v133Audit)return false;dlg.dataset.v133Audit='1';
  // Refresh after each selection, removal or ordering operation in the dialog.
  dlg.addEventListener('change',()=>setTimeout(renderAudit,0));
  dlg.addEventListener('click',e=>{
   const button=e.target.closest('button');
   if(button?.id==='v111Generate'||button?.id==='v128GenerateDocx'){
    const r=checkBasket();
    if(!r.total||!r.valid){e.preventDefault();e.stopImmediatePropagation();window.alert('Nie można wygenerować materiału: brak wybranych analiz z zawartością.');return}
    if(r.missing.length||r.weak.length){
     const ok=window.confirm(`Przed eksportem wykryto ${r.missing.length} pustych i ${r.weak.length} niepełnych analiz.\n\nMożesz wrócić i zaznaczyć ponownie brakujące wykresy. Kontynuować mimo uwag?`);
     if(!ok){e.preventDefault();e.stopImmediatePropagation();return}
    }
   }
   setTimeout(renderAudit,30);
  },true);
  const observer=new MutationObserver(()=>renderAudit());
  const list=$('v111BasketList');if(list)observer.observe(list,{childList:true,subtree:false});
  renderAudit();return true;
 }
 function init(){
  insertStrips();attachAudit();
  // Existing dashboard may initialize asynchronously from the embedded offline bundle.
  if(!window.OBSERWATORIUM_PRESENTATION||!$('v111Basket'))setTimeout(init,650);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.OBS_V133={checkBasket,insertStrips};
})();
