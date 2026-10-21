'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const app=$('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rp=n=>n?'Rp '+n.toLocaleString('id-ID'):'Gratis';
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2200)};

/* ---------- Data contoh ---------- */
const JALUR=[
 ['web','Web Development','Membangun situs dan aplikasi web dari sisi tampilan maupun server.',['HTML/CSS','JavaScript','Git','API','Database','Deployment'],['Frontend Developer','Backend Developer','Fullstack Developer']],
 ['mobile','Mobile Development','Membuat aplikasi untuk perangkat Android dan iOS.',['Kotlin/Swift','Flutter','UI mobile','REST API','Git','Publikasi aplikasi'],['Android Developer','iOS Developer','Flutter Developer']],
 ['data','Data Science','Mengolah dan menganalisis data untuk menemukan wawasan.',['Python','SQL','Statistika','Visualisasi','Excel','Storytelling data'],['Data Analyst','Data Scientist','BI Analyst']],
 ['ai','AI & Machine Learning','Merancang model yang belajar dari data.',['Python','Matematika','Machine learning','Deep learning','MLOps','Eksperimen'],['ML Engineer','AI Engineer','Research Assistant']],
 ['ux','UI/UX Design','Merancang pengalaman dan antarmuka produk digital.',['Riset pengguna','Wireframe','Prototipe','Figma','Design system','Uji kegunaan'],['UI Designer','UX Researcher','Product Designer']],
 ['sec','Cyber Security','Melindungi sistem dan data dari ancaman.',['Jaringan','Linux','Kriptografi','Pentest','Analisis log','Respons insiden'],['Security Analyst','Pentester','SOC Analyst']],
 ['cloud','Cloud & DevOps','Mengelola infrastruktur dan alur rilis perangkat lunak.',['Linux','Docker','CI/CD','Cloud (AWS/GCP)','Monitoring','Scripting'],['DevOps Engineer','Cloud Engineer','SRE']],
 ['qa','Quality Assurance','Memastikan kualitas perangkat lunak lewat pengujian.',['Test case','Pengujian manual','Otomasi tes','Bug report','API testing','Agile'],['QA Tester','QA Automation','Test Engineer']]
].map(([id,nama,desc,skill,posisi])=>({id,nama,desc,skill,posisi}));
const jn=id=>JALUR.find(j=>j.id===id)?.nama||'-';
const jalurLabel={web:'Web Development',data:'Data & AI',ux:'UI/UX Design',sec:'Cyber Security'};
let PROG=Array.from({length:16},(_,i)=>{const j=['web','data','ux','sec','mobile','cloud','qa','ai'][i%8];const free=i%3===2;
 return{id:i+1,nama:`Nama Program ${i+1}`,penyedia:'Nama Penyedia',jalur:j,biaya:free?0:(i+1)*350000,durasi:free?3:(i%5)+1,satuan:free?'minggu':'bulan',mode:i%4===3?'Offline':'Online',status:['Aktif','Aktif','Draf','Aktif','Nonaktif'][i%5],desc:'Deskripsi program akan tampil di sini: apa yang dipelajari, siapa yang cocok, dan hasil yang didapat peserta.',url:'https://example.com',tgl:`2026-0${(i%9)+1}-15`}});
const dur=p=>`${p.durasi} ${p.satuan}`;
const durBucket=p=>{const m=p.satuan==='minggu'?p.durasi/4:p.durasi;return m<1?'a':m<=3?'b':'c'};
const user=()=>JSON.parse(localStorage.getItem('ep_user')||'null');

/* ---------- Komponen ---------- */
const card=(p,h)=>`<article class="card pc ${h?'h':''}"><div class="ph">Gambar program</div><div class="b">
 <div><span class="tag">${esc(jn(p.jalur))}</span></div><h3>${esc(p.nama)}</h3><div class="mute">${esc(p.penyedia)}</div>
 <div class="meta"><b>${rp(p.biaya)}</b><span>${dur(p)}${h?' · '+p.mode:''}</span></div>
 <a class="btn ghost sm" href="#/program/${p.id}">Lihat detail</a></div></article>`;
const pager=(cur,tot,fn)=>tot<2?'':`<div class="pager">${Array.from({length:tot},(_,i)=>`<button class="${i+1===cur?'on':''}" data-pg="${i+1}">${i+1}</button>`).join('')}</div>`;
const jalurOpts=(sel='')=>`<option value="">Pilih jalur</option>`+JALUR.map(j=>`<option value="${j.id}" ${sel===j.id?'selected':''}>${j.nama}</option>`).join('');
const footerBlank=''; 

/* ---------- Halaman publik ---------- */
const V={};
V.home=()=>`<section class="hero"><div class="in"><h1>Temukan program belajar IT yang sesuai jalur kariermu</h1>
 <p class="lead">Jelajahi bootcamp, kursus, dan pelatihan dari berbagai penyedia, lalu cek kesiapan CV dan portofoliomu dengan bantuan AI.</p>
 <form class="search" id="sf"><input name="q" placeholder="Cari program, penyedia, atau keahlian" aria-label="Cari"><select name="j" aria-label="Jalur"><option value="">Semua jalur IT</option>${JALUR.map(j=>`<option value="${j.id}">${j.nama}</option>`).join('')}</select><button class="btn">Cari</button></form>
 <p class="hint" style="margin-top:.8rem">Pencarian populer: ${['Web Development','Data Science','UI/UX Design','Cyber Security'].map(t=>`<a class="tag" href="#/cari?q=${encodeURIComponent(t)}">${t}</a>`).join('')}</p></div></section>
 <div class="wrap"><div class="sec-h"><h2>Jalur Karier IT</h2><a class="mute" href="#/jalur">Lihat semua jalur →</a></div>
 <div class="grid g4">${JALUR.slice(0,4).map(j=>`<a class="card jc" href="#/jalur/${j.id}"><h3>${j.nama}</h3><span class="mute">${j.desc}</span></a>`).join('')}</div>
 <div class="sec-h"><h2>Direktori Program</h2></div>
 <div class="row" id="dirf" style="margin-bottom:1rem"><select data-f="jalur"><option value="">Jalur</option>${JALUR.map(j=>`<option value="${j.id}">${j.nama}</option>`).join('')}</select><select data-f="penyedia"><option value="">Penyedia</option><option>Nama Penyedia</option></select><select data-f="biaya"><option value="">Biaya</option><option value="g">Gratis</option><option value="b">Berbayar</option></select><select data-f="durasi"><option value="">Durasi</option><option value="a">&lt; 1 bulan</option><option value="b">1–3 bulan</option><option value="c">&gt; 3 bulan</option></select><button class="btn" id="dirApply">Terapkan filter</button></div>
 <div class="grid g4" id="dir"></div><div id="dirPg"></div>
 <div class="card dash row" style="margin-top:2rem;justify-content:space-between"><div><h3>Sudah punya CV atau portofolio?</h3><span class="mute">Unggah dan dapatkan review dari AI beserta saran perbaikan sebelum melamar program.</span></div><a class="btn" href="#/review">Review CV saya</a></div></div>`;
V.home.after=()=>{
 const state={page:1,f:{}};
 const draw=()=>{let l=PROG.filter(p=>p.status==='Aktif');const f=state.f;
  if(f.jalur)l=l.filter(p=>p.jalur===f.jalur);if(f.biaya)l=l.filter(p=>f.biaya==='g'?!p.biaya:p.biaya);if(f.durasi)l=l.filter(p=>durBucket(p)===f.durasi);
  const per=8,tot=Math.ceil(l.length/per)||1;state.page=Math.min(state.page,tot);
  $('#dir').innerHTML=l.slice((state.page-1)*per,state.page*per).map(p=>card(p)).join('')||'<p class="mute">Tidak ada program yang cocok.</p>';
  $('#dirPg').innerHTML=pager(state.page,tot)};
 $('#dirApply').onclick=()=>{state.f={};$$('#dirf select').forEach(s=>state.f[s.dataset.f]=s.value);state.page=1;draw()};
 $('#dirPg').onclick=e=>{const b=e.target.closest('[data-pg]');if(b){state.page=+b.dataset.pg;draw()}};
 $('#sf').onsubmit=e=>{e.preventDefault();const d=new FormData(e.target);location.hash=`#/cari?q=${encodeURIComponent(d.get('q'))}&j=${d.get('j')}`};
 draw()};

V.program=id=>{const p=PROG.find(x=>x.id==id);if(!p)return notFound();
 const rel=PROG.filter(x=>x.id!==p.id&&x.status==='Aktif').slice(0,3);
 return`<div class="wrap"><div class="crumb"><a href="#/">Beranda</a> / <a href="#/cari">Program</a> / ${esc(p.nama)}</div>
 <div class="split"><div><div class="ph" style="min-height:230px">Gambar utama program</div>
  <p style="margin-top:1rem"><span class="tag">${esc(jn(p.jalur))}</span><span class="tag">${p.mode}</span></p><h1>${esc(p.nama)}</h1><p class="mute">oleh ${esc(p.penyedia)}</p>
  <h2>Deskripsi program</h2><p>${esc(p.desc)}</p>
  <h2 style="margin-top:1.5rem">Materi yang dipelajari</h2><ul class="mods">${[1,2,3,4,5].map(i=>`<li><span class="n">${i}</span><b>Modul ${i}</b><span class="mute">${i===5?'Proyek akhir':'Judul materi'}</span></li>`).join('')}</ul>
  <h2 style="margin-top:1.5rem">Persyaratan peserta</h2><ul><li>Persyaratan 1</li><li>Persyaratan 2</li><li>Persyaratan 3</li></ul></div>
 <aside><div class="card"><div class="price">${rp(p.biaya)}</div><div class="facts">
  <div><span class="mute">Durasi</span><b>${dur(p)}</b></div><div><span class="mute">Mode</span><b>${p.mode}</b></div><div><span class="mute">Jadwal mulai</span><b>${new Date(p.tgl).toLocaleDateString('id-ID')}</b></div><div><span class="mute">Sertifikat</span><b>Ya</b></div></div>
  <a class="btn block" target="_blank" rel="noopener" href="${esc(p.url)}" style="margin-top:.8rem">Kunjungi situs penyedia</a><a class="btn ghost block" href="#/review" style="margin-top:.5rem">Cek CV sebelum mendaftar</a></div></aside></div>
 <div class="sec-h"><h2>Program terkait</h2></div><div class="grid g3">${rel.map(x=>card(x)).join('')}</div></div>`};

V.cari=q=>{const p=new URLSearchParams(q);return`<div class="wrap"><form class="search" id="sf2" style="max-width:none"><input name="q" value="${esc(p.get('q')||'')}" aria-label="Cari"><button class="btn">Cari</button></form>
 <div class="search-l" style="margin-top:1.25rem"><aside class="card filter" style="align-self:start" id="flt"><div class="row" style="justify-content:space-between"><b>Filter</b><a href="#/cari" class="hint">Reset</a></div>
 <h3>Jalur IT</h3>${['web','data','ux','sec'].map(k=>`<label><input type="checkbox" name="j" value="${k}" ${p.get('j')===k?'checked':''}>${jalurLabel[k]}</label>`).join('')}
 <h3>Biaya</h3><label><input type="checkbox" name="b" value="g">Gratis</label><label><input type="checkbox" name="b" value="p">Berbayar</label>
 <h3>Durasi</h3><label><input type="checkbox" name="d" value="a">Kurang dari 1 bulan</label><label><input type="checkbox" name="d" value="b">1–3 bulan</label><label><input type="checkbox" name="d" value="c">Lebih dari 3 bulan</label>
 <h3>Mode belajar</h3><label><input type="checkbox" name="m" value="Online">Online</label><label><input type="checkbox" name="m" value="Offline">Offline</label>
 <button class="btn block" id="fa" style="margin-top:1rem">Terapkan</button></aside>
 <div><div class="row" style="justify-content:space-between;margin-bottom:.75rem"><span id="cnt" class="mute"></span><select id="srt" style="max-width:220px" aria-label="Urutkan"><option value="r">Urutkan: Paling relevan</option><option value="m">Termurah</option><option value="d">Terpendek</option></select></div>
 <div class="grid" id="res"></div><div id="rpg"></div></div></div></div>`};
V.cari.after=q=>{const p=new URLSearchParams(q);let page=1;
 const run=()=>{const kw=(p.get('q')||'').toLowerCase();const chk=n=>$$(`#flt [name=${n}]:checked`).map(i=>i.value);
  const J=chk('j'),B=chk('b'),D=chk('d'),M=chk('m');
  let l=PROG.filter(x=>x.status==='Aktif'&&(!kw||(x.nama+x.penyedia+jn(x.jalur)).toLowerCase().includes(kw)||(jalurLabel[x.jalur]||'').toLowerCase().includes(kw))&&(!J.length||J.includes(x.jalur))&&(!B.length||B.includes(x.biaya?'p':'g'))&&(!D.length||D.includes(durBucket(x)))&&(!M.length||M.includes(x.mode)));
  const s=$('#srt').value;if(s==='m')l.sort((a,b)=>a.biaya-b.biaya);if(s==='d')l.sort((a,b)=>a.durasi-b.durasi);
  const tot=Math.ceil(l.length/5)||1;page=Math.min(page,tot);
  $('#cnt').textContent=`${l.length} program ditemukan${kw?` untuk "${p.get('q')}"`:''}`;
  $('#res').innerHTML=l.slice((page-1)*5,page*5).map(x=>card(x,1)).join('')||`<div class="card dash"><h3>Tidak ada program yang cocok</h3><p class="mute">Coba kurangi filter atau gunakan kata kunci lain.</p></div>`;
  $('#rpg').innerHTML=pager(page,tot)};
 $('#fa').onclick=()=>{page=1;run()};$('#srt').onchange=run;
 $('#rpg').onclick=e=>{const b=e.target.closest('[data-pg]');if(b){page=+b.dataset.pg;run()}};
 $('#sf2').onsubmit=e=>{e.preventDefault();p.set('q',new FormData(e.target).get('q'));page=1;run()};run()};

V.jalur=()=>`<section class="hero"><div class="in"><h1>Jalur Karier IT</h1><p class="lead">Kenali berbagai bidang di dunia IT, keahlian yang dibutuhkan, dan program yang bisa kamu ambil untuk memulainya.</p>
 <div class="search"><input id="jq" placeholder="Cari jalur karier" aria-label="Cari jalur"></div></div></section>
 <div class="wrap"><div class="card dash row" style="justify-content:space-between;margin-bottom:1.25rem"><div><h3>Bingung memilih jalur?</h3><span class="mute">Ikuti panduan singkat untuk mengenali minat dan kemampuanmu.</span></div><button class="btn" id="quiz">Mulai panduan penjaluran</button></div>
 <div class="grid g4" id="jl"></div></div>`;
V.jalur.after=()=>{const draw=k=>$('#jl').innerHTML=JALUR.filter(j=>j.nama.toLowerCase().includes(k)).map(j=>`<article class="card jc"><h3>${j.nama}</h3><span class="mute">${j.desc}</span><div>${j.skill.slice(0,3).map(s=>`<span class="tag">${s}</span>`).join('')}</div><a class="more" href="#/jalur/${j.id}">${PROG.filter(p=>p.jalur===j.id&&p.status==='Aktif').length} program tersedia →</a></article>`).join('')||'<p class="mute">Jalur tidak ditemukan.</p>';
 $('#jq').oninput=e=>draw(e.target.value.toLowerCase());draw('');
 $('#quiz').onclick=()=>{const a=[['Suka mendesain tampilan?','ux'],['Suka mengolah angka dan data?','data'],['Suka membangun situs atau aplikasi?','web'],['Suka mengamankan sistem?','sec']];
  const r=a.find(([q])=>confirm(q+'\nOK = Ya, Cancel = Tidak'));location.hash=r?'#/jalur/'+r[1]:'#/jalur'}};

V.jalurD=id=>{const j=JALUR.find(x=>x.id===id);if(!j)return notFound();const l=PROG.filter(p=>p.jalur===id&&p.status==='Aktif').slice(0,3);
 const st=[['Tahap dasar','Fondasi dan konsep inti jalur ini.'],['Tahap menengah','Praktik dengan alat dan proyek kecil.'],['Tahap lanjut','Studi kasus dan topik spesialisasi.'],['Portofolio dan persiapan kerja','Merapikan proyek, CV, dan latihan wawancara.']];
 return`<div class="wrap"><div class="crumb"><a href="#/">Beranda</a> / <a href="#/jalur">Jalur Karier IT</a> / ${j.nama}</div>
 <div class="card row" style="gap:1rem"><div class="ph" style="flex:0 0 80px;min-height:80px">Ikon</div><div><h1>${j.nama}</h1><p class="mute" style="margin:0">${j.desc}</p></div></div>
 <div class="split" style="margin-top:1.5rem"><div><h2>Keahlian yang dibutuhkan</h2><p>${j.skill.map(s=>`<span class="tag">${s}</span>`).join('')}</p>
 <h2 style="margin-top:1.5rem">Tahapan belajar</h2><div class="steps">${st.map((s,i)=>`<div><span class="n">${i+1}</span><div><b>${s[0]}</b><div class="mute">${s[1]}</div></div></div>`).join('')}</div>
 <h2 style="margin-top:1.5rem">Posisi pekerjaan terkait</h2><p>${j.posisi.map(s=>`<span class="tag">${s}</span>`).join('')}</p></div>
 <aside><div class="card"><b>Program untuk jalur ini</b><div style="margin:.6rem 0">${l.map(p=>`<a class="card" style="display:block;margin-bottom:.5rem" href="#/program/${p.id}"><b>${esc(p.nama)}</b><div class="mute">${esc(p.penyedia)}</div></a>`).join('')||'<p class="mute">Belum ada program.</p>'}</div><a class="btn ghost block" href="#/cari?j=${j.id}">Lihat semua program</a></div>
 <div class="card dash" style="margin-top:1rem"><b>Siap melamar ke jalur ini?</b><p class="mute">Cek kesiapan CV dan portofoliomu dengan review AI.</p><a class="btn block" href="#/review?j=${j.id}">Review CV saya</a></div></aside></div></div>`};

/* ---------- Review CV ---------- */
V.review=q=>{const j=new URLSearchParams(q).get('j')||'';return`<div class="wrap" style="max-width:760px"><div style="text-align:center"><h1>Review CV dan Portofolio dengan AI</h1><p class="mute">Unggah dokumenmu dan dapatkan masukan tentang kekuatan, kekurangan, dan saran perbaikan.</p>
 <div class="stepper" style="justify-content:center"><span class="on" id="s1">1 Unggah</span><span id="s2">2 Diproses AI</span><span id="s3">3 Hasil review</span></div></div>
 <form class="card" id="rf" novalidate><label>CV *</label><div class="drop" id="drop"><p>Tarik file ke sini atau pilih dari perangkat</p><label class="btn ghost sm" style="display:inline-block;margin:0">Pilih file<input type="file" id="cv" accept=".pdf,.docx" hidden></label><p class="hint" style="margin:.5rem 0 0">Format PDF atau DOCX, maksimal 5 MB</p></div>
 <div id="fi"></div><div class="err-t" id="fe"></div>
 <label>Portofolio (opsional)</label><input name="port" type="url" placeholder="https://tautan-portofolio-kamu"><div class="hint">Tempel tautan portofolio kamu.</div>
 <div class="row"><div><label>Jalur IT yang dituju *</label><select name="j" required>${jalurOpts(j)}</select></div><div><label>Posisi yang dilamar (opsional)</label><input name="pos" placeholder="Contoh: Junior Frontend Developer"></div></div>
 <p class="alert i">File hanya dipakai untuk menghasilkan review. Hindari mengunggah dokumen yang berisi data sensitif seperti nomor identitas.</p>
 <div class="row" style="justify-content:flex-end"><a class="btn ghost" href="#/">Batal</a><button class="btn">Mulai review</button></div></form>
 <div class="card dash" id="ld" hidden><p id="lt">AI sedang membaca dokumenmu. Proses ini membutuhkan beberapa saat.</p><div class="bar"><i id="lb" style="width:0"></i></div></div></div>`};
V.review.after=()=>{let file=null;const set=f=>{$('#fe').textContent='';
  if(!f)return;if(!/\.(pdf|docx)$/i.test(f.name)){$('#fe').textContent='Format file harus PDF atau DOCX.';return}
  if(f.size>5*1048576){$('#fe').textContent='Ukuran file melebihi 5 MB.';return}
  file=f;$('#fi').innerHTML=`<div class="row" style="justify-content:space-between;margin-top:.6rem"><span>📄 ${esc(f.name)} <span class="mute">${(f.size/1048576).toFixed(1)} MB</span></span><button type="button" class="btn ghost sm" id="rm" style="flex:0">Hapus</button></div>`;$('#rm').onclick=()=>{file=null;$('#fi').innerHTML='';$('#cv').value=''}};
 $('#cv').onchange=e=>set(e.target.files[0]);
 const d=$('#drop');['dragover','dragenter'].forEach(t=>d.addEventListener(t,e=>{e.preventDefault();d.classList.add('over')}));
 ['dragleave','drop'].forEach(t=>d.addEventListener(t,e=>{e.preventDefault();d.classList.remove('over')}));d.addEventListener('drop',e=>set(e.dataTransfer.files[0]));
 $('#rf').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);
  if(!file){$('#fe').textContent='Unggah CV terlebih dahulu.';return}if(!fd.get('j')){toast('Pilih jalur IT yang dituju');return}
  $('#rf').hidden=true;$('#ld').hidden=false;$('#s1').classList.remove('on');$('#s2').classList.add('on');let n=0;
  const t=setInterval(()=>{n+=8+Math.random()*12;$('#lb').style.width=Math.min(n,100)+'%';if(n>=100){clearInterval(t);
   const r=()=>55+Math.floor(Math.random()*40),a=[r(),r(),r(),r()];
   sessionStorage.setItem('ep_hasil',JSON.stringify({nama:file.name,j:fd.get('j'),tgl:new Date().toISOString(),a,total:Math.round(a.reduce((x,y)=>x+y)/4)}));location.hash='#/hasil'}},350)}};

V.hasil=()=>{const h=JSON.parse(sessionStorage.getItem('ep_hasil')||'null');if(!h)return`<div class="wrap"><div class="card dash"><h3>Belum ada hasil review</h3><p class="mute">Unggah CV untuk mendapatkan review.</p><a class="btn" href="#/review">Review CV saya</a></div></div>`;
 const A=['Struktur dan format','Kesesuaian dengan jalur','Keahlian dan proyek','Kejelasan dan bahasa'];
 const S=[['Ringkasan profil','Prioritas tinggi','off'],['Pengalaman','Prioritas sedang','warn'],['Keahlian','Prioritas sedang','warn'],['Proyek dan portofolio','Prioritas tinggi','off']];
 const rec=PROG.filter(p=>p.jalur===h.j&&p.status==='Aktif').concat(PROG.filter(p=>p.status==='Aktif')).slice(0,3);
 return`<div class="wrap"><h1>Hasil Review AI</h1><div class="row" style="justify-content:space-between"><p class="mute" style="margin:0">${esc(h.nama)} · Jalur: ${jn(h.j)} · Direview pada ${new Date(h.tgl).toLocaleDateString('id-ID')}</p><span class="row" style="flex:0"><a class="btn ghost sm" href="#/review">Unggah versi baru</a><button class="btn sm" onclick="window.print()">Unduh hasil</button></span></div>
 <div class="grid g2" style="margin-top:1rem"><div class="card row"><div class="score" style="--s:${h.total};flex:0 0 130px"><span>${h.total}</span></div><div><b>Skor keseluruhan (dari 100)</b><p class="mute">Ringkasan singkat kesiapan CV untuk jalur yang dipilih.</p></div></div>
 <div class="card"><b>Skor per aspek</b>${A.map((a,i)=>`<div class="asp"><span>${a}</span><div class="bar"><i style="width:${h.a[i]}%"></i></div><b>${h.a[i]}/100</b></div>`).join('')}</div>
 <div class="card"><h3>Kekuatan</h3><ul><li>Poin kekuatan 1</li><li>Poin kekuatan 2</li><li>Poin kekuatan 3</li></ul></div><div class="card"><h3>Perlu diperbaiki</h3><ul><li>Poin perbaikan 1</li><li>Poin perbaikan 2</li><li>Poin perbaikan 3</li></ul></div></div>
 <div class="sec-h"><h2>Saran per bagian</h2></div><div class="card">${S.map(s=>`<div class="sug"><b>${s[0]}</b><span class="tag ${s[2]}">${s[1]}</span></div>`).join('')}</div>
 <div class="sec-h"><h2>Program yang disarankan untukmu</h2></div><div class="grid g3">${rec.map(p=>card(p)).join('')}</div>
 <p class="hint" style="margin-top:1rem">Review dihasilkan oleh AI dan bersifat saran. Tetap sesuaikan dengan kebutuhan dan penilaianmu sendiri.</p></div>`};

/* ---------- Auth ---------- */
const mailOk=v=>/^\S+@\S+\.\S+$/.test(v);
V.masuk=()=>`<div class="authwrap"><aside><a class="logo" href="#/">EduPath IT</a><h1 style="margin-top:2rem">Temukan jalur dan program IT yang tepat untukmu</h1><p class="mute">Simpan program favorit dan dapatkan review CV dengan AI.</p></aside>
 <form id="lf" novalidate><h2>Masuk</h2><p class="mute">Masuk ke akun EduPath IT mu.</p><div id="la"></div>
 <label>Email</label><input name="e" type="email" placeholder="nama@email.com" autocomplete="email"><label>Kata sandi</label><input name="p" type="password" placeholder="Masukkan kata sandi" autocomplete="current-password">
 <div class="row" style="justify-content:space-between;margin:.8rem 0"><label style="margin:0;font-weight:400;display:flex;gap:.4rem"><input type="checkbox" style="width:auto">Ingat saya</label><a class="hint" href="#/masuk" style="flex:0;white-space:nowrap">Lupa kata sandi?</a></div>
 <button class="btn block">Masuk</button><p class="hint" style="margin-top:1rem">Belum punya akun? <a href="#/daftar" style="color:var(--pri)">Daftar</a> · Admin? <a href="#/admin" style="color:var(--pri)">Masuk ke dashboard</a></p></form></div>`;
V.masuk.after=()=>$('#lf').onsubmit=e=>{e.preventDefault();const d=new FormData(e.target);
 if(!mailOk(d.get('e'))||!d.get('p')){$('#la').innerHTML='<div class="alert e">Email atau kata sandi salah. Coba lagi.</div>';return}
 localStorage.setItem('ep_user',JSON.stringify({email:d.get('e')}));toast('Berhasil masuk');location.hash='#/'};
V.daftar=()=>`<div class="authwrap"><aside><a class="logo" href="#/">EduPath IT</a><h1 style="margin-top:2rem">Buat akun dan mulai rencanakan karier ITmu</h1><ul><li>Simpan program yang kamu minati</li><li>Review CV dan portofolio dengan AI</li><li>Pantau riwayat review</li></ul></aside>
 <form id="df" novalidate><h2>Daftar</h2><p class="mute">Isi data berikut untuk membuat akun baru.</p>
 <label>Nama lengkap</label><input name="n" placeholder="Nama lengkap"><div class="err-t" data-e="n"></div>
 <label>Email</label><input name="e" type="email" placeholder="nama@email.com"><div class="err-t" data-e="e"></div>
 <label>Kata sandi</label><input name="p" type="password" placeholder="Minimal 8 karakter"><div class="hint">Gunakan kombinasi huruf, angka, dan simbol.</div><div class="err-t" data-e="p"></div>
 <label>Ulangi kata sandi</label><input name="p2" type="password" placeholder="Ulangi kata sandi"><div class="err-t" data-e="p2"></div>
 <label>Jalur IT yang diminati (opsional)</label><select name="j">${jalurOpts()}</select>
 <label style="display:flex;gap:.5rem;font-weight:400;margin-top:1rem"><input type="checkbox" name="t" style="width:auto">Saya menyetujui Syarat dan Ketentuan serta Kebijakan Privasi.</label><div class="err-t" data-e="t"></div>
 <button class="btn block" style="margin-top:1rem">Buat akun</button><p class="hint" style="margin-top:1rem">Sudah punya akun? <a href="#/masuk" style="color:var(--pri)">Masuk</a></p></form></div>`;
V.daftar.after=()=>$('#df').onsubmit=e=>{e.preventDefault();const f=e.target,v=n=>f.elements[n].value;const E={};
 if(v('n').trim().length<2)E.n='Isi nama lengkap.';if(!mailOk(v('e')))E.e='Format email tidak valid.';
 if(v('p').length<8||!/\d/.test(v('p'))||!/[a-z]/i.test(v('p')))E.p='Minimal 8 karakter dengan huruf dan angka.';
 if(v('p')!==v('p2'))E.p2='Kata sandi tidak sama.';if(!f.elements.t.checked)E.t='Setujui syarat dan ketentuan untuk melanjutkan.';
 $$('[data-e]',f).forEach(x=>x.textContent=E[x.dataset.e]||'');if(Object.keys(E).length)return;
 localStorage.setItem('ep_user',JSON.stringify({email:v('e'),nama:v('n')}));toast('Akun berhasil dibuat');location.hash='#/'};

/* ---------- Admin ---------- */
const side=on=>`<aside class="side"><strong>EduPath IT Admin</strong>${[['Dashboard','#/admin'],['Kelola Program','#/admin/program'],['Jalur Karier','#/jalur'],['Pengguna','#/admin'],['Riwayat Review AI','#/admin']].map(([t,h])=>`<a class="${t===on?'on':''}" href="${h}">${t}</a>`).join('')}<span class="grow"></span><a href="#/masuk">Keluar</a></aside>`;
V.admin=()=>{const bulan=[4,7,5,9,6,11],mx=Math.max(...bulan);
 return`<div class="adm">${side('Dashboard')}<div class="admc"><div class="row" style="justify-content:space-between"><h1>Dashboard</h1><span class="mute" style="flex:0">Admin</span></div>
 <div class="stats">${[['Total program',PROG.length],['Jalur karier',JALUR.length],['Pengguna terdaftar',128],['Review AI bulan ini',64]].map(s=>`<div class="card"><span class="mute">${s[0]}</span><b>${s[1]}</b></div>`).join('')}</div>
 <div class="grid g2"><div class="card"><b>Program ditambahkan per bulan</b> <span class="hint">6 bulan terakhir</span><div class="chart" style="margin-bottom:1.5rem">${bulan.map((v,i)=>`<div style="height:${v/mx*100}%" title="${v}"><small>Bln ${i+1}</small></div>`).join('')}</div></div>
 <div class="card"><b>Aksi cepat</b><div style="display:grid;gap:.5rem;margin-top:.6rem"><a class="btn" href="#/admin/program?baru=1">+ Tambah program</a><a class="btn ghost" href="#/admin/program">Kelola data program</a><a class="btn ghost" href="#/jalur">Kelola jalur karier</a></div></div></div>
 <div class="row" style="justify-content:space-between;margin:1.25rem 0 .5rem"><h2 style="margin:0">Program terbaru</h2><a href="#/admin/program" class="mute" style="flex:0;white-space:nowrap">Lihat semua →</a></div>
 <div class="tw"><table><tr><th>Nama program</th><th>Penyedia</th><th>Jalur</th><th>Status</th><th>Ditambahkan</th></tr>${PROG.slice(0,5).map(p=>`<tr><td>${esc(p.nama)}</td><td>${esc(p.penyedia)}</td><td>${jn(p.jalur)}</td><td>${stTag(p.status)}</td><td>${new Date(p.tgl).toLocaleDateString('id-ID')}</td></tr>`).join('')}</table></div></div></div>`};
const stTag=s=>`<span class="tag ${s==='Aktif'?'ok':s==='Draf'?'warn':'off'}">${s}</span>`;
V.adminP=q=>`<div class="adm">${side('Kelola Program')}<div class="admc"><div class="row" style="justify-content:space-between"><h1>Kelola Data Program</h1><button class="btn" id="add" style="flex:0;white-space:nowrap">+ Tambah program</button></div>
 <div class="row" style="margin:1rem 0"><input id="aq" placeholder="Cari nama program atau penyedia" aria-label="Cari"><select id="aj"><option value="">Semua jalur</option>${JALUR.map(j=>`<option value="${j.id}">${j.nama}</option>`).join('')}</select><select id="as"><option value="">Semua status</option><option>Aktif</option><option>Draf</option><option>Nonaktif</option></select></div>
 <div class="tw"><table><thead><tr><th>Nama program</th><th>Penyedia</th><th>Jalur</th><th>Biaya</th><th>Status</th><th>Aksi</th></tr></thead><tbody id="tb"></tbody></table></div><div class="hint" id="inf" style="margin-top:.5rem"></div><div id="ap"></div>
 <form class="card" id="pf" style="margin-top:1.5rem" novalidate hidden><h2 id="pt">Tambah program</h2><p class="mute">Formulir yang sama dipakai untuk menambah dan mengubah data.</p><input type="hidden" name="id">
 <div class="row"><div><label>Nama program *</label><input name="nama"></div><div><label>Penyedia *</label><input name="penyedia"></div></div>
 <div class="row"><div><label>Jalur IT *</label><select name="jalur">${jalurOpts()}</select></div><div><label>Biaya (Rp)</label><input name="biaya" type="number" min="0" placeholder="0 = gratis"></div><div><label>Durasi (bulan)</label><input name="durasi" type="number" min="1"></div><div><label>Mode belajar</label><select name="mode"><option>Online</option><option>Offline</option></select></div></div>
 <label>Deskripsi</label><textarea name="desc"></textarea>
 <div class="row"><div><label>Tautan situs penyedia</label><input name="url" type="url" placeholder="https://"></div><div><label>Status</label><select name="status"><option>Aktif</option><option>Draf</option><option>Nonaktif</option></select></div><div><label>Gambar program</label><input type="file" accept="image/*"></div></div>
 <div class="err-t" id="pe"></div><div class="row" style="justify-content:flex-end;margin-top:1rem"><button type="button" class="btn ghost" id="cn">Batal</button><button class="btn">Simpan</button></div></form>
 <dialog id="dlg"><h3>Hapus program ini?</h3><p class="mute" id="dm"></p><div class="row" style="justify-content:flex-end"><button class="btn ghost" id="dn">Batal</button><button class="btn danger" id="dy">Ya, hapus</button></div></dialog></div></div>`;
V.adminP.after=q=>{let page=1,delId=null;const f=$('#pf');
 const draw=()=>{const k=$('#aq').value.toLowerCase(),j=$('#aj').value,s=$('#as').value;
  const l=PROG.filter(p=>(!k||(p.nama+p.penyedia).toLowerCase().includes(k))&&(!j||p.jalur===j)&&(!s||p.status===s));const tot=Math.ceil(l.length/6)||1;page=Math.min(page,tot);const v=l.slice((page-1)*6,page*6);
  $('#tb').innerHTML=v.map(p=>`<tr><td>${esc(p.nama)}</td><td>${esc(p.penyedia)}</td><td>${jn(p.jalur)}</td><td>${rp(p.biaya)}</td><td>${stTag(p.status)}</td><td><button data-a="v" data-i="${p.id}">Lihat</button><button data-a="e" data-i="${p.id}">Edit</button><button class="d" data-a="d" data-i="${p.id}">Hapus</button></td></tr>`).join('')||'<tr><td colspan="6" class="mute">Tidak ada data.</td></tr>';
  $('#inf').textContent=`Menampilkan ${v.length} dari ${l.length} program`;$('#ap').innerHTML=pager(page,tot)};
 const open=p=>{f.hidden=false;f.reset();$('#pe').textContent='';$('#pt').textContent=p?'Edit program':'Tambah program';
  ['id','nama','penyedia','jalur','biaya','durasi','mode','desc','url','status'].forEach(k=>f.elements[k].value=p?(p[k]??''):(k==='mode'?'Online':k==='status'?'Aktif':''));f.scrollIntoView({behavior:'smooth'})};
 ['aq','aj','as'].forEach(i=>$('#'+i).oninput=()=>{page=1;draw()});
 $('#ap').onclick=e=>{const b=e.target.closest('[data-pg]');if(b){page=+b.dataset.pg;draw()}};
 $('#add').onclick=()=>open();$('#cn').onclick=()=>f.hidden=true;
 $('#tb').onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const p=PROG.find(x=>x.id==b.dataset.i);
  if(b.dataset.a==='e')open(p);if(b.dataset.a==='v')location.hash='#/program/'+p.id;
  if(b.dataset.a==='d'){delId=p.id;$('#dm').textContent=`Program "${p.nama}" akan dihapus dari direktori dan tidak bisa dikembalikan.`;$('#dlg').showModal()}};
 $('#dn').onclick=()=>$('#dlg').close();$('#dy').onclick=()=>{PROG=PROG.filter(p=>p.id!==delId);$('#dlg').close();toast('Program dihapus');draw()};
 f.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));
  if(!d.nama.trim()||!d.penyedia.trim()||!d.jalur){$('#pe').textContent='Nama program, penyedia, dan jalur wajib diisi.';return}
  const o={nama:d.nama.trim(),penyedia:d.penyedia.trim(),jalur:d.jalur,biaya:+d.biaya||0,durasi:+d.durasi||1,satuan:'bulan',mode:d.mode,desc:d.desc,url:d.url||'#',status:d.status};
  if(d.id){Object.assign(PROG.find(p=>p.id==d.id),o)}else PROG.unshift({id:Math.max(0,...PROG.map(p=>p.id))+1,tgl:new Date().toISOString().slice(0,10),...o});
  f.hidden=true;toast('Program disimpan');draw()};
 draw();if(new URLSearchParams(q).get('baru'))open()};

const notFound=()=>`<div class="wrap"><div class="card dash"><h3>Halaman tidak ditemukan</h3><a class="btn" href="#/">Kembali ke beranda</a></div></div>`;

/* ---------- Router ---------- */
function route(){
 const [path,q='']=(location.hash.slice(1)||'/').split('?'),seg=path.split('/').filter(Boolean);
 let v,arg=q,after;
 if(!seg.length)v=V.home;
 else if(seg[0]==='program')v=seg[1]?()=>V.program(seg[1]):()=>V.cari('');
 else if(seg[0]==='cari')v=V.cari;
 else if(seg[0]==='jalur'){v=seg[1]?()=>V.jalurD(seg[1]):V.jalur}
 else if(seg[0]==='review')v=V.review;else if(seg[0]==='hasil')v=V.hasil;
 else if(seg[0]==='masuk')v=V.masuk;else if(seg[0]==='daftar')v=V.daftar;
 else if(seg[0]==='admin')v=seg[1]?V.adminP:V.admin;
 else v=notFound;
 document.body.classList.toggle('auth',['masuk','daftar'].includes(seg[0]));
 document.body.classList.toggle('admin',seg[0]==='admin');
 app.innerHTML=v(arg);
 const key=Object.keys(V).find(k=>V[k]===v);if(key&&V[key].after)V[key].after(arg);
 else if(seg[0]==='cari')V.cari.after(q);
 $$('#menu a:not(.btn)').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#/'+seg[0]));
 $('#menu').classList.remove('open');window.scrollTo(0,0);
 document.title='EduPath IT';
}
$('#burger').onclick=()=>$('#menu').classList.toggle('open');
addEventListener('hashchange',route);route();
