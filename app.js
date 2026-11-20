const serviceSymptoms = {
  "pantalla": [
    "¿Se rajó el vidrio? ¿Ves líneas o manchas en la pantalla, o el táctil no responde bien?",
    "Is the glass cracked? Do you see lines or spots, or does the touchscreen stop responding?"
  ],
  "bateria": [
    "¿La batería te dura poco? ¿El porcentaje baja de golpe o el celu se apaga aunque todavía marque carga?",
    "Does the battery drain quickly? Does the percentage drop suddenly or the phone shut off with charge left?"
  ],
  "carga": [
    "¿El cable queda flojo? ¿Solo carga si lo movés o directamente no toma carga?",
    "Does the cable feel loose? Does it only charge when you move it, or not charge at all?"
  ],
  "mantenimiento": [
    "¿El audio se escucha más bajo que antes? ¿Ves suciedad en las rejillas o algún botón se traba?",
    "Is the sound quieter than before? Do you see dirt in the grilles or have a button that sticks?"
  ],
  "software": [
    "¿El celu queda clavado en el logo, se reinicia solo o se te cierran las apps?",
    "Does your phone get stuck on the logo, restart on its own, or keep closing apps?"
  ],
  "diagnostico": [
    "¿El celu no enciende o la falla aparece solo a veces? Contanos qué notás y lo revisamos.",
    "Does your phone refuse to turn on, or does the issue only happen sometimes? Tell us what you notice and we’ll take a look."
  ]
};
const $=id=>document.getElementById(id);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const translations=[...document.querySelectorAll('[data-en]')].map(el=>[el,el.textContent]);
let english=false,busy=false,scene='hero';
const say=(es,en)=>english?en:es;
const brands=['iPhone','Samsung','Motorola','Xiaomi','Otra / No sé'];
const problems=[['No responde el táctil','Touchscreen isn’t responding','M7 2h10v20H7z M7 13l5-5 2 4 3-3'],['Se descarga rápido','Battery drains quickly','M2 6h18v12H2z M22 10v4 M11 8l-3 5h5l-2 3'],['No carga','Won’t charge','M2 7h20v10H2z M8 12h8'],['Mantenimiento','Maintenance','M3 8h18v13H3z M8 8V4h8v4 M3 13h18'],['Software','Software','M8 5l-6 7 6 7 M16 5l6 7-6 7'],['Diagnóstico','Diagnosis','M18 9a8 8 0 1 1-16 0a8 8 0 1 1 16 0 M16 16l6 6'],['No sé qué le pasa','Not sure what’s wrong','M4 12h1 M11 12h1 M18 12h1'],['No enciende','Won’t turn on','M12 2v8 M6 5a8 8 0 1 0 12 0']];
const serviceArt = [
 ['pantalla', 'Pantalla', 'Screen'],
 ['bateria', 'Batería', 'Battery'],
 ['carga', 'Pin de carga', 'Charging port'],
 ['mantenimiento', 'Mantenimiento', 'Maintenance'],
 ['software', 'Software', 'Software'],
 ['diagnostico', 'Diagnóstico', 'Diagnosis'],
];
const selected=new Set();
function icon(path){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+path+'"/></svg>'}
function go(id){$(id).scrollIntoView({behavior:reduced.matches?'auto':'smooth'});}
function setScene(name){
 if(scene===name&&document.querySelector('.backdrop.active').style.backgroundImage)return;
 scene=name;const old=document.querySelector('.backdrop.active'),next=document.querySelector('.backdrop:not(.active)');
 next.style.backgroundImage='url("assets/'+name+'.jpg")';next.classList.add('active');old.classList.remove('active');
}
function renderControls(){
 const value=$('brand').value;$('brand').replaceChildren(new Option(say('Elegí una marca','Choose a brand'),''));
 brands.forEach(name=>$('brand').add(new Option(name==='Otra / No sé'?say(name,'Other / Unsure'):name,name)));$('brand').value=value;
 $('brands').replaceChildren();brands.forEach(name=>{const b=document.createElement('div');b.className='brand';
 const slug={iPhone:'apple',Samsung:'samsung',Motorola:'motorola',Xiaomi:'xiaomi'}[name];
 if(slug){const img=document.createElement('img');img.src='assets/'+slug+'.svg';img.alt='';img.onerror=()=>img.remove();b.append(img);}
 const span=document.createElement('span');span.textContent=name==='Otra / No sé'?say(name,'Other / Unsure'):name;b.append(span);$('brands').append(b);});
 $('services').replaceChildren();$('issues').replaceChildren();
 problems.forEach(([es,en,path],i)=>{
  const issue=document.createElement('button');issue.type='button';issue.className='issue';issue.innerHTML=icon(path);issue.append(document.createTextNode(say(es,en)));issue.setAttribute('aria-pressed',String(selected.has(es)));
  issue.onclick=()=>{if(selected.has(es))selected.delete(es);else selected.add(es);issue.setAttribute('aria-pressed',String(selected.has(es)));sync()};$('issues').append(issue);
  const artwork = serviceArt[i];
  if (artwork) {
   const [slug, label, labelEn] = artwork;
   const service = document.createElement('button');
   service.type = 'button';
   service.className = 'service';
   const photo = document.createElement('img');
   photo.className = 'service-art';
   photo.src = 'assets/servicios/' + slug + '.png';
   photo.alt = '';
   photo.width = photo.height = 508;
   photo.loading = 'lazy';
   photo.decoding = 'async';
   service.append(photo);
   const title = document.createElement('span');
   title.textContent = say(label, labelEn);
   service.append(title);
   const card = document.createElement('div');
   card.className = 'service-card';
   const back = document.createElement('span');
   back.className = 'service-back';
   const heading = document.createElement('strong');
   heading.textContent = title.textContent;
   const detail = document.createElement('span');
   detail.textContent = say(...serviceSymptoms[slug]);
   back.append(heading, detail);
   back.setAttribute('aria-hidden', 'true');
   service.setAttribute('aria-pressed', 'false');
   service.setAttribute('aria-label', title.textContent + ' · ' + say('Ver fallas', 'See common issues'));
   service.setAttribute('aria-description', detail.textContent);
   service.onclick = () => {
    const open = card.classList.toggle('is-flipped');
    service.setAttribute('aria-pressed', String(open));
   };
   const front = document.createElement('span');
   front.className = 'service-front';
   const cue = document.createElement('span');
   cue.className = 'service-cue';
   cue.textContent = say('Ver fallas ›', 'See common issues ›');
   front.append(photo, title, cue);
   const rotor = document.createElement('span');
   rotor.className = 'service-rotor';
   rotor.append(front, back);
   service.replaceChildren(rotor);
   card.append(service);
   $('services').append(card);
  }
 });
}
function content(){return [[$('brand').value,$('unknown').checked?say('Modelo sin indicar','Model unspecified'):$('model').value].filter(Boolean).join(' · '),[...selected].map(p=>say(p,problems.find(x=>x[0]===p)[1])).join(' · ')+($('description').value?' — '+$('description').value:''),[$('name').value,$('phone').value,$('email').value].filter(Boolean).join(' · ')];}
function summary(target,editable){target.replaceChildren();content().forEach((value,i)=>{const row=document.createElement('div');row.className='review-row';const title=document.createElement('strong');title.textContent=say(['Tu celular','Problema','Contacto'][i],['Your phone','Problem','Contact'][i]);row.append(title);if(editable){const edit=document.createElement('button');edit.type='button';edit.textContent=say('Editar','Edit');edit.onclick=()=>{const p=$('request').querySelectorAll('details')[i];p.open=true;p.querySelector('summary').focus();p.scrollIntoView({block:'center',behavior:reduced.matches?'auto':'smooth'})};row.append(edit);}const p=document.createElement('p');p.textContent=value||say('Pendiente','Pending');row.append(p);target.append(row);});}
function sync(){const values=content();['device-short','issue-short','contact-short'].forEach((id,i)=>$(id).textContent=i===2?$('name').value.trim():values[i]);summary($('review-content'),true);summary($('aside-summary'),false);updateProgress();}
function stepComplete(index){
 if(index===0)return Boolean($('brand').value);
 if(index===1)return Boolean(selected.size||$('description').value.trim());
 return Boolean($('name').value.trim()&&$('phone').value.replace(/\D/g,'').length>=7&&$('email').checkValidity());
}
function updateProgress(){
 const panels=[...$('request').querySelectorAll('details[data-background]')];
 let count=0;
 panels.forEach((panel,index)=>{
  const done=stepComplete(index);if(done)count++;
  panel.classList.toggle('step-complete',done);
  panel.classList.toggle('step-active',panel.open);
  const summary=panel.querySelector('summary');
  let marker=summary.querySelector('.step-marker');
  if(!marker){marker=document.createElement('span');marker.className='step-marker';summary.prepend(marker);}
  marker.textContent=done?'✓':String(index+1);
  marker.setAttribute('aria-hidden','true');
 });
 count=Math.min(3,count);
 $('progress-fill').style.width=(count/3*100)+'%';
 $('progress-count').textContent=say(`${count} de 3 secciones completas`,`${count} of 3 sections complete`);
 $('progress-title').textContent=say('Tu solicitud, paso a paso','Your request, step by step');
 $('progress-help').textContent=say('Completá cada sección a tu ritmo. Podés volver a editar tus respuestas.','Complete each section at your own pace. You can edit your answers anytime.');
}
function advanceStep(next){
 const panels=[...$('request').querySelectorAll('details[data-background]')];
 const current=next-1;
 if(current===0&&!$('brand').value)return showFieldError($('brand'),say('Elegí una marca o «Otra / No sé».','Choose a brand or “Other / Unsure”.'));
 if(current===1&&!stepComplete(1))return showFieldError($('issues'),say('Elegí un síntoma o describí la falla.','Choose a symptom or describe the issue.'));
 if(current===2){openReview();if(!$('review').open)return;}
 panels.forEach((panel,index)=>{if(index===current)panel.open=false;});
 const target=next===3?$('review'):panels[next];
 if(target){target.open=true;target.scrollIntoView({block:'start',behavior:reduced.matches?'auto':'smooth'});}
 updateProgress();
}

function clearFieldError(field) {
 const id = field.id + '-error';
 if ($(id)) $(id).remove();
 field.removeAttribute('aria-invalid');
 const descriptions = (field.getAttribute('aria-describedby') || '').split(' ').filter(value => value && value !== id);
 if (descriptions.length) field.setAttribute('aria-describedby', descriptions.join(' '));
 else field.removeAttribute('aria-describedby');
}
function showFieldError(field, message) {
 field.closest('details').open = true;
 const error = document.createElement('p');
 error.id = field.id + '-error';
 error.className = 'field-error';
 error.setAttribute('role', 'alert');
 error.textContent = message;
 field.after(error);
 field.setAttribute('aria-invalid', 'true');
 field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
 (field.id === 'issues' ? field.querySelector('button') : field).focus();
 return false;
}
function validate({ requireWebContact = true } = {}) {
 $('form-error').textContent = '';
 $('request').querySelectorAll('[aria-invalid]').forEach(clearFieldError);
 if (!$('brand').value) return showFieldError($('brand'), say('Elegí una marca o seleccioná «Otra / No sé».','Choose a brand or select “Other / Unsure”.'));
 if (!selected.size && !$('description').value.trim()) return showFieldError($('issues'), say('Elegí un síntoma o contanos qué le pasa al equipo.','Select a symptom or describe what is wrong.'));
 if (!$('name').value.trim()) return showFieldError($('name'), say('Ingresá tu nombre.','Enter your name.'));
 if (requireWebContact && !/^[+\d().\s-]+$/.test($('phone').value.trim())) return showFieldError($('phone'), say('Ingresá un teléfono con código de área.','Enter a phone number including the area code.'));
 if (requireWebContact && $('phone').value.replace(/\D/g, '').length < 7) return showFieldError($('phone'), say('Revisá el número e incluí el código de área.','Check the number and include the area code.'));
 if (requireWebContact && !$('email').checkValidity()) return showFieldError($('email'), say('Revisá el formato del correo.','Check the email format.'));
 return true;
}
function openReview(){if(!validate())return;sync();$('review').hidden=false;$('review').open=true;$('review').querySelector('summary').focus({preventScroll:true});$('review').scrollIntoView({block:'center',behavior:reduced.matches?'auto':'smooth'});}
let menuClosing;
function toggleMenu(open,returnFocus=false){
 const nav=$('navigation'),scrim=$('nav-scrim'),button=$('menu');
 clearTimeout(menuClosing);
 button.setAttribute('aria-expanded',String(open));
 button.setAttribute('aria-label',say(open?'Cerrar menú':'Abrir menú',open?'Close menu':'Open menu'));
 if(open){
  nav.hidden=false;scrim.hidden=false;nav.inert=false;
  requestAnimationFrame(()=>{nav.classList.add('is-open');scrim.classList.add('is-open')});
 }else{
  nav.inert=true;nav.classList.remove('is-open');scrim.classList.remove('is-open');
  if(returnFocus)button.focus();
  menuClosing=setTimeout(()=>{nav.hidden=true;scrim.hidden=true},reduced.matches?0:220);
 }
}
$('menu').onclick=()=>toggleMenu($('menu').getAttribute('aria-expanded')!=='true');
$('nav-scrim').onclick=()=>toggleMenu(false,true);
document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>{
 toggleMenu(false);
 const target=document.querySelector(a.getAttribute('href'));
 if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
});
document.addEventListener('keydown',e=>{
 if($('menu').getAttribute('aria-expanded')!=='true')return;
 if(e.key==='Escape'){e.preventDefault();toggleMenu(false,true);}
 if(e.key==='Tab'){
  const controls=[$('menu'),...$('navigation').querySelectorAll('a')];
  const first=controls[0],last=controls[controls.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 }
});
const activeNavigation=new IntersectionObserver(entries=>{
 const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
 if(!visible)return;
 document.querySelectorAll('nav a').forEach(link=>{
  if(link.hash==='#'+visible.target.id)link.setAttribute('aria-current','location');
  else link.removeAttribute('aria-current');
 });
},{rootMargin:'-15% 0px -60% 0px',threshold:0});
['inicio','servicios','proceso','solicitud','seguimiento'].forEach(id=>activeNavigation.observe($(id)));
$('theme').onclick=()=>{const light=document.documentElement.dataset.theme!=='light';document.documentElement.dataset.theme=light?'light':'dark';$('theme').setAttribute('aria-pressed',String(light));};
$('language').onclick=()=>{english=!english;document.documentElement.lang=english?'en':'es';translations.forEach(([el,es])=>el.textContent=say(es,el.dataset.en));renderControls();sync();$('form-error').textContent='';$('tracking-result').textContent='';};
$('unknown').onchange=()=>{$('model').disabled=$('unknown').checked;sync();};
$('request').addEventListener('input', event => {
 if (event.target.hasAttribute('aria-invalid')) clearFieldError(event.target);
 if (event.target.id === 'description' && event.target.value.trim()) clearFieldError($('issues'));
 sync();
});
$('issues').addEventListener('click', event => {
 if (event.target.closest('button') && selected.size) clearFieldError($('issues'));
});
$('request').querySelectorAll('details').forEach(panel=>panel.addEventListener('toggle',()=>{if(panel.open)setScene(panel.dataset.background);updateProgress()}));
document.querySelectorAll('#request .step-next').forEach(button=>button.addEventListener('click',()=>advanceStep(Number(button.dataset.next))));
const workshopContact = window.V370_CONTACT;

$('header-whatsapp').href = 'https://wa.me/' + workshopContact.whatsappNumber;
if (workshopContact.address.trim()) {
 const query = encodeURIComponent(workshopContact.address);
 $('workshop-address').textContent = workshopContact.address;
 $('workshop-map').src = 'https://maps.google.com/maps?q=' + query + '&output=embed';
 $('workshop-map').hidden = false;
 $('workshop-map').title = 'Mapa del taller';
 $('map-directions').href = 'https://www.google.com/maps/search/?api=1&query=' + query;
 $('map-directions').removeAttribute('aria-disabled');
}
$('workshop-phone').textContent = workshopContact.displayPhone;
$('phone-demo').hidden = !workshopContact.provisional;

function whatsappUrl() {
 const model = $('unknown').checked ? '' : $('model').value.trim();
 const symptoms = [...selected].map(label => say(label, problems.find(issue => issue[0] === label)[1]));
 const detail = [symptoms.join(', '), $('description').value.trim()].filter(Boolean).join('. ');
 const brand = $('brand').selectedOptions[0].textContent;
 const message = [
  say('Hola, soy ', 'Hi, my name is ') + $('name').value.trim() + '.',
  say('Marca: ', 'Brand: ') + brand,
  say('Modelo: ', 'Model: ') + (model || say('No indicado', 'Not specified')),
  say('Detalle: ', 'Details: ') + detail,
 ].join(String.fromCharCode(10));
 return 'https://wa.me/' + workshopContact.whatsappNumber + '?text=' + encodeURIComponent(message);
}

$('whatsapp').onclick = () => {
 if (validate({ requireWebContact: false })) {
  window.open(whatsappUrl(), '_blank', 'noopener,noreferrer');
 }
};

let submittedWhatsappUrl;
$('success-whatsapp').onclick = () => window.open(submittedWhatsappUrl, '_blank', 'noopener,noreferrer');



function resetRequest() {
 const form = $('request');
 form.reset();
 selected.clear();
 $('model').disabled = false;
 form.querySelectorAll('details').forEach((panel, index) => { panel.open = index === 0; });
 $('review').hidden = true;
 updateProgress();
 $('form-error').textContent = '';
 form.querySelectorAll('[aria-invalid]').forEach(clearFieldError);
 renderControls();
 sync();
}

$('clear-request').onclick = () => {
 if (busy || !window.confirm(say('¿Querés borrar los datos de esta solicitud?', 'Clear the details for this request?'))) return;
 resetRequest();
 $('brand').focus();
};

$('review-button').onclick=openReview;
 $('review-button').hidden=true; // Review is reached through the final step button; avoid duplicate CTA
$('request').onsubmit=async e=>{e.preventDefault();if(busy||!validate())return;busy=true;$('send').disabled=true;$('form-status').textContent=say('Simulando envío…','Simulating submission…');try{await new Promise(resolve=>setTimeout(resolve,850));submittedWhatsappUrl=whatsappUrl();summary($('success-summary'),false);resetRequest();$('request-layout').hidden=true;$('success').hidden=false;$('success-title').focus({preventScroll:true});$('success').scrollIntoView({block:'center',behavior:reduced.matches?'auto':'smooth'});}finally{busy=false;$('send').disabled=false;$('form-status').textContent='';}};
$('new-request').onclick=()=>{$('success').hidden=true;$('request-layout').hidden=false;$('brand').focus();};
$('tracking').onsubmit=async e=>{e.preventDefault();const button=$('tracking').querySelector('button');button.disabled=true;$('tracking-result').textContent=say('Consultando…','Checking…');try{await new Promise(resolve=>setTimeout(resolve,600));$('tracking-result').textContent=say('Servidor del taller pendiente de conexión. El código ingresado se conserva.','Workshop server is not connected yet. Your code has been kept.');}finally{button.disabled=false;}};
// Scroll progress uses layout coordinates, independent of animated transforms.
let motionElements=[];
let frame=false;
let lastTime=0;
const motionState=new WeakMap();
const clamp=value=>Math.min(1,Math.max(0,value));
const smooth=value=>value*value*(3-2*value);
function collectMotionElements(){
 document.querySelectorAll('.reveal').forEach(el=>el.classList.remove('reveal','visible'));
 motionElements=[...document.querySelectorAll('.hero-copy,section h2,.workshop-photo,.workshop-copy p,#solicitud > div > p,.brand,.service,.steps li,#proceso .primary,.form-layout,#success,#seguimiento > div > p')];
 motionElements.forEach((el,index)=>{
  el.classList.add('scroll-element');
  if(!motionState.has(el))motionState.set(el,{enter:null,exit:0,side:el.matches('.brand,.service')?(index%2?1:-1):0});
 });
}
function layoutTop(el){
 let top=0;
 for(let parent=el;parent;parent=parent.offsetParent)top+=parent.offsetTop;
 return top-window.scrollY;
}
function updateScroll(time){
 frame=false;
 const delta=lastTime?Math.min(time-lastTime,64):16;
 lastTime=time;
 const blend=1-Math.exp(-delta/150);
 const height=window.innerHeight;
 const headerBottom=document.querySelector('header').offsetHeight;
 let settling=false;
 motionElements.forEach(el=>{
  const state=motionState.get(el);
  if(reduced.matches){
   ['opacity','transform','filter','will-change'].forEach(key=>el.style.removeProperty(key));
   state.enter=null;return;
  }
  if(!el.offsetHeight)return;
  const top=layoutTop(el),bottom=top+el.offsetHeight;
  const initialHero=el.matches('.hero-copy');
  const targetEnter=initialHero?1:smooth(clamp((height*.97-top)/(height*.49)));
  // Begin dissolving while the element is still visible in the upper viewport.
  const targetExit=smooth(clamp((headerBottom+height*.12-bottom)/(height*.20)));
  if(state.enter===null){state.enter=targetEnter;state.exit=targetExit;}
  else {
   state.enter+=(targetEnter-state.enter)*blend;
   state.exit+=(targetExit-state.exit)*blend;
  }
  if(Math.abs(targetEnter-state.enter)>.001||Math.abs(targetExit-state.exit)>.001)settling=true;
  const enter=state.enter,exit=state.exit;
  const travel=1-enter;
  const x=state.side*travel*32;
  const y=travel*72-exit*42;
  const scale=.84+.16*enter-.025*exit;
  el.style.opacity=String(enter*(1-exit));
  el.style.transform='translate3d('+x+'px,'+y+'px,0) scale('+scale+')';
  // Keep the central reading area sharp; blur is confined to viewport edges.
  const entryBlur=1-smooth(clamp((height*.98-top)/(height*.24)));
  const exitBlur=smooth(clamp((headerBottom+height*.10-bottom)/(height*.18)));
  el.style.filter='blur('+(entryBlur*3+exitBlur*3.5)+'px)';
  if(bottom>0&&top<height)el.style.willChange='transform, opacity, filter';
  else el.style.removeProperty('will-change');
 });
 if(settling)scheduleScroll();
}
function scheduleScroll(){
 if(!frame){requestAnimationFrame(updateScroll);frame=true;}
}
const backgrounds=new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(entry.isIntersecting)setScene(entry.target.dataset.scene);
}),{rootMargin:'-25% 0px -45% 0px',threshold:0});
document.querySelectorAll('[data-scene]').forEach(el=>backgrounds.observe(el));
addEventListener('scroll',scheduleScroll,{passive:true});
addEventListener('resize',scheduleScroll);
reduced.addEventListener('change',scheduleScroll);
document.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',scheduleScroll));
renderControls();sync();setScene('hero');
collectMotionElements();scheduleScroll();
const controlsObserver=new MutationObserver(()=>{collectMotionElements();scheduleScroll()});
controlsObserver.observe($('brands'),{childList:true});
controlsObserver.observe($('services'),{childList:true});

(() => {
 const section = document.getElementById('proceso');
 const visual = section.querySelector('.process-visual');
 const header = document.querySelector('header');
 const stages = [...section.querySelectorAll('.steps li')];
 const photos = [...visual.querySelectorAll('.process-shot')];
 const caption = visual.querySelector('figcaption');
 const image = visual.querySelector('.process-photo');
 const fill = visual.querySelector('.process-track span');
 const labels = [
  ['Ingreso por coordinar', 'Intake to be arranged', 'Celular junto a una ficha de ingreso', 'Phone next to its intake form'],
  ['Equipo en revisión', 'Device inspection', 'Técnico midiendo un celular abierto', 'Technician testing an opened phone'],
  ['Presupuesto para aprobar', 'Quote for approval', 'Celular y repuesto junto a una notebook', 'Phone and replacement part next to a laptop'],
  ['Prueba final y retiro', 'Final test and pickup', 'Técnico probando el táctil del celular', 'Technician testing the phone touchscreen']
 ];
 let pending = false;
 function update() {
  pending = false;
  const headerBottom = header.offsetHeight;
  section.style.setProperty('--process-header', headerBottom + 'px');
  const mobile = innerWidth < 800;
  const line = mobile ? headerBottom + visual.offsetHeight + 28 : Math.max(headerBottom + 44, innerHeight * .43);
  let index = 0;
  stages.forEach((stage, i) => { if (stage.getBoundingClientRect().top <= line) index = i; });
  photos.forEach((photo, i) => photo.classList.toggle('is-current', i === index));
  stages.forEach((stage, i) => {
   stage.classList.toggle('is-current', i === index);
   if (i === index) stage.setAttribute('aria-current', 'step');
   else stage.removeAttribute('aria-current');
  });
  const [es,en,altEs,altEn] = labels[index];
  caption.textContent = say(es,en);
  image.setAttribute('aria-label', say(altEs,altEn));
  fill.style.width = (index + 1) * 25 + '%';
 }
 function schedule() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(update);
 }
 addEventListener('scroll', schedule, {passive:true});
 addEventListener('resize', schedule);
 $('language').addEventListener('click', schedule);
 update();
})();

const workshopFlip = document.getElementById('workshop-flip');
workshopFlip.addEventListener('click', () => {
 const showingInterior = workshopFlip.getAttribute('aria-pressed') === 'true';
 workshopFlip.setAttribute('aria-pressed', String(!showingInterior));
});
