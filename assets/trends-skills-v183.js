/* BZ2027 v183: trendy i kompetencje. Regionalne badania firm z prezentacji WUP
   „Rynek pracy województwa śląskiego - wrzesień 2026”, slajdy 23-30.
   Powiaty: WYŁĄCZNIE odniesienia do zawodów z Barometru Zawodów 2027.
   Odsetki regionalne NIE są przypisywane powiatom. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const digital=[
  ['Cyberbezpieczeństwo',41.9],['Systemy ERP / CRM',31.3],['Sztuczna inteligencja',30.0],['Analiza danych / BI / Excel',24.0],['Automatyzacja procesów',22.1]
];
const green=[
  ['Rozwiązania energooszczędne',34.3],['Technologie OZE',28.3],['Audyty energetyczne',19.5],['Prawo środowiskowe',17.9],['GOZ i recykling',16.4]
];
const sources={digital:'WUP Katowice / Grupa BST, badanie pracodawców 2026, N=470. Prezentacja „Rynek pracy woj. śląskiego”, slajd 24.',green:'WUP Katowice / EU-CONSULT / Grupa BST, badanie przedsiębiorstw 2025, N=513. Prezentacja „Rynek pracy woj. śląskiego”, slajd 26.',county:'Barometr Zawodów 2027, oceny 168 grup zawodów w 36 powiatach województwa śląskiego.'};
const topics=[
  {id:'digital',tag:'TECHNOLOGIE',name:'Cyfryzacja i AI',accent:'#3868c0',soft:'#e9efff',text:'Bezpieczeństwo informacji, analiza danych, automatyzacja zadań oraz wykorzystanie AI w istniejących procesach.',examples:'Analityk danych, specjalista cyberbezpieczeństwa, programista aplikacji biznesowych'},
  {id:'green',tag:'TRANSFORMACJA',name:'Zielona gospodarka',accent:'#188978',soft:'#e7f7f1',text:'Efektywność energetyczna, infrastruktura OZE, modernizacja techniczna i ograniczanie zasobo- oraz energochłonności.',examples:'Technik OZE, audytor energetyczny, specjalista recyklingu'},
  {id:'industry',tag:'PRZEMYSŁ I USŁUGI',name:'Przemiany istniejących zawodów',accent:'#a66c21',soft:'#fff2da',text:'Nowe narzędzia i procedury w produkcji, logistyce i usługach. Zmieniają się zadania, niekoniecznie nazwy stanowisk.',examples:'Mechatronik, automatyk, specjalista utrzymania ruchu'},
  {id:'care',tag:'DEMOGRAFIA',name:'Usługi dla ludzi i opieka',accent:'#8557b9',soft:'#f2eafd',text:'Starzenie się mieszkańców i zmiana potrzeb usług publicznych nadają znaczenie zawodom zdrowotnym, opiekuńczym i edukacyjnym.',examples:'Pielęgniarka, fizjoterapeuta, opiekun osoby starszej'}
];
const localPatterns={
 digital: /informat|programist|telekomunik|administrator|sieci|baz danych|systemów komputerowych|elektronik|automatyk|mechatronik|analityk/i,
 green: /elektryc|energetyk|instalat|monter instalacji|budowlan|dekarz|cieśl|hydraul|środowisk|odpad|recykl|kominiarz/i,
 industry: /mechanik|spawacz|ślusarz|maszyn|produkcyj|elektromechanik|kierow|magazyn|logist|operator|technik|inżynier/i,
 care: /lekarz|pielęgniark|położn|fizjoterap|rehabilit|opiekun|psycholog|terapeut|nauczyciel|pedagog|ratownik medycz/i
};
const localImplications={
 digital:['W zawodach technicznych i informatycznych warto obserwować wymagania związane z obsługą systemów, danymi i cyberbezpieczeństwem.','Brak lokalnego deficytu w wybranych zawodach cyfrowych nie oznacza braku postępu technologicznego. Dane Barometru nie mierzą znajomości AI ani konkretnych narzędzi.'],
 green:['Zmiany w energetyce i budownictwie mogą podnosić znaczenie obsługi nowych instalacji, diagnostyki i rozwiązań energooszczędnych.','Ocena zawodu w Barometrze nie pozwala wyznaczyć liczby przyszłych miejsc pracy w OZE. Potrzebne są także dane o faktycznych inwestycjach i ofertach.'],
 industry:['Transformacja procesów może zmieniać wymagania wobec pracowników produkcji, transportu i logistyki, niezależnie od liczby nowych stanowisk.','W prognozie zawodowej nie widać miary automatyzacji lokalnych firm. Warto sprawdzać, jak zmieniają się zadania i wymagania w istniejących miejscach pracy.'],
 care:['W zawodach zdrowotnych, opiekuńczych i edukacyjnych ważne mogą być zarówno dostępność kandydatów, jak i organizacja pracy oraz utrzymanie kadr.','Dane demograficzne sygnalizują kontekst zmian potrzeb mieszkańców, ale nie wyznaczają automatycznie liczby etatów w opiece czy ochronie zdrowia.']
};
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function fmt(v){return v.toFixed(1).replace('.',',')}
function addButton(label,onClick,cls){const b=el('button','ts183Button '+(cls||''),label);b.type='button';b.addEventListener('click',onClick);return b}
function addMaterial(config,button){
 const service=window.OBSERWATORIUM_PRESENTATION;
 if(typeof service?.addTextAnalysis!=='function'){alert('Moduł „Moje materiały” jeszcze się uruchamia. Spróbuj ponownie.');return}
 if(service.addTextAnalysis(config)){button.textContent='Dodano ✓';setTimeout(()=>{button.textContent=button.dataset.label||'Dodaj do prezentacji'},1700)}
}
function regionCard(title,eyebrow,series,source,id,color){
 const card=el('section','ts183Card ts183Graph');card.dataset.source=id;
 const head=el('div','ts183CardHead');const intro=el('div');intro.append(el('span','ts183Eyebrow',eyebrow),el('h3','',title));head.append(intro);
 const button=addButton('Dodaj wykres',()=>{
  addMaterial({selectionKey:'skills-v183-chart-'+id,title,view:'skills',unit:'Województwo śląskie',period:id==='digital'?'badanie 2026':'badanie 2025',source,
   text:'Udział badanych firm wskazujących kompetencję (%). '+series.map(([name,value])=>`${name}: ${fmt(value)}%`).join('; ')+'\nWyniki badania regionalnego, nie pomiar w powiecie.',
   exportMeta:{period:id==='digital'?'2026':'2025',measure:'Udział badanych firm wskazujących kompetencję',unit:'%',note:'Wyniki badań regionalnych. Nie są powiatową prognozą ani liczbą ofert.'},
   structured:{chartData:{kind:'bars',rankings:series.map(([label,value])=>({label,value})),unit:'%'},signals:[{label:'Zakres',detail:'Regionalne badanie pracodawców; nie należy przypisywać wartości konkretnym powiatom.'}]}
  },button);
 });button.dataset.label='Dodaj wykres';head.append(button);card.append(head);
 const bars=el('div','ts183Bars');const max=50;
 series.forEach(([name,value])=>{const row=el('div','ts183BarRow');row.append(el('span','ts183BarName',name));const rail=el('div','ts183BarTrack');const fill=el('div','ts183BarFill');fill.style.width=String(value/max*100)+'%';fill.style.background=color;rail.append(fill);row.append(rail,el('strong','ts183BarValue',fmt(value)+'%'));bars.append(row)});
 card.append(bars,el('p','ts183Fine',source));return card;
}
// The compact county record contains only a SHORT LIST of deficits. The full
// 168 x 36 matrix is authoritative for local occupation statuses.
function jobsFor(county,pattern,status='D'){
 const bar=window.PANEL_DATA?.barometr,order=Object.keys(bar?.powiaty||{}),index=order.indexOf(county);
 if(index<0)return [];
 return Object.entries(bar.zawody||{}).filter(([job,row])=>pattern.test(job)&&String(row?.s?.[index]||'')===status).map(([job])=>job).slice(0,3);
}
function regionalIntro(root){
 const top=el('div','ts183Heading');top.append(el('div','ts183Eyebrow','TRENDY I KOMPETENCJE · WOJEWÓDZTWO ŚLĄSKIE'),el('h2','','Jak zmienia się praca?'),el('p','', 'Cyfryzacja, zielona transformacja i demografia wpływają na zadania wykonywane w wielu zawodach. Poniższe wyniki pochodzą z badań pracodawców w regionie.'));
 root.append(top);
 const note=el('div','ts183Note');note.append(el('strong','','Ważne rozróżnienie'),el('span','','Odsetki opisują odpowiedzi firm biorących udział w badaniach, a nie udział pracowników posiadających dane kompetencje. Nie są to wartości dla poszczególnych powiatów.'));root.append(note);
 const region=el('div','ts183Pair');region.append(regionCard('Kompetencje cyfrowe w badaniu pracodawców','BADANIE 470 FIRM · 2026',digital,sources.digital,'digital','#4972d0'),regionCard('Kompetencje zielonej gospodarki','BADANIE 513 FIRM · 2025',green,sources.green,'green','#229887'));root.append(region);
 const subs=el('div','ts183SubHeading');subs.append(el('h3','','Cztery obszary zmian'),el('p','','Przykłady kierunków rozwoju zawodów z prezentacji WUP. Nie są listą stwierdzonych lokalnych deficytów.'));root.append(subs);
 const grid=el('div','ts183TopicGrid');topics.forEach(topic=>{const c=el('article','ts183Topic');c.style.setProperty('--ts-accent',topic.accent);c.style.setProperty('--ts-soft',topic.soft);c.append(el('span','ts183Tag',topic.tag),el('h4','',topic.name),el('p','',topic.text),el('small','','Przykłady: '+topic.examples));grid.append(c)});root.append(grid);
}
function countyContent(root){
 const box=el('section','ts183County');box.id='ts183County';
 const header=el('div','ts183CountyHeader');const titles=el('div');titles.append(el('span','ts183Eyebrow','ZNACZENIE TRENDÓW DLA POWIATU'),el('h2','','Perspektywa lokalna'));header.append(titles);
 const selectWrap=el('label','ts183SelectWrap');selectWrap.append(el('span','','Powiat / miasto'));const picker=el('select','ts183Select');picker.id='ts183CountySelect';const option=el('option','', 'Wybierz powiat lub miasto…');option.value='';picker.append(option);selectWrap.append(picker);header.append(selectWrap);box.append(header);
 const local=el('div','ts183CountyResult');local.id='ts183CountyResult';box.append(local);root.append(box);
 const data=window.PANEL_DATA?.barometr?.powiaty||{};Object.keys(data).sort((a,b)=>a.localeCompare(b,'pl')).forEach(name=>{const opt=el('option','',name);opt.value=name;picker.append(opt)});
 function draw(county){local.replaceChildren();if(!county||!data[county]){local.append(el('p','ts183Placeholder','Wybierz jednostkę, aby zobaczyć cztery obszary zmian powiązane z jej prognozą zawodową na 2027 r.'));return}
  const d=data[county];const intro=el('div','ts183CountySynopsis');intro.append(el('strong','',''+county),el('p','',`Barometr Zawodów 2027: ${d.deficit} grup deficytowych (${d.delta_deficit>=0?'+':''}${d.delta_deficit} względem 2026 r.), ${d.surplus} nadwyżkowych. Te oceny odnoszą się do zawodów, nie do umiejętności cyfrowych lub zielonych.`));local.append(intro);
  const cards=el('div','ts183CountyGrid');
  const take=['digital','green','industry','care'];
  take.forEach(type=>{const topic=topics.find(t=>t.id===type);const jobs=jobsFor(county,localPatterns[type]);const card=el('article','ts183CountyCard');card.style.setProperty('--ts-accent',topic.accent);card.style.setProperty('--ts-soft',topic.soft);card.append(el('span','ts183Tag',topic.name));const balanced=jobs.length?[]:jobsFor(county,localPatterns[type],'R');const txt=jobs.length?`W 2027 r. do grup deficytowych zaliczono m.in.: ${jobs.join(', ')}.`:balanced.length?`W grupach związanych z tym obszarem prognozowana jest równowaga, np.: ${balanced.join(', ')}.`:'W prognozie 2027 nie wskazano deficytu w analizowanych tutaj grupach zawodowych.';card.append(el('p','',txt));card.append(el('small','',localImplications[type][jobs.length?0:1]));cards.append(card)});
  local.append(cards);
  const conclusion=el('div','ts183CountyFooter');conclusion.append(el('span','',`Źródło danych lokalnych: ${sources.county} Dane o kompetencjach z badań WUP dotyczą województwa.`));
  const button=addButton('Dodaj analizę powiatu',()=>{const statements=take.map(type=>{const t=topics.find(x=>x.id===type),jobs=jobsFor(county,localPatterns[type]),balanced=jobs.length?[]:jobsFor(county,localPatterns[type],'R');return `${t.name}: ${jobs.length?'Zawody deficytowe: '+jobs.join(', ')+'.':balanced.length?'Równowaga w przykładowych zawodach: '+balanced.join(', ')+'.':'Brak lokalnych deficytów w analizowanych grupach.'} ${localImplications[type][jobs.length?0:1]}`});addMaterial({selectionKey:'skills-v183-county-'+county,title:'Trendy i kompetencje - '+county,view:'skills',unit:county,period:'Barometr Zawodów 2027; kontekst badań regionalnych 2025-2026',source:sources.county+' Badania WUP: N=470 (2026), N=513 (2025).',text:`${county}: ${d.deficit} grup deficytowych, zmiana ${d.delta_deficit>=0?'+':''}${d.delta_deficit} względem 2026 r.; ${d.surplus} nadwyżek.\n\n${statements.join('\n\n')}\n\nWnioski dotyczą znaczenia trendów, nie lokalnego pomiaru kompetencji.`,structured:{signals:statements.map((text,i)=>({label:topics[i].name,detail:text.slice(0,430)}))}},button)},'ts183Primary');button.dataset.label='Dodaj analizę powiatu';conclusion.append(button);local.append(conclusion);
 }
 picker.addEventListener('change',()=>{draw(picker.value);const common=$('countySelect');if(common&&common.value!==picker.value&&picker.value){common.value=picker.value;common.dispatchEvent(new Event('change',{bubbles:true}))}});
 const global=$('countySelect');const sync=()=>{if(global&&data[global.value]){picker.value=global.value;draw(global.value)}};
 global?.addEventListener('change',sync);document.addEventListener('panel:county-change',sync);
 if(global&&data[global.value])sync();else draw('');
}
function start(){const pane=$('compact-skills');if(!pane||!window.PANEL_DATA||pane.dataset.trendsSkillsReady)return false;pane.dataset.trendsSkillsReady='true';
 const style=el('style');style.id='ts183Styles';style.textContent=`
 html body.compactUI #compact-skills{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,Arial,sans-serif;color:#1d1d1f;max-width:1440px;min-width:0;}
 html body.compactUI #compact-skills *{box-sizing:border-box}
 #compact-skills .ts183Heading{margin:14px 1px 18px;padding:0 3px}
 #compact-skills .ts183Heading h2,#compact-skills .ts183County h2{font-size:clamp(21px,2.4vw,29px);margin:7px 0 8px;font-weight:710;line-height:1.18;letter-spacing:-.035em;color:#1d1d1f}
 #compact-skills .ts183Heading p{margin:0;color:#687084;line-height:1.56;max-width:780px;font-size:14px}
 #compact-skills .ts183Eyebrow{display:block;font-size:10px;font-weight:750;letter-spacing:.10em;color:#547297;text-transform:uppercase}
 #compact-skills .ts183Note{display:flex;gap:10px;align-items:start;border-radius:13px;padding:13px 17px;background:#eaf2ff;border:1px solid #d6e5fd;color:#22426e;font-size:12px;line-height:1.5;margin-bottom:17px}
 #compact-skills .ts183Note strong{white-space:nowrap}
 #compact-skills .ts183Pair,#compact-skills .ts183TopicGrid,#compact-skills .ts183CountyGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;align-items:stretch}
 #compact-skills .ts183Card,#compact-skills .ts183County,#compact-skills .ts183Topic,#compact-skills .ts183CountyCard{background:#fff;border:1px solid #e3e6ed;border-radius:19px;min-width:0}
 #compact-skills .ts183Card{padding:20px 21px 17px;box-shadow:0 7px 25px rgba(30,51,89,.045)}
 #compact-skills .ts183CardHead{display:flex;gap:8px;justify-content:space-between;align-items:start;margin-bottom:24px}
 #compact-skills .ts183Card h3{font-size:16px;line-height:1.25;margin:5px 0 0;color:#1d1d1f;font-weight:700}
 #compact-skills .ts183Button{font:inherit;font-size:11px;font-weight:650;border-radius:11px;min-height:34px;padding:6px 12px;border:1px solid #ccd9ed;color:#1d5391;background:#fff;cursor:pointer;white-space:nowrap}
 #compact-skills .ts183Button:hover{background:#edf4ff}
 #compact-skills .ts183Primary{background:#e8f1ff;color:#1158b8}
 #compact-skills .ts183Bars{display:grid;gap:15px}
 #compact-skills .ts183BarRow{display:grid;grid-template-columns:minmax(110px,1.2fr) minmax(75px,1fr) 49px;align-items:center;gap:9px;font-size:11px}
 #compact-skills .ts183BarName{color:#31405a;font-weight:600;line-height:1.25}
 #compact-skills .ts183BarTrack{height:11px;background:#edf1f7;border-radius:99px;overflow:hidden}
 #compact-skills .ts183BarFill{height:100%;border-radius:99px}
 #compact-skills .ts183BarValue{font-size:12px;color:#25405e;text-align:right;font-variant-numeric:tabular-nums}
 #compact-skills .ts183Fine{font-size:10px;line-height:1.4;color:#6e7788;margin:21px 0 0}
 #compact-skills .ts183SubHeading{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin:27px 1px 13px}
 #compact-skills .ts183SubHeading h3{font-size:19px;font-weight:710;margin:0}
 #compact-skills .ts183SubHeading p{font-size:12px;line-height:1.45;color:#717d90;margin:0;max-width:620px}
 #compact-skills .ts183Topic{padding:18px 20px;border-left:4px solid var(--ts-accent);background:linear-gradient(120deg,var(--ts-soft) 0%,white 63%)}
 #compact-skills .ts183Tag{display:inline-flex;background:var(--ts-soft,#eaf1fc);color:var(--ts-accent,#3868c0);padding:4px 9px;border-radius:8px;font-size:10px;font-weight:750;letter-spacing:.025em}
 #compact-skills .ts183Topic h4{font-size:16px;margin:10px 0 7px;color:#1d1d1f}
 #compact-skills .ts183Topic p{margin:0 0 9px;font-size:12.5px;line-height:1.54;color:#354864}
 #compact-skills .ts183Topic small{font-size:11px;line-height:1.42;color:#727c8c}
 #compact-skills .ts183County{margin-top:25px;padding:23px 22px;box-shadow:0 7px 25px rgba(30,51,89,.045)}
 #compact-skills .ts183CountyHeader{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:16px}
 #compact-skills .ts183SelectWrap{min-width:min(100%,320px);display:grid;gap:6px;color:#67758a;font-size:12px;font-weight:650}
 #compact-skills .ts183Select{font:inherit;font-size:13px;color:#1f385a;border:1px solid #b9cbe3;border-radius:12px;background:#fff;padding:10px 13px;width:100%;min-height:43px}
 #compact-skills .ts183Placeholder{margin:0;background:#f5f7fb;color:#69778c;border-radius:11px;padding:19px;font-size:13px}
 #compact-skills .ts183CountySynopsis{padding:13px 17px;border-radius:12px;background:#f2f5fa;margin-bottom:14px;display:flex;gap:14px;align-items:baseline}
 #compact-skills .ts183CountySynopsis strong{color:#1c3a66;white-space:nowrap;font-size:14px}
 #compact-skills .ts183CountySynopsis p{margin:0;color:#475a73;line-height:1.55;font-size:12px}
 #compact-skills .ts183CountyCard{padding:15px 17px;border-left:3px solid var(--ts-accent)}
 #compact-skills .ts183CountyCard p{font-size:13px;line-height:1.52;margin:11px 0;color:#1f3651;font-weight:570}
 #compact-skills .ts183CountyCard small{font-size:11.5px;color:#67768a;line-height:1.52;display:block}
 #compact-skills .ts183CountyFooter{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-top:15px}
 #compact-skills .ts183CountyFooter span{font-size:10.5px;line-height:1.5;color:#6b7788;max-width:74%}
 @media(max-width:900px){#compact-skills .ts183Pair{grid-template-columns:1fr}}
 @media(max-width:767px){#compact-skills .ts183TopicGrid,#compact-skills .ts183CountyGrid{grid-template-columns:1fr}#compact-skills .ts183CardHead,#compact-skills .ts183CountyHeader,#compact-skills .ts183SubHeading,#compact-skills .ts183CountySynopsis{flex-direction:column;align-items:stretch}#compact-skills .ts183CountySynopsis{gap:5px}#compact-skills .ts183Note{flex-direction:column}#compact-skills .ts183County{padding:16px}#compact-skills .ts183Card{padding:16px}#compact-skills .ts183CountyFooter{flex-direction:column;align-items:stretch}#compact-skills .ts183CountyFooter span{max-width:100%}#compact-skills .ts183BarRow{grid-template-columns:minmax(90px,1fr) minmax(55px,.7fr) 48px}}
 `;
 document.head.appendChild(style);
 const root=el('div','ts183Root');pane.append(root);regionalIntro(root);countyContent(root);
 window.BZ_TRENDS_SKILLS={digital,green,get county(){return $('ts183CountySelect')?.value||''},selectCounty(name){const picker=$('ts183CountySelect');if(picker&&Array.from(picker.options).some(o=>o.value===name)){picker.value=name;picker.dispatchEvent(new Event('change'))}}};
 return true;
}
let count=0;function boot(){if(start())return;if(++count<100)setTimeout(boot,120)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
