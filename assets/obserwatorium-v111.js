(() => {
'use strict';
const $ = id => document.getElementById(id);
const groups={barometr:[['map','Mapa i profil'],['jobs','Zawody'],['trends','Trendy i historia'],['rankings','Rankingi']],bezrobocie:[['unemployment','Struktura i historia']],gospodarka:[['gus','Demografia i gospodarka']]};
const labels={barometr:'Barometr Zawodów',bezrobocie:'Bezrobocie',gospodarka:'Sytuacja gospodarcza'};
const route={map:'barometr',jobs:'barometr',trends:'barometr',rankings:'barometr',unemployment:'bezrobocie',gus:'gospodarka',sources:'sources'};
const viewLabel={map:'Mapa i profil powiatu',jobs:'Analiza zawodów',trends:'Trendy i archiwum',rankings:'Rankingi',unemployment:'Bezrobocie',gus:'Sytuacja gospodarcza'};
const storeKey='obserwatorium-2027-prezentacja-v1'; let basket=[];
try{const loaded=JSON.parse(localStorage.getItem(storeKey)||'[]');if(Array.isArray(loaded)){
 const uniq=new Set();basket=loaded.filter(x=>{if(!x||!x.id||!x.title||!x.unit)return false;
 const k=x.selectionKey||JSON.stringify([x.view,x.elementRef||x.title,x.unit,x.settings?.params||{},x.structured?.occupationList?.status||'']);
 if(uniq.has(k))return false;uniq.add(k);return true;}).slice(0,100);
}}catch{}
function save(){compactBasket();try{localStorage.setItem(storeKey,JSON.stringify(basket))}catch(err){console.warn('Nie zapisano całej listy prezentacji w pamięci lokalnej:',err)} updateCounter();drawBasket();syncPresentationPicks()}
function selectedUnit(){return $('countySelect')?.selectedOptions[0]?.textContent?.trim()||'Województwo śląskie'}
function safeText(node){return (node?.innerText||node?.textContent||'').replace(/\s+/g,' ').trim().slice(0,3800)}
function snapshot(node,view){const svg=[...(node.matches('svg')?[node]:[]),...node.querySelectorAll('svg')].find(s=>s.getBoundingClientRect().width>140&&s.getBoundingClientRect().height>70);return {id:(crypto.randomUUID?.()||String(Date.now())+'-'+Math.random()),view,kind:svg?'wykres/grafika':'dane',title:node.querySelector('h2,h3,h4')?.textContent?.trim()||viewLabel[view],unit:selectedUnit(),period:node.querySelector('[data-year]')?.getAttribute('data-year')||'według aktualnego widoku',text:safeText(node),svg:svg?.outerHTML||null,created:new Date().toISOString(),source:node.querySelector('.src,.source,.gusSource')?.textContent?.trim()||'Zobacz źródła i metodologię w Obserwatorium',settings:{view,county:$('countySelect')?.value,occupation:$('occupationSelect')?.value}}}
function eligible(root){const arr=[];const ids={map:['atlasMap','voivBenchmark'],jobs:['occupationProfileSection','atlasAnalysis','compareModule'],trends:['trendSection','historyArchive'],rankings:['atlasRankings'],unemployment:['pupStructureModule','compactCountyMore'],gus:['regionalNationalChart','regionalHistoryPanel','gusModule']};for(const id of ids[root.dataset.view]||[]){const el=$(id);if(el&&root.contains(el))arr.push(el)}if(!arr.length){root.querySelectorAll(':scope > .card,:scope > .rank,:scope > .gusModule,:scope > .pupModule').forEach(x=>arr.push(x))}return arr.filter(x=>x.id!=='regionalHistoryPanel'||!x.hidden)}
function addButtons(){document.querySelectorAll('.compactPane').forEach(pane=>{const view=pane.dataset.view;if(!route[view]||view==='sources')return;eligible(pane).forEach(node=>{if(node.dataset.presentationSelectable)return;node.dataset.presentationSelectable='1';const wrap=document.createElement('label');wrap.className='v111Pick';wrap.title='Zapisz aktualne dane i ustawienia tego elementu';const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.setAttribute('aria-label','Dodaj do prezentacji');const label=document.createElement('span');label.textContent='Do prezentacji';wrap.append(checkbox,label);if(node.id==='atlasMap'){const head=node.querySelector('.mapStudioCard .studioMapHead');if(head){wrap.classList.add('v112MapPick');head.append(wrap)}else node.querySelector('.mapStudioCard')?.prepend(wrap)}else{node.prepend(wrap)}checkbox.addEventListener('change',()=>{if(!checkbox.checked)return;const snap=snapshot(node,view);basket.push(snap);save();checkbox.checked=false;label.textContent='Dodano ✓';setTimeout(()=>label.textContent='Do prezentacji',1300)})})})}
// v113: szczegółowe karty bez ingerowania w istniejące siatki paneli.
const fineSelectors={
 map:['#atlasMap .profileStudioCard','#voivBenchmark'],
 jobs:['#occupationProfileSection','#atlasAnalysis .analyticSignal','#atlasAnalysis .compareCard','#atlasAnalysis .insightCard','#atlasAnalysis .compareModule','#compareSection'],
 trends:['#trendSection','#historyArchive'],
 rankings:['#atlasRankings .rank'],
 unemployment:['#pupStructureModule','#pupStructureModule .pupGrid > *','#pupStructureModule .pupTrendCard','#pupStructureModule .pupHistoryCard'],
 gus:['#regionalPulse','#regionalNationalChart','#regionalHistoryPanel','#gusModule section.gusCard','#demogCountyCard']
};
function fineNodes(pane){
 const found=[];const seen=new Set();
 for(const selector of fineSelectors[pane.dataset.view]||[]){
  for(const node of pane.querySelectorAll(selector)){
   if(seen.has(node)||node.matches('.v111Pick,.v113Pick'))continue;
   // ignore containers composed exclusively of already targeted smaller cards
   seen.add(node);found.push(node);
  }
 }
 return found;
}
function refinedSnapshot(node,view){
 const result=snapshot(node,view);
 const heading=node.querySelector('h2,h3,h4,.pupChartTitle,.gusCardTitle,.vLabel')?.textContent?.trim();
 if(heading)result.title=heading.replace(/\\s+/g,' ').slice(0,130);
 const times=[...node.querySelectorAll('select')].map(el=>({id:el.id,value:el.value,label:el.selectedOptions?.[0]?.textContent?.trim()}));
 result.settings={...result.settings,controls:times,period:node.querySelector('[data-year]')?.getAttribute('data-year')||null,view};
 result.elementId=node.id||null;
  // v117: przechowujemy strukturę DANYCH, a nie tylko zrzut tekstu interfejsu.
  const rankRows=[...node.querySelectorAll('.rankitem')].map(r=>({
    label:r.querySelector('.rankname')?.getAttribute('title')||r.querySelector('.rankname')?.textContent?.trim()||'',
    value:Number((r.querySelector('b')?.textContent||'').replace(',','.'))
  })).filter(r=>r.label&&Number.isFinite(r.value));
  const signalRows=[...node.querySelectorAll('.analyticSignal,.mapSignal')].map(r=>({
    label:r.querySelector('b,.sLabel')?.textContent?.trim()||'',
    detail:r.querySelector('span,.sHint')?.textContent?.trim()||''
  })).filter(r=>r.label&&r.detail);
  const metricRows=[...node.querySelectorAll('.voivRef,.gusHeroKpi,.regionalPulseCard,.mapSignal,.occKpi,.pupStat,.kpi')].map(r=>({
    label:r.querySelector('.vLabel,.kLabel,.sLabel,.label,.l')?.textContent?.trim()||'',
    value:r.querySelector('.vValue,.kValue,.sValue,.value,.n')?.textContent?.trim()||'',
    detail:r.querySelector('.vCompare,.sub,.sHint,.kSub')?.textContent?.trim()||''
  })).filter(r=>r.label&&r.value).slice(0,12);
  result.structured={rankings:rankRows,signals:signalRows,metrics:metricRows};
  const captured=v122ChartData(node);if(captured){result.structured.chartData=captured;if(captured.kind==='bars')result.structured.rankings=captured.rankings;}

 // Mapa jest zapisywana w momencie wyboru z aktualnym kolorem wszystkich powiatów,
 // trybem oraz wybranym zawodem. Późniejsze zmiany mapy nie modyfikują tego slajdu.
 const mainMap=node.querySelector('svg#map');
 if(mainMap){
  const occupation=$('occupationSelect')?.value||'';
  const activeMode=document.querySelector('.modeButtons .btn.active[data-mode]')?.dataset.mode||'delta';
  const modes={delta:'Zmiana liczby deficytów vs 2026',deficit:'Deficyty 2027',balance:'Udział równowagi',unemployment:'Stopa bezrobocia'};
  result.title=occupation?'Mapa zawodów — '+occupation:'Mapa województwa — '+(modes[activeMode]||activeMode);
  const cloned=mainMap.cloneNode(true);cloned.setAttribute('xmlns','http://www.w3.org/2000/svg');
  cloned.querySelectorAll('path').forEach(path=>{
    const source=mainMap.querySelector('path[data-name="'+CSS.escape(path.dataset.name||'')+'"]');
    if(source){const computed=getComputedStyle(source);if(computed.fill)path.setAttribute('fill',computed.fill);
       if(computed.stroke)path.setAttribute('stroke',computed.stroke);
       if(computed.strokeWidth)path.setAttribute('stroke-width',computed.strokeWidth)}
  });
  result.svg=cloned.outerHTML;
  result.structured.map={kind:'barometr',mode:activeMode,occupation,legend:occupation?'Status zawodu według powiatów':(modes[activeMode]||activeMode),county:result.unit};
 }
 const canvas=[...node.querySelectorAll('canvas')].find(c=>c.width>150&&c.height>80);
 if(canvas){try{result.png=canvas.toDataURL('image/png')}catch{}}
 return result;
}
// Stała tożsamość panelu (również dla kart bez id). Nie zależy od położenia przycisku.
function panelRef(node){
 if(node.dataset.presentationRef)return node.dataset.presentationRef;
 if(node.id)return node.dataset.presentationRef='#'+node.id;
 const steps=[];let current=node;
 while(current&&current.nodeType===1&&!current.id){
  const parent=current.parentElement;
  if(!parent)break;
  const same=[...parent.children].filter(x=>x.tagName===current.tagName);
  steps.unshift(current.tagName.toLowerCase()+':'+same.indexOf(current));
  current=parent;
 }
 return node.dataset.presentationRef=(current?.id?'#'+current.id:'root')+'/'+steps.join('/');
}
function pickContext(node,view){
 const county=(view==='unemployment'?(node.closest('#pupStructureModule')?$('pupCounty')?.value:node.closest('#countyUnempModule')?$('countyUCounty')?.value:$('pupCounty')?.value):null)||$('countySelect')?.value||'__WOJ__';
 const params={};
 if(view==='unemployment'){
  for(const id of ['pupPeriod','pupPopulation','pupUnit','pupTrendMetric']){const control=$(id);if(control)params[id]=control.value;}
  params.group=document.querySelector('#pupStructureModule [data-pup-group].active, #pupStructureModule [data-pup-group][aria-pressed="true"]')?.getAttribute('data-pup-group')||'wiek';
 }
 if(view==='gus'&&node.matches('#demogCountyCard'))params.demogCounty=$('demogSelect')?.value||'';
 if(['map','jobs','trends'].includes(view))params.occupation=$('occupationSelect')?.value||'';
 if(view==='map')params.mapMode=document.querySelector('.modeButtons .btn.active[data-mode]')?.dataset.mode||'delta';
 // Interaktywne wykresy mogą zmieniać wariant za pomocą kontrolek poza samym SVG.
 // Zapamiętujemy przełączniki tylko z powiązanego modułu (nie z całego GUS).
 const scope=node.closest('.gusCard,.pupCard,#pupStructureModule,#trendSection,#countyUnempModule,#regionalHistoryPanel,#regionalNationalChart,#atlasMap')||node;
 for(const el of scope.querySelectorAll('select')){
  if(el.id&&!(el.id in params)&&el.id!=='pupRawTableSelect')params[el.id]=el.value;
 }
 const switched=[...scope.querySelectorAll('button.active, button.selected, button[aria-pressed="true"], [role="tab"][aria-selected="true"]')]
  .filter(el=>!el.closest('.v113Pick,.v120ChartPick,.v120MapPick,.v111Pick') && !el.matches('.v113Pick,.v120ChartPick,.v120MapPick'))
  .map(el=>[el.dataset.mode||el.dataset.pupGroup||el.dataset.pupIndex||el.dataset.cuView||el.dataset.status||'',(el.textContent||'').replace(/\s+/g,' ').trim().slice(0,55)])
  .filter(z=>z[0]||z[1]).slice(0,14);
 if(switched.length)params.chartSwitches=switched;
 if(scope.dataset.metric)params.chartMetric=scope.dataset.metric;
 if(scope.dataset.mobileChart&&view==='unemployment')params.mobileChart=scope.dataset.mobileChart;
 if(view==='unemployment'&&node.closest('#countyUnempModule')){
  for(const id of ['countyUCounty','countyUMetric','countyUPeriod','countyUYear','countyUMapDate','countyUMapMode']){const el=$(id);if(el)params[id]=el.value}
  params.countyUView=document.querySelector('#countyUnempModule [data-cu-view].active')?.dataset.cuView||'single';
 }
 if(node.id==='compareSection'){
  params.comparedCounties=[1,2,3,4,5].map(i=>$('compare'+i)?.value).filter(Boolean);params.compareChartMetric=$('compareChartMetric')?.value||'deficit';
 }
 if(view==='trends'){
  const ts=$('trendSection');
  params.trendSwitches=[...ts?.querySelectorAll('.trendBtn.active,.trendModeBtn.active')||[]].map(b=>(b.textContent||'').trim());
 }
 return {county,params};
}
function pickKey(node,view){
 const ctx=pickContext(node,view);
 return JSON.stringify([view,panelRef(node),ctx.county,ctx.params]);
}
function syncPresentationPicks(){
 for(const wrap of document.querySelectorAll('.v113Pick')){
  const node=wrap.closest('.v113Selectable'),cb=wrap.querySelector('input[type="checkbox"]'),span=wrap.querySelector('span');
  if(!node||!cb||!span)continue;
  const view=node.closest('.compactPane')?.dataset.view;
  if(!view)continue;
  const key=pickKey(node,view);
  const active=basket.some(item=>item.selectionKey===key);
  if(cb.checked!==active)cb.checked=active;
  wrap.classList.toggle('v113Added',active);
  const nextLabel=active?'Wybrane ✓':'Dodaj';
  if(span.textContent!==nextLabel)span.textContent=nextLabel;
  cb.setAttribute('aria-label',(active?'Usuń z prezentacji: ':'Dodaj do prezentacji: ')+(node.querySelector('h2,h3,h4')?.textContent?.trim()||'panel danych'));
  wrap.title=active?'Odznacz, aby usunąć tę pozycję z prezentacji':'Dodaj aktualny widok panelu do prezentacji';
 }
 syncAdditionalPicks();
}
function finePick(node,view){
 if(node.dataset.presentationFine==='1')return;
 node.dataset.presentationFine='1';node.classList.add('v113Selectable');
 panelRef(node);
 const wrap=document.createElement('label');wrap.className='v113Pick';wrap.title='Dodaj aktualny widok panelu do prezentacji';
 const cb=document.createElement('input');cb.type='checkbox';
 const span=document.createElement('span');span.textContent='Dodaj';wrap.append(cb,span);
 const action=document.createElement('div');action.className='v114ActionRow';action.append(wrap);node.append(action);
 cb.addEventListener('change',()=>{
  const key=pickKey(node,view),existing=basket.findIndex(item=>item.selectionKey===key);
  if(cb.checked){
   if(existing<0){const entry=refinedSnapshot(node,view);
    if(node.id==='compareSection'&&!entry.structured?.chartData){alert('Wybierz co najmniej dwa powiaty, zanim dodasz porównanie.');cb.checked=false;return;}
    if(node.id==='demogCountyCard'&&!entry.structured?.chartData){alert('Wybierz powiat z dostępnymi danymi ludności.');cb.checked=false;return;}
    entry.selectionKey=key;entry.elementRef=panelRef(node);basket.push(entry);}
  }else if(existing>=0){basket.splice(existing,1);}
  save();
 });
}
function addFineButtons(){
 for(const pane of document.querySelectorAll('.compactPane')){
  const view=pane.dataset.view;
  if(!fineSelectors[view])continue;
  for(const node of fineNodes(pane))finePick(node,view);
 }
 // Wersja v111 zaznaczała całe moduły, co wprowadzało mylące wybory i psuło układ.
 document.querySelectorAll('.v111Pick').forEach(label=>{label.remove();});
 installAdditionalPicks();
 installV120Picks();
 syncPresentationPicks();
}
// v119 — pełne listy zawodów i niezależne mapy oraz trwała deduplikacja.
const OCC_GROUPS=[['D','Deficyt (w tym duży deficyt)'],['R','Równowaga'],['N','Nadwyżka'],['X','Bez oceny']];
function occupationRows(status,county){
 const d=window.PANEL_DATA?.barometr;if(!d?.zawody||!d?.powiaty)return [];
 const names=Object.keys(d.powiaty),pos=names.indexOf(county),regional=county==='__WOJ__';
 return Object.entries(d.zawody).map(([name,rec])=>{
   const values=rec.s||[],matched=v=>status==='D'?(v==='D'||v==='DD'):v===status;
   const count=regional?values.filter(matched).length:(pos>=0&&matched(values[pos])?1:0);
   return {name,branch:rec.branch||'',count};
 }).filter(x=>x.count>0).sort((a,b)=>regional?(b.count-a.count||a.name.localeCompare(b.name,'pl')):a.name.localeCompare(b.name,'pl'));
}
function listSelectionKey(status,county){return JSON.stringify(['occupation-list',status,county]);}
function addOccupationList(status){
 const county=$('countySelect')?.value||'__WOJ__';const group=OCC_GROUPS.find(x=>x[0]===status);
 const key=listSelectionKey(status,county);
 const ix=basket.findIndex(x=>x.selectionKey===key);
 if(ix>=0){basket.splice(ix,1);save();return}
 const regional=county==='__WOJ__';const unit=regional?'Województwo śląskie':county;
 const rows=occupationRows(status,county);
 const item={id:(crypto.randomUUID?.()||Date.now()+'-'+Math.random()),view:'jobs',kind:'lista-zawodow',
   title:'Pełna lista — '+group[1],unit,period:'Barometr Zawodów 2027',selectionKey:key,
   text:regional?'Wskazania w 36 jednostkach — zawód może występować w kilku kategoriach w różnych powiatach.':'Pełna lista grup zawodów z prognozy na 2027 r.',
   structured:{occupationList:{status,county,regional,rows,total:rows.length,label:group[1]}},
   settings:{view:'jobs',county,params:{occupationGroup:status}},
   created:new Date().toISOString(),source:'Barometr Zawodów 2027 — prognoza ekspercka'};
 basket.push(item);save();
}
function mapUnemploymentKey(){return JSON.stringify(['map-unemployment',$('countyUMapDate')?.value||'', $('countyUMapMode')?.value||'', $('countyUMetric')?.value||'rate']);}
function addUnemploymentMap(){
 const svg=$('countyUnempMap');if(!svg||svg.hidden)return;
 const key=mapUnemploymentKey(),index=basket.findIndex(x=>x.selectionKey===key);
 if(index>=0){basket.splice(index,1);save();return}
 const mapDate=$('countyUMapDate')?.value||'',mapMode=$('countyUMapMode')?.value||'level',metric=$('countyUMetric')?.value||'rate';
 if(svg.querySelectorAll('path').length===0){alert('Brak danych mapy do zapisania.');return}
 const cloned=svg.cloneNode(true);cloned.removeAttribute('hidden');cloned.setAttribute('xmlns','http://www.w3.org/2000/svg');
 basket.push({id:(crypto.randomUUID?.()||Date.now()+'-'+Math.random()),kind:'mapa-bezrobocia',view:'unemployment',selectionKey:key,
 title:'Mapa bezrobocia — '+(mapMode==='change'?'zmiana':'poziom')+' — '+(metric==='rate'?'stopa bezrobocia':'liczba bezrobotnych'),
 unit:'Województwo śląskie',period:mapDate,svg:cloned.outerHTML,text:$('countyUStatus')?.innerText||'',
 structured:{map:{kind:'unemployment',mode:mapMode,metric,period:mapDate}},
 settings:{view:'unemployment',county:'__WOJ__',params:{mapDate,mapMode,metric}},created:new Date().toISOString(),
 source:'Zestawienia PUP — dane o bezrobociu'});save();
}
function installAdditionalPicks(){
 if(!$('v119OccupationLists')&&$('jobStatusTabs')){
  const container=document.createElement('div');container.id='v119OccupationLists';container.className='v119Lists';
  const heading=document.createElement('div');heading.className='v119ListsIntro';heading.innerHTML='<b>Pełne listy zawodów do prezentacji</b><span>Wybierz kategorię. Wszystkie zawody zostaną podzielone na kolejne slajdy.</span>';
  const options=document.createElement('div');options.className='v119ListOptions';
  OCC_GROUPS.forEach(([status,label])=>{
    const row=document.createElement('label');row.className='v119ListPick';row.dataset.status=status;
    const check=document.createElement('input');check.type='checkbox';check.setAttribute('aria-label','Dodaj pełną listę: '+label);
    const text=document.createElement('span');text.textContent=label;
    const count=document.createElement('small');count.className='v119ListCount';
    row.append(check,text,count);check.addEventListener('change',()=>addOccupationList(status));options.append(row);
  });
  container.append(heading,options);
  $('jobStatusTabs').closest('.section')?.append(container);
 }
 if(!$('v119UnemploymentMapPick')&&$('countyUnempMap')){
  const row=document.createElement('label');row.id='v119UnemploymentMapPick';row.className='v113Pick v119StandaloneMapPick';
  const check=document.createElement('input');check.type='checkbox';check.setAttribute('aria-label','Dodaj aktualną mapę bezrobocia');
  const text=document.createElement('span');text.textContent='Dodaj mapę do prezentacji';row.append(check,text);
  const foot=document.createElement('div');foot.className='v123ChartFooter v123UnempMapFooter';
  $('countyUnempMap').insertAdjacentElement('afterend',foot);foot.append(row);
  check.addEventListener('change',addUnemploymentMap);
 }
 syncAdditionalPicks();
}
function syncAdditionalPicks(){
 const county=$('countySelect')?.value||'__WOJ__';
 document.querySelectorAll('.v119ListPick').forEach(el=>{
  const status=el.dataset.status,active=basket.some(x=>x.selectionKey===listSelectionKey(status,county));
  const cb=el.querySelector('input');if(cb)cb.checked=active;
  el.classList.toggle('v113Added',active);
  const count=occupationRows(status,county).length;
  el.querySelector('small').textContent=`${count} grup`;
  el.querySelector('span').textContent=active?'Wybrane ✓':(OCC_GROUPS.find(x=>x[0]===status)?.[1]||status);
 });
 const map=$('v119UnemploymentMapPick');if(map){
  const active=basket.some(x=>x.selectionKey===mapUnemploymentKey());
  map.querySelector('input').checked=active;map.classList.toggle('v113Added',active);
  map.querySelector('span').textContent=active?'Wybrane ✓':'Dodaj mapę do prezentacji';
  map.hidden=Boolean($('countyUnempMap')?.hidden);
  if(map.parentElement?.classList.contains('v123ChartFooter'))map.parentElement.hidden=map.hidden;
 }
 v120Sync();
}

// v120 - Unikatowe widoki wykresów i dedykowany wybór mapy zawodu.
// Wykresy mogą być przełączane wewnętrznymi zakładkami, przyciskami lub selektorami.
const V120_CHARTS=[
 ['trendChart','trends','Trend Barometru 2024–2027'],
 ['pupBars','unemployment','Struktura bezrobotnych'],
 ['pupTrendChart','unemployment','Historia bezrobocia'],
 ['countyUnempChart','unemployment','Bezrobocie w powiatach – wykres'],
 ['gusUnempChart','gus','Bezrobocie – GUS'],
 ['gusBaelChart','gus','BAEL – Śląskie na tle Polski'],
 ['gusRegonChart','gus','Podmioty gospodarcze REGON'],
 ['demogLineChart','gus','Demografia powiatowa – ludność'],
 ['regionalNationalChart','gus','Śląskie na tle Polski – dynamika'],
 ['regionalHistoryPanel','gus','Historia wskaźnika gospodarczego']
];
function v120Visible(node){
 if(!node||node.hidden)return false;
 let parent=node.parentElement;while(parent&&!parent.classList?.contains('compactPane')){if(parent.hidden)return false;parent=parent.parentElement;}
 if(node.id==='countyUnempChart'&&document.querySelector('#countyUnempModule [data-cu-view].active')?.dataset.cuView==='map')return false;
 return true;
}
function v120ChartTitle(node,base){
 const view=node.closest('.compactPane')?.dataset.view;
 const scope=node.closest('.gusCard,#trendSection,#pupStructureModule,#countyUnempModule')||node;
 let bits=[];
 if(view==='trends')bits=[...scope.querySelectorAll('.trendBtn.active,.trendModeBtn.active')].map(b=>b.textContent.trim());
 else if(node.id==='pupBars')bits=[document.querySelector('#pupStructureModule [data-pup-group].active')?.textContent?.trim(),$('pupPopulation')?.selectedOptions?.[0]?.textContent?.trim(),$('pupUnit')?.selectedOptions?.[0]?.textContent?.trim(),$('pupPeriod')?.selectedOptions?.[0]?.textContent?.trim()];
 else if(node.id==='pupTrendChart')bits=[$('pupTrendMetric')?.selectedOptions?.[0]?.textContent?.trim(),$('pupPopulation')?.selectedOptions?.[0]?.textContent?.trim(),$('pupPeriod')?.selectedOptions?.[0]?.textContent?.trim()];
 else if(node.id==='countyUnempChart')bits=[$('countyUMetric')?.selectedOptions?.[0]?.textContent?.trim(),$('countyUPeriod')?.selectedOptions?.[0]?.textContent?.trim(),$('countyUYear')?.selectedOptions?.[0]?.textContent?.trim()];
 else if(node.id==='regionalHistoryPanel')bits=[node.dataset.metric||''];
 else bits=[...scope.querySelectorAll('button.active,button[aria-pressed="true"]')].filter(b=>!b.closest('.v113Pick,.v120ChartPick')).map(b=>b.textContent.trim());
 bits=bits.filter(Boolean).slice(0,3);
 return (base+(bits.length?' – '+bits.join(' · '):'')).slice(0,150);
}
function v120ImageSvg(svg){
 if(!svg)return '';
 const cloned=svg.cloneNode(true);cloned.setAttribute('xmlns','http://www.w3.org/2000/svg');
 const src=[svg,...svg.querySelectorAll('*')],dest=[cloned,...cloned.querySelectorAll('*')];
 src.forEach((el,i)=>{
  if(!dest[i]||!(el instanceof SVGElement))return;
  const cs=getComputedStyle(el);
  for(const prop of ['fill','stroke','stroke-width','font-size','font-family','font-weight','opacity','color']){
   const v=cs.getPropertyValue(prop);if(v&&v!=='none'&&v!=='normal')dest[i].setAttribute(prop,v);
  }
 });
 return cloned.outerHTML;
}
// v122: capture actual chart data at selection time. This avoids relying on
// SVG screenshots that may become blank after Keynote/PowerPoint conversion.
function v122Numeric(raw){
 const txt=String(raw??'').replace(/\u00a0/g,' ').replace(/\s/g,'').replace('%','').replace(/[^0-9+,.\-]/g,'');
 if(!txt)return NaN;
 const v=Number(txt.replace(',','.'));return Number.isFinite(v)?v:NaN;
}
function v122ChartRows(node){
 const scope=node.id==='compareSection'||node.classList?.contains('compareCard')?node.querySelector('#compareOutput')||node:node;
 const b=[...scope.querySelectorAll('.pupBar')].map(x=>({label:x.querySelector(':scope > span:first-child')?.textContent?.trim(),value:v122Numeric(x.querySelector(':scope > b')?.textContent)}));
 if(b.some(r=>r.label&&Number.isFinite(r.value)))return b.filter(r=>r.label&&Number.isFinite(r.value));
 const compare=[...scope.querySelectorAll('.compareBarItem')].map(x=>({label:x.querySelector('.compareBarName')?.textContent?.trim(),value:v122Numeric(x.querySelector('.compareBarValue')?.textContent)}));
 if(compare.some(r=>r.label&&Number.isFinite(r.value)))return compare.filter(r=>r.label&&Number.isFinite(r.value));
 return [];
}
function v122Series(node){
 const svg=node.matches?.('svg')?node:node.querySelector('svg');
 if(!svg)return null;
 const points=[];
 if(svg.id==='trendChart'){
   for(const el of svg.querySelectorAll('[data-trend-point="1"]')){
     const v=v122Numeric(el.getAttribute('data-value'));
     if(Number.isFinite(v))points.push({label:el.getAttribute('data-year'),series:el.getAttribute('data-area')||'Wartość',value:v});
   }
 }else if(svg.id==='demogLineChart'||node.id==='demogLineChart'||node.id==='demogCountyCard'){
   for(const el of svg.querySelectorAll('circle')){
     const t=el.querySelector('title')?.textContent?.trim()||'';
     const m=t.match(/(20\d\d)\s*:\s*([\d\s\u00a0.,]+)\s*osób/i);
     if(m){const v=v122Numeric(m[2]);if(Number.isFinite(v))points.push({label:m[1],series:'Ludność',value:v})}
   }
 }else if(svg.closest('#pupTrendChart')||node.id==='pupTrendChart'){
   // Prefer source table, not pixel coordinates of a line.
   const container=node.id==='pupTrendChart'?node:svg.closest('#pupTrendChart');
   const tr=[...container.querySelectorAll('.pupHistoryTable tbody tr')];
   tr.reverse().forEach(r=>{const cells=r.querySelectorAll('th,td');const v=v122Numeric(cells[1]?.textContent);if(Number.isFinite(v))points.push({label:cells[0]?.textContent?.trim()||'',series:'Bezrobotni',value:v})});
 }else{
   for(const el of svg.querySelectorAll('circle title')){
     const t=el.textContent||'',m=t.match(/^(.+?)\s*[•·]\s*(20\d\d[-.]\d\d|20\d\d)\s*[•·]\s*([\d\s.,]+)\s*(%|osób)?/i);
     if(m){const v=v122Numeric(m[3]);if(Number.isFinite(v))points.push({series:m[1].trim(),label:m[2],value:v})}
   }
 }
 if(points.length<2)return null;
 const labels=[...new Set(points.map(p=>p.label))];
 const all=[...new Set(points.map(p=>p.series))];
 return {kind:'series',labels,series:all.map(name=>({name,values:labels.map(label=>{const p=points.find(p=>p.series===name&&p.label===label);return p?p.value:null})})),unit:(node.id==='demogLineChart'||node.id==='demogCountyCard')?'osób':$('pupUnit')?.value==='share'&&node.id==='pupBars'?'%':''};
}
function v122ChartData(node){
 const rankings=v122ChartRows(node);
 if(rankings.length)return {kind:'bars',rankings};
 const series=v122Series(node);
 if(series)return series;
 const table=node.querySelector('.compareTable');
 if(table){const th=[...table.querySelectorAll('thead th')].slice(1).map(x=>x.textContent.trim()),first=table.querySelector('tbody tr');if(th.length>=2&&first){const cells=[...first.querySelectorAll('td')].slice(1);const rows=th.map((label,i)=>({label,value:v122Numeric(cells[i]?.textContent)})).filter(x=>Number.isFinite(x.value));if(rows.length>=2)return {kind:'bars',rankings:rows}}}
 return null;
}

function v120ChartSnapshot(node,view,base){
 const item=refinedSnapshot(node,view);item.title=v120ChartTitle(node,base);
 item.kind='wykres';item.settings={...item.settings,chart:node.id,params:pickContext(node,view).params};
 const scope=node.closest('.gusCard,#pupStructureModule,#countyUnempModule,#trendSection')||node;
 if(view==='unemployment')item.unit=(node.closest('#pupStructureModule')?$('pupCounty')?.value:$('countyUCounty')?.value||selectedUnit()).replace('__WOJ__','Województwo śląskie');
 if(view==='gus')item.unit=node.id==='demogLineChart'?($('demogSelect')?.selectedOptions?.[0]?.textContent||'Województwo śląskie'):'Województwo śląskie';
 if(view==='trends'){item.unit=selectedUnit();item.period='2024–2027';}
 const data=v122ChartData(node);
 if(data){
   item.structured={...item.structured,chartData:data};
   if(data.kind==='bars')item.structured.rankings=data.rankings;
 }
 const svg=node.matches('svg')?node:node.querySelector('svg');
 if(svg){item.svg=v120ImageSvg(svg);item.structured={...item.structured,chart:{kind:'svg',label:item.title}}}
 if(node.id==='pupBars'){
  const rows=[...node.querySelectorAll('.pupBar')].map(b=>({label:b.querySelector('span')?.textContent?.trim()||'',value:Number((b.querySelector('b')?.textContent||'').replace(/[^\d,.-]/g,'').replace(',','.'))})).filter(x=>x.label&&Number.isFinite(x.value));
  item.structured={...item.structured,rankings:rows,chart:{kind:'bars',label:item.title}};
 }
 if(node.id==='regionalNationalChart'){
  item.structured={...item.structured,metrics:[...node.querySelectorAll('.regionalNationalRow')].flatMap(r=>{
   const head=r.querySelector('.regionalNationalRowHead')?.textContent?.replace('▾','').trim()||'';
   return [...r.querySelectorAll('.regionalNationalLine')].map(l=>({label:head+' · '+(l.querySelector('span')?.textContent||''),value:l.querySelector('strong')?.textContent||'',detail:'Zmiana rok do roku'}));
  }).filter(z=>z.label&&z.value)};
 }
 return item;
}
function v120Toggle(node,view,base){
 const key=pickKey(node,view),index=basket.findIndex(x=>x.selectionKey===key);
 if(index>=0){basket.splice(index,1)}
 else{
  if(!v120Visible(node))return;
  const snap=v120ChartSnapshot(node,view,base);snap.selectionKey=key;snap.elementRef=panelRef(node);
  const hasData=Boolean(snap.structured?.chartData || (snap.svg&&snap.svg.length>350) || snap.png||snap.structured?.rankings?.length||snap.structured?.metrics?.length);
  // Nie dodawaj pustego SVG ani panelu z komunikatem zamiast danych.
  if(node.id==='demogLineChart' && node.querySelectorAll('polyline').length===0 && node.querySelectorAll('circle').length===0){alert('Brak zweryfikowanego szeregu ludności dla wybranego powiatu.');return;}
  if(node.id==='pupBars' && !node.querySelector('.pupBar')){alert('Brak danych struktury bezrobocia dla wybranego okresu.');return;}
  if(node.id==='pupTrendChart' && (!snap.structured?.chartData?.series?.length)){alert('Brak danych historii dla wybranego okresu.');return;}
  if(!hasData){alert('W tym wariancie brakuje danych do wykresu.');return}
  basket.push(snap);
 }
 save();
}
function v120MapTitle(){
 const occupation=$('occupationSelect')?.selectedOptions?.[0]?.textContent?.trim();
 if($('occupationSelect')?.value)return 'Mapa zawodu: '+occupation;
 const mode=document.querySelector('.modeButtons .btn.active[data-mode]');
 return 'Mapa: '+(mode?.textContent?.trim()||'województwo śląskie');
}
function v120AddMap(){
 const node=document.querySelector('#atlasMap .mapStudioCard');if(!node)return;
 const key=pickKey(node,'map'),index=basket.findIndex(x=>x.selectionKey===key);
 if(index>=0){basket.splice(index,1)}
 else{
  const item=refinedSnapshot(node,'map');if(!item.svg){alert('Mapa nie została jeszcze wczytana.');return}
  item.title=v120MapTitle();item.unit='Województwo śląskie';item.selectionKey=key;item.elementRef=panelRef(node);
  item.structured.map.occupation=$('occupationSelect')?.value||'';
  item.structured.map.legend= v120MapTitle();
  basket.push(item);
 }
 save();
}
function v120Sync(){
 document.querySelectorAll('.v120ChartPick').forEach(wrap=>{
  const node=$(wrap.dataset.chartId);if(!node)return;
  const active=basket.some(x=>x.selectionKey===pickKey(node,wrap.dataset.view));
  wrap.querySelector('input').checked=active;wrap.classList.toggle('v113Added',active);
  const text=wrap.querySelector('span');text.textContent=active?'Wybrany ✓':'Dodaj ten wykres';
  wrap.title=v120ChartTitle(node,wrap.dataset.base||'Wykres');
  wrap.hidden=!v120Visible(node);
  if(wrap.parentElement?.classList.contains('v123ChartFooter'))wrap.parentElement.hidden=wrap.hidden;
 });
 const map=$('v120MapPick');if(map){
  const node=document.querySelector('#atlasMap .mapStudioCard'),active=node&&basket.some(x=>x.selectionKey===pickKey(node,'map'));
  map.querySelector('input').checked=Boolean(active);map.classList.toggle('v113Added',Boolean(active));
  map.querySelector('.v120MapName').textContent=v120MapTitle();
  map.querySelector('.v120MapAction').textContent=active?'Mapa wybrana ✓':'Dodaj tę mapę';
  const chooser=$('v120ChooseOccupation');if(chooser)chooser.textContent=$('occupationSelect')?.value?'Zmień wybrany zawód':'Wybierz zawód, aby pokazać jego mapę';
 }
}
function installV120Picks(){
 const mapNode=document.querySelector('#atlasMap .mapStudioCard');
 if(mapNode&&!$('v120MapPick')){
  const row=document.createElement('label');row.id='v120MapPick';row.className='v120MapPick';
  row.innerHTML='<span class="v120MapText"><strong>Mapa do prezentacji</strong><small class="v120MapName"></small></span><span class="v120MapToggle"><input type="checkbox" aria-label="Dodaj aktualną mapę lub mapę wybranego zawodu"><span class="v120MapAction">Dodaj tę mapę</span></span>';
  // v123: oba narzędzia mapy mają wspólną stopkę POD mapą, bez zakrywania legendy.
  const footer=document.createElement('div');footer.className='v123MapFooter';
  mapNode.append(footer);
  row.querySelector('input').addEventListener('change',v120AddMap);
  const choose=document.createElement('button');choose.type='button';choose.className='v120ChooseOccupation';choose.id='v120ChooseOccupation';
  choose.textContent='Wybierz zawód, aby pokazać jego mapę';
  footer.append(choose,row);
  choose.addEventListener('click',()=>{
   const filters=$('filterStudio')?.querySelector('details.compactFilters');if(filters)filters.open=true;
   const select=$('occupationSelect');select?.scrollIntoView({block:'center',behavior:'smooth'});select?.focus({preventScroll:true});
  });
 }
 for(const [id,view,base] of V120_CHARTS){
  const node=$(id);if(!node||node.dataset.v120Selectable)continue;
  node.dataset.v120Selectable='1';
  const row=document.createElement('label');row.className='v120ChartPick';row.dataset.chartId=id;row.dataset.view=view;row.dataset.base=base;
  row.innerHTML='<input type="checkbox" aria-label="Dodaj widoczny wariant wykresu do prezentacji"><span>Dodaj ten wykres</span>';
  // v123: jednolite stopki kart. Przycisk zawsze POD wykresem, po jego podpisie.
  // Nie zmieniamy referencji samego wykresu ani jego klucza w prezentacji.
  const footer=document.createElement('div');footer.className='v123ChartFooter';
  const localCard=node.closest('.pupCard,.gusCard,.countyUPanel,.trendCard');
  const host=localCard||((node.id==='regionalNationalChart'||node.id==='regionalHistoryPanel')?node:null);
  if(host){
    host.append(footer);
    host.classList.add('v123HasChartPick');
  }else node.insertAdjacentElement('afterend',footer);
  footer.append(row);
  row.querySelector('input').addEventListener('change',()=>v120Toggle(node,view,base));
 }
 v120Sync();
}
function compactBasket(){
 const seen=new Set();let change=false;
 basket=basket.filter(item=>{const key=item.selectionKey||JSON.stringify([item.view,item.title,item.unit,item.period,item.settings?.params||{},item.svg?.slice(0,150)]);
   if(seen.has(key)){change=true;return false}seen.add(key);return true});
 return change;
}
async function svgPng(svgString){
 if(!svgString)return null;
 try{
  const parser=new DOMParser();const doc=parser.parseFromString(svgString,'image/svg+xml');const svg=doc.documentElement;
  if(svg.tagName.toLowerCase()!=='svg'||doc.querySelector('parsererror'))return null;
  svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
  const vb=svg.getAttribute('viewBox')?.split(/[ ,]+/).map(Number);
  const width=Math.min(1600,Math.max(400,parseFloat(svg.getAttribute('width'))||vb?.[2]||960));
  const height=Math.min(1100,Math.max(200,parseFloat(svg.getAttribute('height'))||vb?.[3]||540));
  svg.setAttribute('width',String(width));svg.setAttribute('height',String(height));
  const blob=new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'});
  const url=URL.createObjectURL(blob);
  try{
   const img=new Image();img.src=url;await img.decode();
   const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
   const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,width,height);ctx.drawImage(img,0,0,width,height);
   return canvas.toDataURL('image/png');
  }finally{URL.revokeObjectURL(url)}
 }catch{return null}
}
let activeGroup='barometr';let activeView='map';
function chooseGroup(group){if(!groups[group])return;const possible=groups[group].map(x=>x[0]);const target=possible.includes(activeView)?activeView:possible[0];chooseView(target)}
function chooseView(view){const group=route[view];if(!group||group==='sources')return;activeView=view;activeGroup=group;document.body.dataset.mainArea=group;document.querySelectorAll('[data-v111-group]').forEach(b=>{const yes=b.dataset.v111Group===group;b.classList.toggle('active',yes);b.setAttribute('aria-selected',String(yes))});const sub=$('v111Subnav');sub.replaceChildren();sub.hidden=groups[group].length===1;for(const [id,label] of groups[group]){const b=document.createElement('button');b.type='button';b.textContent=label;b.className=id===view?'selected':'';b.addEventListener('click',()=>chooseView(id));sub.append(b)}const original=document.querySelector('.compactNavButton[data-view="'+view+'"]');original?.click();if(group==='gospodarka')$('filterStudio').hidden=true;updateCounter()}
function updateCounter(){const b=$('v111BasketButton');if(b)b.textContent=(innerWidth<=767?'Wybrane (':'Moja prezentacja (')+basket.length+')'}
function drawBasket(){compactBasket();const list=$('v111BasketList');if(!list)return;list.replaceChildren();if(!basket.length){const p=document.createElement('p');p.textContent='Nie wybrano jeszcze elementów. Zaznacz „Do prezentacji” przy wybranym wykresie lub panelu.';list.append(p);return}basket.forEach((item,i)=>{const row=document.createElement('div');row.className='v111BasketRow';const cb=document.createElement('input');cb.type='checkbox';cb.checked=item.included!==false;cb.setAttribute('aria-label','Uwzględnij '+item.title);cb.addEventListener('change',()=>{item.included=cb.checked;save()});const info=document.createElement('div');const title=document.createElement('strong');title.textContent=item.title;const meta=document.createElement('small');meta.textContent=item.unit+' • '+item.period+' • '+(viewLabel[item.view]||item.view);info.append(title,meta);const actions=document.createElement('div');actions.className='v111BasketRowActions';for(const [label,offset] of [['↑',-1],['↓',1]]){const b=document.createElement('button');b.type='button';b.textContent=label;b.title='Zmień kolejność';b.disabled=i+offset<0||i+offset>=basket.length;b.onclick=()=>{[basket[i],basket[i+offset]]=[basket[i+offset],basket[i]];save()};actions.append(b)}const remove=document.createElement('button');remove.type='button';remove.textContent='Usuń';remove.onclick=()=>{basket.splice(i,1);save()};actions.append(remove);row.append(cb,info,actions);list.append(row)})}
async function downloadPptx(){const selected=basket.filter(x=>x.included!==false);if(!selected.length){alert('Zaznacz co najmniej jeden element.');return}const Constructor=window.PptxGenJS||window.pptxgen;if(!Constructor){alert('Biblioteka PowerPoint nie została załadowana. Możesz pobrać listę jako JSON.');return}const pptx=new Constructor();pptx.layout='LAYOUT_WIDE';pptx.author='Obserwatorium Rynku Pracy';pptx.subject='Wybrane analizy rynku pracy';pptx.title='Obserwatorium — prezentacja użytkownika';const addText=(slide,txt,x,y,w,h,size=14,opts={})=>slide.addText(txt,{x,y,w,h,fontFace:'Aptos',fontSize:size,color:'1F334E',margin:0,breakLine:false,...opts});let slide=pptx.addSlide();slide.background={color:'F6F8FC'};addText(slide,'OBSERWATORIUM RYNKU PRACY',.8,1.2,11,.4,18,{bold:true,color:'5F718A'});addText(slide,'Wybrane dane i analizy',.8,2,11,.9,34,{bold:true});addText(slide,selected.length+' elementów • '+new Date().toLocaleDateString('pl-PL'),.8,3.2,11,.5,16);for(const item of selected){slide=pptx.addSlide();slide.background={color:'FFFFFF'};addText(slide,item.title,.65,.44,11.8,.75,25,{bold:true});addText(slide,item.unit+' • '+item.period,.65,1.22,11,.36,13,{color:'64748B'});const png=item.png||(await svgPng(item.svg));
if(png){
 try{slide.addImage({data:png,x:.8,y:1.75,w:11.65,h:4.55,sizingContain:true});}
 catch{addText(slide,item.text.slice(0,1200),.7,1.9,11.8,4.3,13,{valign:'top'});}
}else{
 const lines=item.text.replace(/Do prezentacji|Dodano ✓/g,'').slice(0,1300);
 addText(slide,lines,.7,1.9,11.8,4.3,Math.max(11,Math.min(17,lines.length>700?11:15)),{valign:'top'});
}
addText(slide,'Źródło: '+item.source,.7,6.77,11.9,.32,9,{color:'62758C'});}await pptx.writeFile({fileName:'Obserwatorium_wybrane_analizy.pptx'})}
function downloadJson(){const blob=new Blob([JSON.stringify({schema:'obserwatorium-prezentacja/1',selected:basket},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='obserwatorium-zaznaczenia.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
function init(){const original=document.querySelector('.chapterRailInner');if(!original||!window.COMPACT_LAYOUT){setTimeout(init,150);return}const rail=document.querySelector('.chapterRail');rail?.classList.add('v111Rail');const shell=$('siteHeader');const toolbar=document.createElement('div');toolbar.className='v111Toolbar';toolbar.innerHTML='<div class="v111MainTabs" role="tablist" aria-label="Główne obszary"></div><div class="v111Presentation"><button type="button" id="v111BasketButton"></button></div>';
for(const group of Object.keys(groups)){const b=document.createElement('button');b.type='button';b.dataset.v111Group=group;b.setAttribute('role','tab');b.textContent=labels[group];b.addEventListener('click',()=>chooseGroup(group));toolbar.querySelector('.v111MainTabs').append(b)}shell.insertAdjacentElement('afterend',toolbar);
const basketWrap=toolbar.querySelector('.v111Presentation');
const headerActions=shell?.querySelector('.headerActions');
const syncBasketPlacement=()=>{if(window.matchMedia('(max-width:767px)').matches&&headerActions){headerActions.append(basketWrap)}else{toolbar.append(basketWrap)}updateCounter()};
window.matchMedia('(max-width:767px)').addEventListener('change',syncBasketPlacement);
syncBasketPlacement();
const line=document.createElement('div');line.id='v111Subnav';line.className='v111Subnav';toolbar.after(line);
const footer=document.createElement('footer');footer.className='v111Footer';footer.innerHTML='<button type="button" id="v111Sources">Źródła danych i metodologia ↓</button>';document.querySelector('.studioContent').append(footer);$('v111Sources').addEventListener('click',()=>{document.querySelector('.compactNavButton[data-view="sources"]')?.click();$('compact-sources').hidden=false;$('compact-sources').scrollIntoView({behavior:'smooth'});});
const dlg=document.createElement('dialog');dlg.id='v111Basket';dlg.className='v111Dialog';dlg.innerHTML='<div class="v111DialogHead"><div><span>KOMPOZYCJA MATERIAŁÓW</span><h2>Moja prezentacja</h2><p>Zaznaczone elementy zachowują powiat i zapisane w chwili wyboru wartości.</p></div><button type="button" id="v111Close" aria-label="Zamknij">×</button></div><div id="v111BasketList"></div><div class="v111DialogFoot"><button type="button" id="v111Json">Zapisz wybór JSON</button><button type="button" id="v111Generate">Generuj PPTX</button></div>';document.body.append(dlg);$('v111BasketButton').onclick=()=>{drawBasket();dlg.showModal()};$('v111Close').onclick=()=>dlg.close();dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});$('v111Json').onclick=downloadJson;$('v111Generate').onclick=()=>window.OBS_DECK_V118?window.OBS_DECK_V118(basket):downloadPptx();
const legacy=document.querySelectorAll('.mobileBottomNav,.mobileMoreSheet');legacy.forEach(x=>x.setAttribute('data-v111-legacy','1'));
const mobileNav=document.createElement('nav');mobileNav.className='v111MobileNav';mobileNav.setAttribute('aria-label','Główne obszary');for(const group of Object.keys(groups)){const b=document.createElement('button');b.type='button';b.textContent=labels[group];b.dataset.v111Mobile=group;b.onclick=()=>chooseGroup(group);mobileNav.append(b)}document.body.append(mobileNav);
const observed=new MutationObserver(()=>{const sel=document.querySelector('.compactNavButton.active')?.dataset.view;if(sel&&route[sel]&&route[sel]!=='sources'&&sel!==activeView)chooseView(sel);});observed.observe(original,{attributes:true,subtree:true,attributeFilter:['class']});
chooseView('map');addFineButtons();updateCounter();drawBasket();window.addEventListener('pageshow',()=>{addFineButtons();updateCounter();syncPresentationPicks()});
document.addEventListener('change',e=>{if(e.target.closest('.compactPane')||e.target.id==='countySelect'||e.target.id==='occupationSelect')requestAnimationFrame(syncPresentationPicks)},true);
document.addEventListener('click',e=>{if(e.target.closest('[data-pup-group],[data-pup-index],[data-mobile-chart],[data-mode],[data-cu-view],.trendBtn,.trendModeBtn,.gusChartSwitch button,.jobStatusTab'))setTimeout(syncPresentationPicks,60)},true);
const observer=new MutationObserver(()=>{clearTimeout(window.__v113PickTimer);window.__v113PickTimer=setTimeout(addFineButtons,250)});for(const id of ['compact-unemployment','compact-gus','compact-trends','compact-jobs','compact-rankings','compact-map']){const n=$(id);if(n)observer.observe(n,{childList:true,subtree:true})}window.OBSERWATORIUM_PRESENTATION={get items(){return basket}};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
