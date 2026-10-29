/* v34: compact, responsive views. Existing DOM nodes and handlers are preserved. */
(function(){
'use strict';
const $=id=>document.getElementById(id);if(!$('pupStructureModule'))return;
document.body.classList.add('compactUI');
const definitions=[['map','Mapa'],['jobs','Zawody'],['trends','Trendy'],['unemployment','Bezrobocie'],['gus','Dane GUS'],['rankings','Rankingi'],['sources','Źródła']];
const main=document.querySelector('.studioContent'),panes={};
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
 elements.forEach((card,i)=>{const d=document.createElement('details');d.className='compactResponsiveDetail '+kind;const sum=document.createElement('summary');sum.textContent=card.querySelector('h2,h3')?.textContent||'Analiza';card.before(d);d.append(sum,card);d.open=window.innerWidth>=768||i===defaultIndex;wrappers.push(d);d.addEventListener('toggle',()=>{if(d.open&&window.innerWidth<768)wrappers.forEach(other=>{if(other!==d)other.open=false});if(d.open)window.dispatchEvent(new Event('resize'))})});
 window.matchMedia('(min-width:768px)').addEventListener('change',e=>wrappers.forEach((d,i)=>d.open=e.matches||i===defaultIndex));
}
phoneAccordions(Array.from($('gusModule').querySelectorAll('section.gusCard')),'compactGusDetail',1);
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
const nav=document.querySelector('.chapterRailInner');nav.replaceChildren();
const mobile=document.createElement('div');mobile.className='compactMobileNav';mobile.innerHTML='<label for="compactViewSelect">Widok</label><select id="compactViewSelect">'+definitions.map(([id,l])=>`<option value="${id}">${l}</option>`).join('')+'</select>';nav.appendChild(mobile);
for(const [id,label] of definitions){const b=document.createElement('button');b.type='button';b.className='compactNavButton';b.dataset.view=id;b.textContent=label;b.setAttribute('aria-controls','compact-'+id);b.addEventListener('click',()=>show(id));nav.appendChild(b)}
const aliases={chapterMap:'map',atlasMap:'map',studioStart:'map',chapterJobs:'jobs',atlasAnalysis:'jobs',occupationProfileSection:'jobs',chapterTrends:'trends',trendSection:'trends',historyArchive:'trends',chapterStatistics:'gus',gusModule:'gus',countyUnempModule:'unemployment',pupStructureModule:'unemployment',chapterRankings:'rankings',atlasRankings:'rankings',atlasSources:'sources',pupSourcesSection:'sources'};
let active='map';
function show(id,scroll=true){
 if(!panes[id])id='map';active=id;
 for(const [key,pane] of Object.entries(panes))pane.hidden=key!==id;
 document.body.dataset.compactView=id;$('compactViewSelect').value=id;
 nav.querySelectorAll('.compactNavButton').forEach(b=>{const on=b.dataset.view===id;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
 $('filterStudio').hidden=['sources','gus','rankings'].includes(id);
 if(id==='unemployment'){
  $('countyUnempModule').open=true;
  /* Zachowaj wybór województwa w tej zakładce. */
 }
 if(id==='gus')$('gusModule').open=true;
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
window.COMPACT_LAYOUT={show,get active(){return active}};
})();
