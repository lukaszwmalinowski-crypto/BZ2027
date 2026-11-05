/* v34: compact, responsive views. Existing DOM nodes and handlers are preserved. */
(function(){
'use strict';
const $=id=>document.getElementById(id);if(!$('pupStructureModule'))return;
document.body.classList.add('compactUI');
const definitions=[['map','Mapa'],['jobs','Zawody'],['trends','Trendy'],['rankings','Rankingi'],['unemployment','Bezrobocie'],['foreigners','Cudzoziemcy'],['gus','Sytuacja gosp.'],['demography','Demografia'],['skills','Trendy i kompetencje'],['sources','Źródła']];
const main=document.querySelector('.studioContent'),panes={};
let presentationActive=false;
let presentationOpenStates=[];
let presentationFilterHidden=false;
for(const [id,label] of definitions){const pane=document.createElement('section');pane.id='compact-'+id;pane.className='compactPane';pane.dataset.view=id;pane.setAttribute('aria-label',label);pane.hidden=true;main.appendChild(pane);panes[id]=pane}
function move(id,pane){const el=$(id);if(el)panes[pane].appendChild(el)}
move('chapterMap','map');move('atlasMap','map');
move('chapterJobs','jobs');move('atlasAnalysis','jobs');move('occupationProfileSection','jobs');
move('chapterTrends','trends');move('trendSection','trends');move('historyArchive','trends');
move('chapterStatistics','gus');move('gusModule','gus');
move('countyUnempModule','unemployment');
move('chapterRankings','rankings');move('atlasOverview','rankings');move('atlasRankings','rankings');
move('atlasSources','sources');
const footer=document.querySelector('.techFooter');if(footer)panes.sources.appendChild(footer);
// Keep a small profile beside the map; longer lists belong in the Jobs view.
const jobs=$('jobs')?.closest('.section'),comments=$('comments')?.closest('.section');
if(jobs){const card=document.createElement('section');card.className='card compactJobsCard';card.appendChild(jobs);if(comments){const d=document.createElement('details');d.className='compactMore';const sum=document.createElement('summary');sum.textContent='Komentarze do prognozy';d.appendChild(sum);d.appendChild(comments);card.appendChild(d)}panes.jobs.insertBefore(card,panes.jobs.querySelector('#atlasAnalysis'))}
const benchmark=$('voivBenchmark');if(benchmark){const d=document.createElement('details');d.className='compactMore compactBenchmark';const sum=document.createElement('summary');sum.textContent='Porównanie ze średnią wojewódzką';benchmark.before(d);d.append(sum,benchmark)}
// Show structure first; comparison charts are available on demand.
const wrap=$('countyUnempModule').querySelector('.countyUWrap'),pup=$('pupStructureModule');
const more=document.createElement('details');more.id='compactCountyMore';more.className='compactMore';const sum=document.createElement('summary');sum.textContent='Stopa bezrobocia, porównania i mapa powiatów';more.appendChild(sum);
for(const node of Array.from(wrap.children))if(node!==pup)more.appendChild(node);
wrap.append(pup,more);
$('pupCounty').parentElement.classList.add('compactDuplicateCounty');
// On phones show one chart at a time, while tablets keep both columns.
const chartTabs=document.createElement('div');chartTabs.className='compactChartTabs';chartTabs.setAttribute('role','group');chartTabs.setAttribute('aria-label','Widok wykresu bezrobocia');chartTabs.innerHTML='<button type="button" data-mobile-chart="structure">Struktura</button><button type="button" data-mobile-chart="history">Historia zmian</button>';
pup.querySelector('.pupGrid').before(chartTabs);
function mobileChart(view){pup.dataset.mobileChart=view;chartTabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mobileChart===view)));window.dispatchEvent(new Event('resize'))}
chartTabs.addEventListener('click',e=>{const b=e.target.closest('[data-mobile-chart]');if(b)mobileChart(b.dataset.mobileChart)});
pup.addEventListener('click',e=>{if(e.target.closest('[data-pup-group]'))mobileChart('structure');if(e.target.closest('[data-pup-index]'))mobileChart('history')});
mobileChart('structure');
// Secondary analyses expand individually on phones, without losing their controls.
function phoneAccordions(elements,kind,defaultIndex){
 const wrappers=[];
 elements.forEach((card,i)=>{const d=document.createElement('details');d.className='compactResponsiveDetail '+kind;const sum=document.createElement('summary');sum.textContent=card.querySelector('h2,h3')?.textContent||'Analiza';card.before(d);d.append(sum,card);d.open=window.innerWidth>=768||i===defaultIndex;wrappers.push(d);d.addEventListener('toggle',()=>{if(d.open&&!presentationActive&&window.innerWidth<768)wrappers.forEach(other=>{if(other!==d)other.open=false});if(d.open)window.dispatchEvent(new Event('resize'))})});
 window.matchMedia('(min-width:768px)').addEventListener('change',e=>{if(!presentationActive)wrappers.forEach((d,i)=>d.open=e.matches||i===defaultIndex)});
}
phoneAccordions(Array.from($('gusModule').querySelectorAll('section.gusCard')).filter(card=>!card.classList.contains('demo')&&card.id!=='demogCountyCard'),'compactGusDetail',1);
function fmt1(v){return Number(v).toFixed(1).replace('.',',')}
function fmtInt(v){return Number(v).toLocaleString('pl-PL',{maximumFractionDigits:0})}
function monthEndLabel(isoMonth){
 if(!isoMonth||!/^\d{4}-\d{2}$/.test(isoMonth))return '';
 const [year,month]=isoMonth.split('-').map(Number);
 const lastDay=new Date(year,month,0).getDate();
 return `${String(lastDay).padStart(2,'0')}.${String(month).padStart(2,'0')}.${year}`;
}
function unemploymentRegionalSummary(){
 let rate=null,date='';
 const monthly=window.PANEL_DATA?.gus?.unempMonthly;
 if(monthly?.sl?.length){
  rate=monthly.sl[monthly.sl.length-1];
  const detail=Array.isArray(monthly.detail)?monthly.detail[monthly.detail.length-1]:'';
  const match=String(detail||'').match(/(\d{2}\.\d{2}\.\d{4})/);
  date=match?match[1]:(window.PANEL_DATA?.gus?.unempCountMonthly?.detail?.at(-1)||detail);
 }
 let count=null;
 try{
  const source=JSON.parse($('wupMonthlyDetailedData')?.textContent||'null');
  const values=source?.metrics?.registered?.values?.['2026'];
  count=Array.isArray(values)?[...values].reverse().find(v=>Number.isFinite(v)):null;
  if(!date)date=monthEndLabel(source?.meta?.latest_month);
 }catch(e){}
 if(rate===null&&count===null)return null;
 return {rate,count,date:date||'wrzesień 2026'};
}
function appendRegionalSummary(heading){
 const summary=unemploymentRegionalSummary();
 if(!summary)return;
 const panel=document.createElement('div');
 panel.className='registeredUnemploymentSummary';
 panel.setAttribute('aria-label','Najnowsze dane o bezrobociu dla województwa śląskiego');
 const intro=document.createElement('p');
 intro.className='registeredUnemploymentSummaryIntro';
 intro.textContent='Najnowsze dane dla woj. śląskiego';
 panel.appendChild(intro);
 if(summary.rate!==null){
  const item=document.createElement('div');
  item.className='registeredUnemploymentStat';
  item.innerHTML=`<span class="registeredUnemploymentStatLabel">Stopa bezrobocia</span><strong>${fmt1(summary.rate)}%</strong><small>stan na ${summary.date}</small>`;
  panel.appendChild(item);
 }
 if(summary.count!==null){
  const item=document.createElement('div');
  item.className='registeredUnemploymentStat';
  item.innerHTML=`<span class="registeredUnemploymentStatLabel">Bezrobotni zarejestrowani</span><strong>${fmtInt(summary.count)}</strong><small>stan na ${summary.date}</small>`;
  panel.appendChild(item);
 }
 heading.appendChild(panel);
}
// v134: historia bezrobocia rejestrowanego i szczegółowe dane WUP należą
// do działu Bezrobocie, a nie do demografii i gospodarki.
// Przenosimy istniejące węzły bez klonowania: wykresy, filtry, zdarzenia
// oraz wybory do Worda/PPTX zachowują te same identyfikatory i dane.
const registeredUnempCards=[
 $('gusUnempChart')?.closest('section.gusCard'),
 $('gusWupDetailsCard')
].filter(Boolean);
if(registeredUnempCards.length===2){
 const region=document.createElement('section');
 region.id='registeredUnemploymentModule';
 region.className='registeredUnemploymentModule';
 region.setAttribute('aria-labelledby','registeredUnemploymentHeading');
 const heading=document.createElement('header');
 heading.className='registeredUnemploymentHeading';
 heading.innerHTML='<div class="registeredUnemploymentHeadingMain"><span class="registeredUnemploymentEyebrow">WOJEWÓDZTWO ŚLĄSKIE · DANE REJESTROWE</span><h2 id="registeredUnemploymentHeading">Dane regionalne</h2><p>Bezrobocie rejestrowane: historia 2016–2025, dane bieżące i miesięczne zestawienia WUP.</p></div>';
 appendRegionalSummary(heading);
 const grid=document.createElement('div');grid.className='registeredUnemploymentGrid';
 region.append(heading,grid);
 registeredUnempCards.forEach((card,i)=>{
   const wrap=card.closest('.compactResponsiveDetail')||card;
   grid.appendChild(wrap);
   if(wrap.tagName==='DETAILS')wrap.open=window.innerWidth>=768||i===0;
 });
 panes.unemployment.insertBefore(region,$('countyUnempModule'));
}

// v153: Existing demographic cards are moved, not duplicated, so charts and handlers survive.
const demographyModule=document.createElement('section');
demographyModule.id='demographyModule';demographyModule.className='demographyModule';
panes.demography.appendChild(demographyModule);
const populationCard=$('gusModule').querySelector('section.gusCard.demo');
const countyDemographyCard=$('demogCountyCard');
const demographicCardGrid=document.createElement('div');demographicCardGrid.className='demographyExistingGrid';
[countyDemographyCard,populationCard].filter(Boolean).forEach(card=>{
 const wrapper=card.closest('.compactResponsiveDetail')||card;
 wrapper.open=true;
 demographicCardGrid.appendChild(wrapper);
});
// v154: Primarily local/district charts, then new regional charts lower on the page.
const existingIntro=document.createElement('div');existingIntro.className='demographyExistingIntro';
existingIntro.innerHTML='<span class="demographyEyebrow">DEMOGRAFIA / DANE LOKALNE</span><h2>Demografia powiatowa i stan ludności</h2><p>Najpierw dane dla wybranej jednostki, następnie najnowszy stan ludności. Niżej znajduje się wieloletnie porównanie dla całego województwa.</p>';
const newReport=document.createElement('div');newReport.id='demographyReportRoot';
demographyModule.append(existingIntro,demographicCardGrid,newReport);
// v157: wskaźniki ludności, bezrobocia i REGON mają już dedykowane
// karty w odpowiednich działach. Usuwamy wtórny rząd KPI z gospodarki.
$('gusModule').querySelector('.gusHeroKpis')?.remove();
phoneAccordions(Array.from($('atlasRankings').querySelectorAll('.rank')),'compactRankDetail',0);

// Keep the selected occupation next to its picker and reveal it after selection.
panes.jobs.insertBefore($('occupationProfileSection'),panes.jobs.firstChild);
$('occupationSelect').addEventListener('change',()=>{if(active==='jobs'&&$('occupationSelect').value)$('occupationProfileSection').scrollIntoView({block:'start',behavior:'instant'})});
document.addEventListener('click',e=>{if(e.target.closest('#jobs [data-occ]'))$('occupationProfileSection').scrollIntoView({block:'start',behavior:'instant'})});
// Sources start with the PUP availability picker; documentation groups open on demand.
const sourceContent=$('sourceRegistry').querySelector('.sourceRegistryContent');
sourceContent.prepend($('pupSourcesSection'));
sourceContent.querySelectorAll('div.srcGroup').forEach(group=>{const head=group.querySelector('h3,h2,h4');if(!head)return;const d=document.createElement('details');d.className='compactSourceGroup';const summary=document.createElement('summary');summary.textContent=head.textContent;head.remove();group.before(d);d.append(summary,group)});
const technical=document.createElement('details');technical.className='compactSourceGroup';const technicalTitle=document.createElement('summary');technicalTitle.textContent='Aktualizacja danych i dokumentacja';technical.append(technicalTitle);sourceContent.append(technical);
sourceContent.querySelectorAll(':scope>.srcNotice,:scope>.srcStatusLine,:scope>.srcEndNote').forEach(e=>technical.append(e));

// The global county selector stays visible. Extra map controls are collapsible.
const fields=$('filterFields'),filters=document.createElement('details');filters.className='compactFilters';filters.open=false;const fs=document.createElement('summary');fs.textContent='Widok mapy i analiza zawodu';filters.appendChild(fs);
for(const node of Array.from(fields.children))if(!node.classList.contains('countyControl'))filters.appendChild(node);
fields.appendChild(filters);
main.insertBefore($('filterStudio'),panes.map);
// v148: Full-screen presentation is a single continuous narrative, not one tab at a time.
const presentationLabels={map:'Mapa i profil',jobs:'Zawody i analiza',trends:'Trendy i historia',rankings:'Rankingi',unemployment:'Bezrobocie',foreigners:'Cudzoziemcy na rynku pracy',gus:'Sytuacja gospodarcza, BAEL i REGON',demography:'Demografia, ludność i migracje',skills:'Trendy i kompetencje przyszłości',sources:'Źródła danych'};
const presentationToolbar=document.createElement('nav');
presentationToolbar.id='continuousPresentationNav';
presentationToolbar.className='continuousPresentationNav';
presentationToolbar.setAttribute('aria-label','Nawigacja po sekcjach prezentacji');
const presentationHeading=document.createElement('div');
presentationHeading.className='continuousPresentationBrand';
presentationHeading.innerHTML='<span>OBSERWATORIUM · RYNEK PRACY · 2027</span><strong>Widok prezentacji</strong>';
const presentationLinks=document.createElement('div');
presentationLinks.className='continuousPresentationLinks';
for(const [id,label] of definitions){
 const button=document.createElement('button');button.type='button';button.className='continuousPresentationJump';
 button.dataset.presentationTarget=id;button.textContent=label;
 button.addEventListener('click',()=>{panes[id].scrollIntoView({behavior:'smooth',block:'start'});});
 presentationLinks.appendChild(button);
 const title=document.createElement('div');title.className='continuousSectionHeading';
 title.innerHTML=`<span class="continuousSectionIndex">${String(definitions.findIndex(([key])=>key===id)+1).padStart(2,'0')} / ${String(definitions.length).padStart(2,'0')}</span><h2>${presentationLabels[id]}</h2>`;
 panes[id].prepend(title);
}
const presentationExit=document.createElement('button');presentationExit.type='button';presentationExit.className='continuousPresentationExit';
presentationExit.textContent='✕ Zakończ';presentationExit.setAttribute('aria-label','Zakończ tryb prezentacji');
presentationExit.addEventListener('click',()=>document.getElementById('fullscreenBtn')?.click());
presentationToolbar.append(presentationHeading,presentationLinks,presentationExit);
main.insertBefore(presentationToolbar,panes.map);
function setPresentationMode(enabled){
 if(presentationActive===enabled)return;
 presentationActive=enabled;
 if(enabled){
  presentationFilterHidden=$('filterStudio').hidden;
  $('filterStudio').hidden=false;
  const selectors='#countyUnempModule,#gusModule,#historyArchive,#sourceRegistry,#compactCountyMore,#foreign2025Section,#uk2026Section,#compactFilters,.compactResponsiveDetail,.compactBenchmark,.compactJobsCard .compactMore';
  presentationOpenStates=Array.from(document.querySelectorAll(selectors)).filter(e=>e.matches('details')).map(e=>[e,e.open]);
  for(const p of Object.values(panes))p.hidden=false;
  for(const [element] of presentationOpenStates)element.open=true;
  for(const el of document.querySelectorAll('#compact-foreigners > .historyArchive')){el.dataset.v174PreviousHidden=String(el.hidden);el.hidden=false;el.open=true;}
  window.scrollTo({top:0,behavior:'instant'});
 }else{
  for(const [element,wasOpen] of presentationOpenStates)element.open=wasOpen;
  presentationOpenStates=[];
  for(const el of document.querySelectorAll('#compact-foreigners > .historyArchive')){if(el.dataset.v174PreviousHidden!==undefined){el.hidden=el.dataset.v174PreviousHidden==='true';delete el.dataset.v174PreviousHidden;}}
  show(active,false);
  $('filterStudio').hidden=presentationFilterHidden;
 }
 requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
}
const nav=document.querySelector('.chapterRailInner');nav.replaceChildren();
const mobile=document.createElement('div');mobile.className='compactMobileNav';mobile.innerHTML='<label for="compactViewSelect">Widok</label><select id="compactViewSelect">'+definitions.map(([id,l])=>`<option value="${id}">${l}</option>`).join('')+'</select>';nav.appendChild(mobile);
for(const [id,label] of definitions){const b=document.createElement('button');b.type='button';b.className='compactNavButton';b.dataset.view=id;b.textContent=label;b.setAttribute('aria-controls','compact-'+id);b.addEventListener('click',()=>show(id));nav.appendChild(b)}
const aliases={demographyModule:'demography',ts183County:'skills',demogCountyCard:'demography',chapterDemography:'demography',chapterMap:'map',atlasMap:'map',studioStart:'map',chapterJobs:'jobs',atlasAnalysis:'jobs',occupationProfileSection:'jobs',chapterTrends:'trends',trendSection:'trends',historyArchive:'trends',chapterStatistics:'gus',gusModule:'gus',foreign2025Section:'foreigners',uk2026Section:'foreigners',countyUnempModule:'unemployment',pupStructureModule:'unemployment',chapterRankings:'rankings',atlasRankings:'rankings',atlasSources:'sources',pupSourcesSection:'sources'};
let active='map';
function show(id,scroll=true){
 if(!panes[id])id='map';
 if(presentationActive){if(scroll)panes[id].scrollIntoView({block:'start',behavior:'smooth'});return;}
 active=id;
 for(const [key,pane] of Object.entries(panes))pane.hidden=key!==id;
 document.body.dataset.compactView=id;$('compactViewSelect').value=id;
 nav.querySelectorAll('.compactNavButton').forEach(b=>{const on=b.dataset.view===id;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
 $('filterStudio').hidden=['sources','gus','foreigners','demography','skills','rankings'].includes(id);
 if(id==='unemployment'){
  $('countyUnempModule').open=true;
  /* Zachowaj wybór województwa w tej zakładce. */
 }
 if(id==='gus')$('gusModule').open=true;
 if(id==='foreigners'){const gus=$('foreign2025Section'),uk=$('uk2026Section');if(gus&&!gus.open&&!uk?.open)gus.open=true;}
 if(id==='demography')demographicCardGrid.querySelectorAll('details').forEach(x=>x.open=true);
 if(id==='sources')$('sourceRegistry').open=true;
 filters.open=id==='jobs';
 try{history.replaceState(null,'',location.pathname+location.search+'#widok-'+id)}catch(e){}
 window.dispatchEvent(new Event('resize'));
 if(scroll)window.scrollTo({top:0,behavior:'instant'});
}
$('compactViewSelect').addEventListener('change',e=>show(e.target.value));
document.addEventListener('click',e=>{
 const jump=e.target.closest('#pupGoToStructure');if(jump){e.preventDefault();e.stopImmediatePropagation();show('unemployment');return}
 const a=e.target.closest('a[href^="#"]');if(!a)return;
 const hash=a.getAttribute('href').slice(1),view=aliases[hash];if(view){e.preventDefault();e.stopImmediatePropagation();show(view);if(hash==='pupSourcesSection')$('pupSourcesSection').scrollIntoView({block:'start',behavior:'instant'})}
},true);
document.addEventListener('click',e=>{if(e.target.closest('[data-pup-county]'))show('unemployment')});
window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);show(h.startsWith('widok-')?h.slice(6):(aliases[h]||active),false)});
window.addEventListener('beforeprint',()=>document.body.classList.add('compactPrinting'));
window.addEventListener('afterprint',()=>document.body.classList.remove('compactPrinting'));
const initial=location.hash.slice(1);show(initial.startsWith('widok-')?initial.slice(6):(aliases[initial]||'map'),false);
window.COMPACT_LAYOUT={show,setPresentationMode,get active(){return active},get presentationActive(){return presentationActive}};
})();
