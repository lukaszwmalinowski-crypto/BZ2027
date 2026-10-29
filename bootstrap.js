/* Studio v32: bundled startup, timeout and explicit PUP schema validation. */
(async function(){
'use strict';
const host=document.querySelector('.headerInner > div:first-child')||document.querySelector('.header')||document.body;
const status=document.createElement('div');status.id='dataLoadStatus';status.className='dataStatusLine';status.setAttribute('role','status');status.setAttribute('aria-live','polite');host.appendChild(status);
const label=(s,error=false)=>{status.textContent=s;status.classList.toggle('dataStatusError',error)};
function validate(data){return !!(data?.barometr?.powiaty&&Object.keys(data.barometr.powiaty).length===36&&data.barometr.zawody&&data.gus&&data.powiatBezrobocie&&Array.isArray(data.strukturaPup?.obserwacje)&&data.strukturaPup.obserwacje.length&&Array.isArray(data.strukturaPup.miesieczne)&&data.strukturaPup.miesieczne.length)}
function snapshot(){const el=document.getElementById('panelInitialSnapshot');if(!el)throw Error('Brak wbudowanej bazy danych.');const data=JSON.parse(el.textContent);if(!validate(data))throw Error('Wbudowana baza danych jest niekompletna.');return data}
async function module(src,bundle){
 if(bundle&&typeof bundle[src]==='string'){
  let failure=null;const onError=e=>{failure=e.error||Error(e.message||'Błąd skryptu '+src)};window.addEventListener('error',onError);
  try{const script=document.createElement('script');script.dataset.panelModule=src;script.textContent=bundle[src]+'\n//# sourceURL='+src+'?v=32-bundle';document.body.appendChild(script)}finally{window.removeEventListener('error',onError)}
  if(failure)throw failure;
 }else await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src+'?v=32';script.onload=resolve;script.onerror=()=>reject(Error('Brak pliku '+src));document.body.appendChild(script)});
}
try{
 label('Wczytywanie danych…');let data=snapshot(),source='embedded',warning='';
 if(location.protocol!=='file:'){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
  try{const response=await fetch(new URL('data/dane.json?odswiez='+Date.now(),document.baseURI),{cache:'no-store',signal:controller.signal});if(!response.ok)throw Error('HTTP '+response.status);const remote=await response.json();if(!validate(remote))throw Error('Pobrana baza nie zawiera pełnej struktury PUP');data=remote;source='remote'}
  catch(error){warning=error.name==='AbortError'?'Serwer nie odpowiedział w ciągu 10 sekund.':'Nie udało się pobrać kompletnej bazy z serwera.';console.warn('[Panel: użyto kompletnej kopii wbudowanej; pobranie z serwera]',error.message)}
  finally{clearTimeout(timer)}
 }
 window.PANEL_DATA=data;label('Przygotowywanie map i wykresów…');
 const embedded=document.getElementById('panelModuleBundle');const bundle=embedded?JSON.parse(embedded.textContent):null;
 for(const src of ['js/app.js','js/gus.js','js/county.js','js/pup.js','js/layout.js'])await module(src,bundle);
 if(!document.getElementById('pupStructureModule'))throw Error('Nie uruchomiła się sekcja danych PUP.');
 const n=data.strukturaPup.obserwacje.length,m=data.strukturaPup.miesieczne.length;
 if(source==='remote')label(`Baza z serwera • ${n.toLocaleString('pl-PL')} zestawień struktury PUP • ${m.toLocaleString('pl-PL')} obserwacji liczby osób • ${data.meta?.wersja||'v32'}`);
 else label(`Dane z paczki (tryb offline/zapasowy) • ${n.toLocaleString('pl-PL')} zestawień struktury PUP • ${m.toLocaleString('pl-PL')} obserwacji liczby osób.`,false);
}catch(error){console.error('[Panel: uruchamianie]',error);label('Nie udało się uruchomić narzędzia: '+error.message,true)}
})();
