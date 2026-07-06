const doctors = [
  {name:'Dr. Sneha Menon', initials:'SM', speciality:'General Medicine', city:'Kochi', exp:'12 yrs', rating:'4.9', fee:'₹500', next:'Today · 4:30 PM'},
  {name:'Dr. Afsal Rahman', initials:'AR', speciality:'Dermatology', city:'Kozhikode', exp:'9 yrs', rating:'4.8', fee:'₹450', next:'Today · 6:00 PM'},
  {name:'Dr. Meera Pillai', initials:'MP', speciality:'Paediatrics', city:'Thiruvananthapuram', exp:'15 yrs', rating:'4.9', fee:'₹600', next:'Tomorrow · 9:00 AM'},
  {name:'Dr. Joel Thomas', initials:'JT', speciality:'Mental Health', city:'Thrissur', exp:'8 yrs', rating:'4.7', fee:'₹650', next:'Tomorrow · 11:30 AM'},
  {name:'Dr. Lekshmi S.', initials:'LS', speciality:'Gynaecology', city:'Kollam', exp:'11 yrs', rating:'4.8', fee:'₹550', next:'Mon · 2:00 PM'},
  {name:'Dr. Nikhil Varma', initials:'NV', speciality:'General Medicine', city:'Alappuzha', exp:'7 yrs', rating:'4.6', fee:'₹400', next:'Today · 7:15 PM'}
];

const legalItems = [
  {title:'Review the privacy notice', detail:'See what data is collected, why it is needed, retention, sharing, and your rights.', done:false, action:'Review'},
  {title:'Record teleconsultation consent', detail:'Explicit consent is required when you initiate or continue a remote consultation.', done:true, action:'View receipt'},
  {title:'Verify doctor registration', detail:'Check the clinician’s name, qualification, registration number, and council.', done:true, action:'Verified'},
  {title:'Add a grievance contact', detail:'Choose how the care and privacy teams can reach you about a complaint.', done:false, action:'Add contact'},
  {title:'Nominate an emergency contact', detail:'Used only if urgent escalation is needed during a consultation.', done:false, action:'Add person'},
  {title:'Prescription safety check', detail:'Prescriptions must identify the clinician and patient, be signed, dated, and follow permitted medicine rules.', done:true, action:'Learn more'},
  {title:'Clinical establishment verification', detail:'Where applicable, confirm provider/facility registration under Kerala requirements.', done:true, action:'View check'}
];

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

function renderDoctors(filter='') {
  const needle = filter.trim().toLowerCase();
  const matches = doctors.filter(d => Object.values(d).join(' ').toLowerCase().includes(needle));
  $('#doctorList').innerHTML = matches.map(d => `<article class="doctor-card">
    <div class="doctor-card-head"><span class="doctor-avatar">${d.initials}</span><div><span class="verified-text">✓ Registration verified</span><h3>${d.name}</h3><p>${d.speciality} · ${d.city}</p></div></div>
    <div class="stats"><span><b>${d.exp}</b>Experience</span><span><b>★ ${d.rating}</b>Patient rating</span><span><b>${d.fee}</b>Consultation</span></div>
    <p>Next available: <b>${d.next}</b></p><button class="outline book-doctor" data-name="${d.name}">Book consultation →</button>
  </article>`).join('') || '<p>No doctors match your search.</p>';
  $$('.book-doctor').forEach(b => b.addEventListener('click', () => openModal('doctorModal')));
}

function renderLegal() {
  $('#legalActions').innerHTML = legalItems.map((item, i) => `<article class="legal-action ${item.done?'complete':''}">
    <span class="status">${item.done?'✓':'!'}</span><div><h3>${item.title}</h3><p>${item.detail}</p></div><button data-legal="${i}">${item.action}</button>
  </article>`).join('');
  $$('[data-legal]').forEach(btn => btn.addEventListener('click', () => {
    const item = legalItems[Number(btn.dataset.legal)];
    if (!item.done) { item.done = true; item.action = 'Completed'; renderLegal(); toast(`${item.title} completed`); }
    else showInfo(item.title, `<p>${item.detail}</p><p><strong>Status:</strong> complete and saved to your audit history.</p>`);
  }));
}

function switchView(id) {
  $$('.view').forEach(v => v.classList.toggle('active-view', v.id === id));
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === id));
  $('.sidebar').classList.remove('open');
  window.scrollTo({top:0, behavior:'smooth'});
}

function openModal(id) { $('#'+id).classList.add('open'); }
function closeModals() { $$('.modal-backdrop').forEach(m => m.classList.remove('open')); }
function toast(message) { const t=$('#toast'); $('p',t).textContent=message; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2600); }
function showInfo(title, html) { $('#infoContent').innerHTML=`<span class="kicker">MEDICONNECT</span><h2>${title}</h2>${html}`; openModal('infoModal'); }

$$('.nav-item,[data-view-link]').forEach(b => b.addEventListener('click', () => switchView(b.dataset.view || 'home')));
$$('[data-view-jump]').forEach(b => b.addEventListener('click', () => switchView(b.dataset.viewJump)));
$$('[data-open]').forEach(b => b.addEventListener('click', () => openModal(b.dataset.open)));
$$('[data-close]').forEach(b => b.addEventListener('click', closeModals));
$$('.modal-backdrop').forEach(m => m.addEventListener('click', e => { if(e.target===m) closeModals(); }));
$('#menuBtn').addEventListener('click', () => $('.sidebar').classList.toggle('open'));
$('#emergencyBtn').addEventListener('click', () => openModal('emergencyModal'));
$('#doctorSearch').addEventListener('input', e => renderDoctors(e.target.value));
$$('.specialities button').forEach(b => b.addEventListener('click', () => { $$('.specialities button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); renderDoctors(b.textContent==='All'?'':b.textContent); }));
$$('.modal-options button').forEach(b => b.addEventListener('click', () => { $$('.modal-options button').forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); }));
$('#continueBooking').addEventListener('click', () => { if(!$('#consentCheck').checked){toast('Please record your consent to continue');return;} closeModals(); switchView('doctors'); toast('Consent receipt saved securely'); });
['joinBtn','joinBtn2'].forEach(id => $('#'+id).addEventListener('click', () => showInfo('Waiting room', `<p>Your camera and microphone will only start after you allow access. Dr. Sneha will be notified that you are ready.</p><button class="primary full" onclick="closeModals();toast('You are checked in')">Check in securely</button>`)));
$('#symptomBtn').addEventListener('click', () => showInfo('Guided symptom check', '<p>This tool helps organise symptoms and recommend the right level of care. It does not diagnose, prescribe, or replace a registered medical practitioner.</p><button class="primary full" onclick="closeModals();toast(\'Symptom check started\')">I understand—start</button>'));
$('#pharmacyBtn').addEventListener('click', () => showInfo('Nearby licensed pharmacies', '<p>Location access is off. Turn it on to find registered pharmacies near Kochi. MediConnect does not sell medicines or substitute a pharmacist’s advice.</p><button class="primary full" onclick="toast(\'Location request simulated\')">Use my location</button>'));
$('#uploadBtn').addEventListener('click', () => toast('Record upload is ready for secure storage'));
$('#auditBtn').addEventListener('click', () => showInfo('Record access log', '<ul><li><b>19 Jun, 2:14 PM</b> — You opened Blood test report</li><li><b>2 Jun, 5:08 PM</b> — Dr. Sneha Menon added a prescription</li><li><b>2 Jun, 4:32 PM</b> — You granted access for 30 minutes</li></ul>'));
$('#langBtn').addEventListener('click', () => toast('Malayalam interface preview enabled'));
$('#sourceBtn').addEventListener('click', () => showInfo('Legal source register', `<p>Compliance design should be reviewed by qualified Kerala counsel before production use.</p><ol class="source-list"><li><a href="https://www.mohfw.gov.in/pdf/Telemedicine.pdf" target="_blank" rel="noopener">Telemedicine Practice Guidelines</a> — Ministry of Health & Family Welfare / Board of Governors.</li><li><a href="https://www.meity.gov.in/data-protection-framework" target="_blank" rel="noopener">Digital Personal Data Protection framework</a> — Ministry of Electronics & IT.</li><li><a href="https://clinicalestablishments.kerala.gov.in/" target="_blank" rel="noopener">Kerala Clinical Establishments portal</a> — Government of Kerala.</li><li><a href="https://112.gov.in/" target="_blank" rel="noopener">Emergency Response Support System 112</a> — Government of India.</li></ol>`));

const ACCESS_CODE = 'MEDI2026';
let currentRole = 'patient';
let pendingRole = null;

const workspaces = {
  patient: {
    home:'home', profile:'profile', person:'Anjali Nair', meta:'Patient ID · MC-28904', initials:'AN',
    nav:[['home','⌂','Home'],['doctors','✚','Find doctors'],['appointments','◷','Appointments','2'],['followup_care','↺','Follow-up care'],['virtual_ward','⌂','Virtual ward'],['records','▤','Health records'],['legal','✓','Legal & consent','Action']]
  },
  doctor: {
    home:'doctor_dashboard', profile:'doctor_dashboard', person:'Dr. Sneha Menon', meta:'General Medicine · Verified', initials:'SM',
    nav:[['doctor_dashboard','⌂','Overview'],['doctor_patients','♙','Patients'],['doctor_schedule','◷','Schedule','4'],['doctor_followups','↺','Follow-ups','6'],['doctor_virtual_ward','⌂','Virtual ward','9'],['doctor_prescriptions','Rx','Prescriptions','2'],['doctor_earnings','₹','Earnings']]
  },
  admin: {
    home:'admin_dashboard', profile:'admin_dashboard', person:'Arun Nair', meta:'Platform administrator', initials:'AD',
    nav:[['admin_dashboard','⌂','Control room'],['admin_verification','✓','Doctor verification','23'],['admin_users','♙','Users & access'],['admin_payments','₹','Payments'],['admin_analytics','◉','Analytics']]
  },
  compliance: {
    home:'compliance_dashboard', profile:'compliance_dashboard', person:'Maya S.', meta:'Compliance lead', initials:'MS',
    nav:[['compliance_dashboard','⌂','Rights & safety'],['compliance_cases','▤','Grievances','18'],['compliance_privacy','⌾','Privacy requests','7'],['compliance_incidents','!','Incidents','1'],['compliance_audit','✓','Audit explorer']]
  }
};

function activateWorkspace(role) {
  const w = workspaces[role];
  $('#primaryNav').innerHTML = w.nav.map((n,i) => `<button class="nav-item ${i===0?'active':''}" data-view="${n[0]}"><span>${n[1]}</span> ${n[2]} ${n[3]?`<em>${n[3]}</em>`:''}</button>`).join('');
  $('#profileMini').dataset.view = w.profile;
  $('#profileMini').innerHTML = `<span class="avatar">${w.initials}</span><span><b>${w.person}</b><small>${w.meta}</small></span><span>›</span>`;
  $('[data-view-link]').dataset.viewLink = w.home;
  $('[data-view-link]').dataset.view = w.home;
  $$('#primaryNav .nav-item').forEach(b => b.addEventListener('click', () => switchView(b.dataset.view)));
  currentRole = role;
  $('#roleSelect').value = role;
  switchView(w.home);
  toast(`${$('#roleSelect').selectedOptions[0].text} workspace opened`);
}

function requestWorkspace(role) {
  if (role === currentRole) return;
  if (role === 'patient') { activateWorkspace(role); return; }
  pendingRole = role;
  $('#accessMessage').textContent = `Enter the authorised staff code to open the ${$('#roleSelect').selectedOptions[0].text} interface.`;
  $('#accessCode').value = '';
  $('#codeError').textContent = '';
  $('#accessCode').type = 'password';
  $('#toggleCode').textContent = 'Show';
  openModal('accessModal');
  setTimeout(() => $('#accessCode').focus(), 50);
}

function cancelWorkspaceAccess() {
  pendingRole = null;
  $('#roleSelect').value = currentRole;
  $('#codeError').textContent = '';
  closeModals();
}

function unlockWorkspace() {
  if ($('#accessCode').value.trim() !== ACCESS_CODE) {
    $('#codeError').textContent = 'Incorrect access code. Please try again.';
    $('#accessCode').select();
    return;
  }
  const role = pendingRole;
  pendingRole = null;
  closeModals();
  activateWorkspace(role);
}

$('#roleSelect').addEventListener('change', e => requestWorkspace(e.target.value));
$('#unlockWorkspace').addEventListener('click', unlockWorkspace);
$('#cancelAccess').addEventListener('click', cancelWorkspaceAccess);
$('#accessCode').addEventListener('keydown', e => { if (e.key === 'Enter') unlockWorkspace(); if (e.key === 'Escape') cancelWorkspaceAccess(); });
$('#toggleCode').addEventListener('click', () => { const input=$('#accessCode'); const show=input.type==='password'; input.type=show?'text':'password'; $('#toggleCode').textContent=show?'Hide':'Show'; input.focus(); });
$('#accessModal').addEventListener('click', e => { if (e.target === $('#accessModal')) cancelWorkspaceAccess(); });
$('#profileMini').addEventListener('click', () => switchView($('#profileMini').dataset.view));
$('#availabilityBtn').addEventListener('click', e => { const offline=e.target.textContent==='Go offline'; e.target.textContent=offline?'Go online':'Go offline'; $('.availability i').style.background=offline?'#aab4b1':'#55a982'; toast(offline?'You are now offline':'You are available for consultations'); });
$$('.doctor-start,.patient-chart').forEach(b => b.addEventListener('click', () => showInfo('Consent-scoped patient chart', '<p>This prototype opens a minimum-necessary clinical summary. The event is recorded in the audit log and access expires with the care purpose.</p><button class="primary full" onclick="closeModals();toast(\'Chart access logged\')">Open authorised summary</button>')));
$('#rxSafetyBtn').addEventListener('click', () => switchView('doctor_prescriptions'));
$('#blockTimeBtn').addEventListener('click', () => toast('A private time block was added'));
$('#newRxBtn').addEventListener('click', () => showInfo('New prescription', '<p>Start only after a completed consultation. Patient identity, allergy review, diagnosis context, permitted medicine rules, clinician registration, signature, and timestamp are required.</p><button class="primary full" onclick="closeModals();toast(\'Prescription draft created\')">Create compliant draft</button>'));
$$('.sign-rx').forEach(b => b.addEventListener('click', () => showInfo('Prescription review', '<p>Identity ✓ &nbsp; Consent ✓ &nbsp; Registration ✓</p><p><strong>Action required:</strong> confirm allergy status before signing.</p><button class="primary full" onclick="closeModals();toast(\'Allergy review requested\')">Request confirmation</button>')));
$$('.admin-review').forEach(b => b.addEventListener('click', () => switchView('admin_verification')));
$$('.verification-decision').forEach(b => b.addEventListener('click', () => { if(!$('.verification-card textarea').value.trim()){toast('Add a reviewer note before deciding');return;} toast(`Application ${b.textContent.toLowerCase()}d with audit receipt`); }));
$$('[data-admin="report"]').forEach(b => b.addEventListener('click', () => toast('Operations report generated')));
$$('.case-open').forEach(b => b.addEventListener('click', () => switchView('compliance_cases')));
$('#newCaseBtn').addEventListener('click', () => showInfo('Create grievance case', '<p>Capture the complainant, category, urgency, preferred contact, consent for evidence access, owner, and resolution due date.</p><button class="primary full" onclick="closeModals();toast(\'Draft case created\')">Create draft</button>'));
$('#declareIncidentBtn').addEventListener('click', () => showInfo('Declare an incident', '<p>This starts the response clock, assigns an incident commander, preserves evidence, and opens containment and impact-assessment tasks.</p><button class="danger-btn full" onclick="closeModals();toast(\'Incident drill created\')">Create simulation</button>'));

renderDoctors();
renderLegal();
