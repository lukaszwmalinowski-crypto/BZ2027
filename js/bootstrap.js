/* Studio v24 — odczyt bez pytania o pliki.
   GitHub Pages: zawsze aktualny data/dane.json (bez cache).
   Plik index.html otwarty z dysku: read-only migawka startowa osadzona w HTML.
   Awaria sieci: migawka z czytelnym ostrzezeniem o jej mozliwej nieaktualnosci.
*/
(async function(){
  'use strict';
  const host=document.querySelector('.headerInner > div:first-child') || document.querySelector('.header') || document.body;
  const status=document.createElement('div');
  status.className='dataStatusLine';
  status.id='dataLoadStatus';
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  status.textContent='Wczytywanie danych…';
  host.appendChild(status);

  function label(s,problem=false){status.textContent=s;status.classList.toggle('dataStatusError',problem)}
  function snapshot(){
    const el=document.getElementById('panelInitialSnapshot');
    if(!el)throw new Error('Brak migawki poczatkowej danych.');
    return JSON.parse(el.textContent);
  }
  function validate(data){
    return !!(data && data.barometr && data.barometr.powiaty &&
      Object.keys(data.barometr.powiaty).length===36 && data.barometr.zawody &&
      data.gus && data.powiatBezrobocie);
  }
  async function loadModules(data){
    if(!validate(data))throw new Error('Plik data/dane.json nie zawiera kompletnej struktury panelu.');
    window.PANEL_DATA=data;
    for (const src of ['js/app.js','js/gus.js','js/county.js']){
      await new Promise((resolve,reject)=>{
        const script=document.createElement('script');
        script.src=src;
        script.onload=resolve;
        script.onerror=()=>reject(new Error('Nie mozna uruchomic '+src));
        document.body.appendChild(script);
      });
    }
  }
  try{
    let data,source='remote',warn=false;
    if(location.protocol==='file:'){
      data=snapshot();source='local';
    }else{
      try{
        const response=await fetch('data/dane.json?odswiez='+Date.now(),{cache:'no-store'});
        if(!response.ok)throw new Error('HTTP '+response.status);
        data=await response.json();
        if(!validate(data))throw new Error('Nieprawidlowy format danych');
      }catch(e){
        console.error('[Obserwatorium: aktualna baza danych]',e);
        data=snapshot();source='backup';warn=true;
      }
    }
    label('Przygotowywanie map i wykresów…');
    await loadModules(data);
    const count=Object.keys(data.barometr.powiaty).length;
    const version=data.meta?.wersja ? ' • '+data.meta.wersja : '';
    if(source==='remote') label('Dane aktualne z data/dane.json • '+count+' jednostek'+version);
    else if(source==='local')label('Podgląd lokalny • dane startowe z paczki • '+count+' jednostek. Na GitHub Pages wczytywany jest aktualny dane.json.');
    else label('Nie udało się pobrać aktualnych danych z GitHub. Wyświetlam wbudowaną kopię startową, która może być nieaktualna.',true);
  }catch(e){
    console.error('[Obserwatorium: uruchamianie]',e);
    label('Nie udało się uruchomić panelu: '+e.message,true);
  }
})();
