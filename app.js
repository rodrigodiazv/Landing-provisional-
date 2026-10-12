const ADMIN_PWD = 'flowsuite2026';
let isAdmin = false;
let selColor = '#00c9a3';
let _toast;
const SAMPLE_DATA = {
n:'Bar du Lac',s:'Restaurante / Bar',c:'Lausanne',sl:'La mejor terraza con vistas al lago',
l:'es',t:'+41 79 000 00 00',sv:'Menú del día 22 CHF\nTerraza con vistas\nReservas online',col:'#00c9a3'
};
function goApp()  { document.getElementById('view-landing').style.display='none'; document.getElementById('view-app').classList.add('on'); initApp(); }
function goLanding(){ document.getElementById('view-app').classList.remove('on'); document.getElementById('view-landing').style.display='block'; }
function initApp(){
const n = Math.floor(Math.random()*30)+14;
document.getElementById('kp-conv').textContent  = n;
document.getElementById('kp-leads').textContent = Math.floor(n*.35);
document.getElementById('lead-n').textContent   = Math.floor(n*.35);
document.getElementById('ags-name').textContent = 'Asistente de ' + SAMPLE_DATA.n;
const feed = document.getElementById('feed-list');
[
['💬','14 conversaciones hoy · 3 leads cualificados','Hace 2h'],
['👤','Nuevo lead: Matías García · +41 79 123 456','Hace 3h'],
['📅','Cita reservada: mañana 17:00 · confirmada','Hace 5h'],
['🌙','15 consultas atendidas fuera de horario','Ayer'],
].forEach(([ico,tx,time])=>{
feed.innerHTML+=`<div class="feed-item"><div class="feed-ico">${ico}</div><div><div class="feed-tx">${tx}</div><div class="feed-time">${time}</div></div></div>`;
});
initChat();
renderSkills('all');
}
