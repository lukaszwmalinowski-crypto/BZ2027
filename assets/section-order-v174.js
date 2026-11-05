/* v174: coherent order and two data sources in one foreign-labour section.
   Moves EXISTING nodes; never copies or changes underlying data/export handlers. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const heading=(name,sub='')=>{const h=document.createElement('h3');h.className='v174ChapterTitle';h.textContent=name;if(sub){const p=document.createElement('small');p.textContent=sub;h.append(p)}return h};
const subhead=name=>{const h=document.createElement('h3');h.className='v174SectionHeading';h.textContent=name;return h};
function organizeEconomy(){
 const body=document.querySelector('#gusModule .gusBody');
 if(!body||body.dataset.v174Sorted)return;
 body.dataset.v174Sorted='1';
 const pulse=$('regionalPulse'),grid=body.querySelector('.gusGrid');
 if(pulse){body.insertBefore(heading('Gospodarka województwa','Najważniejsze wskaźniki, porównania okresowe i Polska na tle regionu'),pulse)}
 if(grid)body.insertBefore(heading('BAEL i REGON','Aktywność zawodowa, rynek pracy i podmioty gospodarcze'),grid);
}
function organizeDemography(){
 const module=$('demographyModule'),report=$('demographyReportRoot');
 if(!module||!report||module.dataset.v174Sorted)return;
 module.dataset.v174Sorted='1';
 // Region first (four indicators, then population trend, births and deaths,
 // migration), county card after it. The dynamic report keeps all handlers.
 module.insertBefore(report,module.firstChild);
 const intro=module.querySelector('.demographyExistingIntro');
 if(intro){intro.querySelector('h2')?.replaceChildren('Profil demograficzny powiatu');
 const note=intro.querySelector('p');if(note)note.textContent='Dane ludności wybranego powiatu. Historia jest widoczna tylko dla lat potwierdzonych w GUS.';}
}
function organizeUnemployment(){
 const pane=$('compact-unemployment');if(!pane||pane.dataset.v174Sorted)return;
 pane.dataset.v174Sorted='1';
 const region=$('registeredUnemploymentModule'),county=$('countyUnempModule');
 if(region&&county){pane.insertBefore(region,county);pane.insertBefore(heading('Bezrobocie w powiatach','Struktura, historia i porównania lokalne na podstawie rejestrów PUP'),county)}
}
/* v177: zachowujemy te same elementy i ich identyfikatory, przenosząc je do
   spójnej siatki. Nie klonujemy wykresów ani przycisków eksportu. */
function orderForeignModule(){
 const section=$('foreign2025Section'),content=section?.querySelector('.foreign25Content');
 if(!content||content.dataset.v177Mosaic)return;
 const intro=$('foreign2025Overview');
 const monthly=$('foreign2025Monthly')?.closest('article');
 const gender=$('foreign2025Gender')?.closest('article');
 const nationality=$('foreign2025Nationalities')?.closest('article');
 const ranking=$('foreign2025County')?.closest('article');
 const profile=$('foreign2025CountyInfo');
 if(!intro||!monthly||!gender||!nationality||!ranking||!profile)return;
 content.dataset.v177Mosaic='1';
 // Liczba kobiet i mężczyzn należy do karty struktury płci, nie do
 // powielonych KPI. Udział w Polsce jest odrębnym wskaźnikiem.
 const tiles=intro.querySelector('.foreign25Kpis');
 if(tiles&&tiles.children.length===4){
  tiles.children[2].remove();
  tiles.children[1].remove();
  const share=window.FOREIGNERS_2025_DATA?.wojewodztwo_dane?.udzial_w_liczbie_cudzoziemcow_wykonujacych_prace_w_polsce_proc;
  if(Number.isFinite(Number(share))){
   const tile=document.createElement('div');tile.className='foreign25ShareTile';
   const strong=document.createElement('strong');strong.textContent=Number(share).toLocaleString('pl-PL',{maximumFractionDigits:1})+'%';
   const caption=document.createElement('span');caption.textContent='Udział Śląskiego w liczbie cudzoziemców wykonujących pracę w Polsce';
   tile.append(strong,caption);tiles.append(tile);
  }
 }
 intro.querySelector('.foreign25Note')?.remove();
 monthly.querySelector('.foreign25Note')?.remove(); // ta sama zmiana jest w KPI
 const trend=document.createElement('div');trend.className='foreign25Grid v177ForeignTrend';trend.id='foreign2025TrendGroup';trend.append(monthly,gender);
 const structure=document.createElement('div');structure.className='foreign25Grid v177ForeignStructure';structure.id='foreign2025StructureGroup';structure.append(nationality,profile);
 const places=document.createElement('div');places.className='foreign25Grid v177ForeignCounties';places.id='foreign2025CountyGroup';places.append(ranking);
 const note=content.querySelector('.foreign25Meta');
 content.replaceChildren(intro,trend,structure,places);
 if(note){
  const details=document.createElement('details');details.className='v177SourceDetails';
  const summary=document.createElement('summary');summary.textContent='Źródło danych i metodologia GUS';
  details.append(summary,note);content.append(details);
 }
}
function orderUkraine(){
 const root=$('uk2026Section'),wrap=root?.querySelector('.countyUWrap');
 if(!wrap||wrap.dataset.v177Mosaic)return;
 const ids=['uk2026Overview','uk2026ChartPanel','uk2026CountyPanel','uk2026CountyRankPanel','uk2026JobsPanel','uk2026SectorsPanel','uk2026ContractsPanel','uk2026ReasonsPanel'];
 if(!ids.every(id=>$(id)))return;
 wrap.dataset.v177Mosaic='1';
 // Nagłówki starych grup w v174 rozcinały siatkę i powielały tytuły kart.
 wrap.querySelectorAll(':scope > .v174SectionHeading').forEach(el=>el.remove());
 ids.forEach(id=>$(id).style.removeProperty('margin-top'));
 const intro=wrap.querySelector('.countyUIntro');
 if(intro)intro.remove(); // okres i metodologia są już podane w nagłówku i karcie KPI
 // Źródła dostępne, ale nie zajmują miejsca na głównym ekranie.
 const source=$('uk2026ReasonsPanel')?.querySelector('p.countyUFoot');
 if(source){
  const details=document.createElement('details');details.className='v177SourceDetails v177UkraineSources';
  const summary=document.createElement('summary');summary.textContent='Źródła i ograniczenia danych PUP';
  details.append(summary,source);wrap.append(details);
 }
}
function organizeForeigners(){
 const pane=$('compact-foreigners'),a=$('foreign2025Section'),b=$('uk2026Section');
 if(!pane||!a||!b)return false;
 if(pane.dataset.v174Sorted)return true;
 orderForeignModule();orderUkraine();
 pane.dataset.v174Sorted='1';
 const intro=document.createElement('p');intro.className='v174ForeignIntro';
 intro.textContent='Dwa odrębne zbiory: GUS pokazuje cudzoziemców wykonujących pracę (2025), a dane PUP dotyczą obywateli Ukrainy i zdarzeń od 2022 r. Nie należy utożsamiać tych populacji.';
 const nav=document.createElement('nav');nav.className='v174ForeignNav';nav.setAttribute('aria-label','Zakres analiz cudzoziemców');
 const choices=[{id:'foreign2025Section',title:'Wszyscy cudzoziemcy · GUS 2025'},{id:'uk2026Section',title:'Obywatele Ukrainy · PUP 2022-2026'}];
 // Zachowaj wybrany powiat przy przejściu między danymi GUS i PUP.
 // W danych PUP nazwy zawierają prefiks 'Powiat m.' lub 'Powiat',
 // natomiast w GUS używane są nazwy miast albo powiatów bez prefiksu.
 const normCounty=s=>String(s||'').toLocaleLowerCase('pl-PL')
  .replace(/^powiat\s+(?:m\.\s*)?/i,'').replace(/\s*\(śląskie\)$/i,'').trim();
 let lastSelected=null;
 function transferCounty(to){
  if(!lastSelected||lastSelected===to)return;
  const source=$(lastSelected==='foreign2025Section'?'foreign2025CountySelect':'uk2026County');
  const target=$(to==='foreign2025Section'?'foreign2025CountySelect':'uk2026County');
  if(!source||!target)return;
  const targetOption=Array.from(target.options).find(o=>normCounty(o.value)===normCounty(source.value));
  if(targetOption&&target.value!==targetOption.value){
   target.value=targetOption.value;target.dispatchEvent(new Event('change',{bubbles:true}));
  }
 }
 function select(id){
  transferCounty(id);
  choices.forEach(({id:target})=>{const el=$(target),on=target===id;el.open=on;el.hidden=!on;const btn=nav.querySelector('[data-target="'+target+'"]');if(btn){btn.setAttribute('aria-selected',String(on));btn.setAttribute('aria-current',on?'page':'false')}});
  lastSelected=id;
  // Recompute responsive graphics only after the selected panel is visible.
  requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
 }
 choices.forEach(({id,title})=>{const button=document.createElement('button');button.type='button';button.textContent=title;button.dataset.target=id;button.addEventListener('click',()=>select(id));nav.append(button)});
 pane.append(intro,nav);pane.append(a,b);
 select('foreign2025Section');
 return true;
}
/* v178: Kompaktowa demografia. Przenosimy ORYGINALNE elementy, bez
   powielania wykresów, danych i elementów używanych przez eksport PPTX. */
let demographyMosaicAttempts=0;
function organizeDemographyMosaic(){
 const module=$('demographyModule');
 const root=$('demographyReportRoot');
 const charts=root?.querySelector('.demographyCharts');
 const county=$('demogCountyCard');
 const latest=module?.querySelector('.demographyExistingGrid .gusCard.demo');
 if(!module||!root||!charts||!county||!latest||charts.querySelectorAll('.demographyReportCard').length!==3)return false;
 if(module.dataset.v178Mosaic)return true;
 module.dataset.v178Mosaic='1';
 // Cztery merytorycznie rozłączne karty: 3 regionalne wykresy + profil powiatu.
 // Ostatnia, aktualna wartość 2026 jest osobnym, wąskim panelem nad wykresami.
 latest.classList.add('v178LatestState');
 root.insertBefore(latest,charts);
 charts.append(county);
 // Zbędny drugi nagłówek powtarzał tytuł całej zakładki oraz nazwy kart.
 module.querySelector('.demographyExistingIntro')?.remove();
 // Interpretację z istniejącego raportu pokazujemy przy migracjach,
 // wykorzystując puste miejsce obok wyższej karty powiatu.
 const migration=root.querySelector('#demographyMigrationChartCard');
 const interpretation=root.querySelector('.demographyInterpretation');
 if(migration&&interpretation){
  const bottomLeft=document.createElement('div');bottomLeft.className='v178DemographyBottomLeft';
  const insight=document.createElement('details');insight.className='v178DemographyInsight';
  const summary=document.createElement('summary');summary.textContent='Co wynika z danych demograficznych?';
  interpretation.querySelector('strong')?.remove();
  insight.append(summary,interpretation);
  const desktop=window.matchMedia('(min-width:768px)');
  insight.open=desktop.matches;
  desktop.addEventListener('change',event=>{insight.open=event.matches});
  charts.insertBefore(bottomLeft,county);
  bottomLeft.append(migration,insight);
 }
 // W jednym rozwijanym miejscu pozostaje metodologia i odsyłacz do źródła.
 const additional=[root.querySelector('.demographyNote'),root.querySelector('.demographySource')].filter(Boolean);
 if(additional.length){
  const info=document.createElement('details');info.className='v178DemographyMethods';
  const summary=document.createElement('summary');summary.textContent='Różne okresy i źródła danych GUS';
  info.append(summary,...additional);root.append(info);
 }
 // W widoku 2026 zostaje widoczna aktualna liczba ludności; dłuższy raport
 // o ubytku naturalnym można otworzyć, lecz nie trzeba go ponownie czytać.
 const regional=latest.querySelector('.demographyRegionalSummary');
 if(regional){
  const info=document.createElement('details');info.className='v178DemographyDetails';
  const summary=document.createElement('summary');summary.textContent='Wnioski z raportu demograficznego GUS';
  info.append(summary,regional);latest.append(info);
 }
 // Źródła lokalne nie powielają się pod każdym wykresem.
 const sources=[county.querySelector('.demogSourceAttribution'),county.querySelector('.demogBuiltInNote'),county.querySelector('.demogQuickSources')].filter(Boolean);
 if(sources.length){
  const info=document.createElement('details');info.className='v178DemographyDetails v178CountySources';
  const summary=document.createElement('summary');summary.textContent='Źródła i metodologia danych powiatowych';
  info.append(summary,...sources);county.append(info);
 }
 // Pełne dane 2025 są dostępne dla 36 jednostek. Historia tylko dla 16.
 const status=county.querySelector('.demogMiniHead > span');
 if(status)status.textContent='36/36 jednostek: liczba ludności za 2025 r. · historia dla 16 jednostek';
 requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
 return true;
}
function startDemographyMosaic(){
 if(organizeDemographyMosaic())return;
 if(++demographyMosaicAttempts<180)setTimeout(startDemographyMosaic,100);
}
let attempts=0;
const tick=()=>{
 organizeEconomy();organizeUnemployment();organizeDemography();
 if(!demographyMosaicAttempts)startDemographyMosaic();
 if(organizeForeigners())return;
 if(++attempts<240)setTimeout(tick,120);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
})();
