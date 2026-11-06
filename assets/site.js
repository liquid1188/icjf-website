
(()=>{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const V=$('#view');
const ROM=n=>{const m=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let r='';for(const[v,s]of m)while(n>=v){r+=s;n-=v}return r};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtDate=d=>new Date(d+'T12:00:00').toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
const YL=['Rome conference','ICOLF founded','Renamed ICJF'];
// Online giving: paste the Forum's Stripe Payment Link and PayPal donate link here when ready.
const DONATE={stripe:'',stripeMonthly:'',paypal:''};
// Email list: paste a Mailchimp/Buttondown form action URL here when ready.
const NEWSLETTER={action:''};
const WEB3FORMS_KEY='bca9940b-833c-4b10-b08e-58123d08a6fe';
const FOCUS=[50,55,45,38,40,50,45,32,42,45,40,45,40,40,50,50];
const PAGEPHOTO={'how-we-started':1,'what-we-stand-for':9,'who-we-are':10,'projects':3,'books':0,'conferences':14,'news':8,'resources-2':6,'resources-on-the-persecution-and-genocide-of-christians-in-nigeria':11,'mug-shots-of-martyred-priests':13,'petition-against-religious-persecution-in-nigeria':12,'press':15,'podcast-series':2,'contact':4,'donate':7,'charter-of-the-rights-of-the-family':5,'model-declaration-on-the-rights-of-the-family':5};
const photoFor=(key,title)=>{if(key in PAGEPHOTO)return PAGEPHOTO[key];let h=0;for(const c of (key||title))h=(h*31+c.charCodeAt(0))>>>0;return h%HERO.hero.length};
// Organizations named in the Forum's text, linked on first mention per page (wording unchanged).
const ORGS=[
 [/International Center on Law, Life,? Faith and Family|\bICOLF\b/,'https://web.archive.org/web/2016/http://icolf.org/'],
 [/En Route Books (?:&|&amp;|and) Media/,'https://enroutebooksandmedia.com/'],
 [/WCAT Radio/,'https://www.wcatradio.com/'],
 [/Ave Maria School of Law/,'https://www.avemarialaw.edu/'],
 [/Pontifical Council for the Family/,'https://www.vatican.va/roman_curia/pontifical_councils/family/index.htm'],
 [/Dicastery for (?:the )?Laity,? (?:the )?Family and Life/,'https://www.laityfamilylife.va/'],
 [/(?:International )?Union of Catholic Jurists|Union Internationale des Juristes Catholiques/,'https://www.laityfamilylife.va/content/laityfamilylife/en/associazioni-e-movimenti/repertorio/unione-internazionale-dei-giuristi-cattolici.html'],
 [/Cardinal Stefan Wyszy[nń]ski University(?: in Warsaw)?/,'https://uksw.edu.pl/en/'],
 [/Jagiellonian University/,'https://en.uj.edu.pl/'],
 [/Ralston College/,'https://www.ralston.ac/'],
 [/(?:The )?Ruth Institute/,'https://ruthinstitute.org/'],
 [/Center for Family and Human Rights|\bC-Fam\b/,'https://c-fam.org/'],
 [/Ethics and Public Policy Center/,'https://eppc.org/'],
 [/Catholic Information Center/,'https://cicdc.org/'],
 [/Franciscan University of Steubenville|University of Steubenville/,'https://franciscan.edu/'],
 [/Christ Medicus Foundation/,'https://christmedicus.org/'],
 [/Sacred Heart Major Seminary/,'https://www.shms.edu/'],
 [/Aid to the Church in Need/,'https://www.churchinneed.org/'],
 [/Open Doors International/,'https://www.opendoors.org/'],
 [/University of Notre Dame,? (?:School of Law,? )?Sydney/,'https://www.notredame.edu.au/'],
 [/Global Liberty Alliance/,'https://globallibertyalliance.org/']];
function linkOrgs(root){
  const done=new Set();
  $$('a[href]',root).forEach(a=>ORGS.forEach(([re,u],i)=>{if(a.href.startsWith(u)||re.test(a.textContent))done.add(i)}));
  const scopes=$$('.prose, .tli .b, .pinfo, .pt, .mission, .origins .copy, .pod .podcopy',root);
  for(const sc of scopes){
    const w=document.createTreeWalker(sc,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('a,button,h1,script,style,.btn')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
    const nodes=[];while(w.nextNode())nodes.push(w.currentNode);
    for(let node of nodes){
      ORGS.forEach(([re,u],i)=>{
        if(done.has(i)||!node||!node.parentNode)return;
        const m=node.textContent.match(re);if(!m)return;
        const after=node.splitText(m.index);const rest=after.splitText(m[0].length);
        const a=document.createElement('a');a.href=u;a.target='_blank';a.rel='noopener';a.className='orgl';a.textContent=m[0];
        after.replaceWith(a);done.add(i);node=rest;
      });
    }
  }
}
const PILLARS=['LAW','LIFE','FAITH','FAMILY','FIDELITY','FREEDOM'];
const ICON={ext:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17 17 7M9 7h8v8"/></svg>',arrow:'<span class="ar">→</span>',search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',cross:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.6 2h2.8l-.5 6.4L19.3 7.9V10.7l-6.4-.5.5 11.8h-2.8l.5-11.8-6.4.5V7.9l6.4.5z"/></svg>'};
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};

const NAV=[
  {t:'About',k:['how-we-started','what-we-stand-for','who-we-are'],kids:[['How We Started','how-we-started'],['What We Stand For','what-we-stand-for'],['Who We Are','who-we-are']]},
  {t:'Projects',h:'projects'},{t:'Books',h:'books'},{t:'Conferences',h:'conferences'},{t:'News',h:'news'},
  {t:'Resources',k:['charter-of-the-rights-of-the-family','model-declaration-on-the-rights-of-the-family','resources-2','cease-rp','catechesis-on-old-age','persecution-and-genocide-of-christians-in-nigeria','resources-on-the-persecution-and-genocide-of-christians-in-nigeria','mug-shots-of-martyred-priests','petition-against-religious-persecution-in-nigeria'],kids:[['Charter of the Rights of the Family','charter-of-the-rights-of-the-family'],['Model Declaration on the Rights of the Family','model-declaration-on-the-rights-of-the-family'],['CEaSE RP','resources-2'],['Persecution of Christians in Nigeria','persecution-and-genocide-of-christians-in-nigeria'],['Catechesis on Old Age','catechesis-on-old-age']]},
  {t:'Press',h:'press'},{t:'Podcasts',h:'podcast-series'},{t:'Contact',h:'contact'}];
const PARENT={};NAV.forEach(n=>(n.kids||[]).forEach(([,s])=>PARENT[s]=n.t));
['how-we-started','what-we-stand-for','who-we-are'].forEach(s=>PARENT[s]='About');

let IDX,HERO,cache={},postBySlug={};
const get=async u=>cache[u]||(cache[u]=fetch(u).then(r=>{if(!r.ok)throw new Error(u);return r.json()}));
const page=s=>get(`data/p/${s}.json`);
const chunk=n=>get(`data/n/${n}.json`), thumbs=n=>get(`data/n/t${n}.json`);

/* ---------- chrome ---------- */
function buildChrome(){
  $('#brandSeal').src=HERO.sealSmall;
  $('#nav').innerHTML=NAV.map(n=>n.kids?`<div><button class="nl" data-k="${n.k.join(' ')}" aria-haspopup="true">${n.t}</button><div class="dd">${n.kids.map(([t,s])=>`<a href="#${s}">${esc(t)}</a>`).join('')}</div></div>`:`<div><a class="nl" href="#${n.h}" data-k="${n.h}">${n.t}</a></div>`).join('');
  $('#mm').innerHTML=`<a href="#home">Home</a>`+NAV.map(n=>n.kids?`<a href="#${n.kids[0][1]}">${n.t}</a>${n.kids.map(([t,s])=>`<a class="sub" href="#${s}">${esc(t)}</a>`).join('')}`:`<a href="#${n.h}">${n.t}</a>`).join('')+`<a href="#donate">Donate</a><a href="#" id="mmSearch">Search</a><div class="mmfoot">${PILLARS.join(' · ')}</div>`;
  $$('#mm a').forEach((a,i)=>a.style.transitionDelay=(0.15+i*0.03)+'s');
  const words=PILLARS.map(w=>`<span>${w}</span>`).join('');const mq=$('#mq');mq.innerHTML=words;
  requestAnimationFrame(()=>{const setW=mq.scrollWidth;let n=1;while(mq.scrollWidth<innerWidth+setW*1.2&&n<12){mq.insertAdjacentHTML('beforeend',words);n++}
    let x=0,last=performance.now();const speed=38;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reduce){const tick=t=>{const dt=Math.min(64,t-last);last=t;x-=speed*dt/1000;if(-x>=setW)x+=setW;mq.style.transform=`translate3d(${x}px,0,0)`;requestAnimationFrame(tick)};requestAnimationFrame(tick)}});
  $('#ftcols').innerHTML=`<div class="ftop"><a class="fb" href="#home"><img src="${HERO.sealSmall}" alt=""><span>International Catholic<br>Jurists Forum</span></a><blockquote class="fq">“…a forum for Catholic jurists and scholars to study, research, and discuss important issues of the day related to attacks on the rights of the family, life, and religious freedom.”<a href="#what-we-stand-for">Mission Statement</a></blockquote></div>
  <form class="nl" id="nlForm" novalidate><div><h4>News from the Forum</h4><p>Conferences, books, and statements, sent occasionally.</p></div><label class="sr" for="nlEmail">Email</label><input id="nlEmail" type="email" placeholder="Your email address" autocomplete="email" required><button class="btn gold" type="submit">Subscribe</button><span class="nlmsg" role="status"></span></form>
  <div class="fgroups">${[['About',[['How We Started','how-we-started'],['What We Stand For','what-we-stand-for'],['Who We Are','who-we-are'],['Charter of the Rights of the Family','charter-of-the-rights-of-the-family'],['Model Declaration','model-declaration-on-the-rights-of-the-family']]],
    ['Work',[['Projects','projects'],['Books','books'],['Conferences','conferences']]],
    ['Media',[['News','news'],['Podcasts','podcast-series'],['Press','press']]],
    ['Resources',[['CEaSE RP','resources-2'],['Persecution of Christians in Nigeria','persecution-and-genocide-of-christians-in-nigeria'],['Catechesis on Old Age','catechesis-on-old-age'],['Contact','contact'],['Donate','donate']]]]
    .map(([g,ls])=>`<div class="fg"><h4>${g}</h4><nav>${ls.map(([t,h])=>`<a href="#${h}">${t}</a>`).join('')}</nav></div>`).join('')}</div>`;
  $('#yr').textContent=new Date().getFullYear();
  const nf=$('#nlForm');if(nf)nf.onsubmit=e=>{e.preventDefault();const em=$('#nlEmail',nf),m=$('.nlmsg',nf);
    if(!em.checkValidity()){m.textContent='Please enter a valid email address.';return}
    if(NEWSLETTER.action){const f=document.createElement('form');f.method='post';f.action=NEWSLETTER.action;f.target='_blank';f.innerHTML=`<input name="EMAIL" value="${esc(em.value)}"><input name="email" value="${esc(em.value)}">`;document.body.appendChild(f);f.submit();f.remove();m.textContent='Thank you. Please check your inbox to confirm.';em.value=''}
    else m.textContent='Sign-up opens soon. For now, please write to us through the Contact page.'};
  $('#menuBtn').onclick=()=>toggleMenu();
  $('#srchBtn').onclick=()=>openPal();
  $('#mmSearch').onclick=e=>{e.preventDefault();toggleMenu(false);openPal()};
  const dv=$('#dv'),on=document.documentElement.classList.contains('dv');
  dv.textContent=on?'View mobile version':'View desktop version';
  dv.onclick=()=>{store.set('icjf-dv',on?'':'1');
    // apply immediately, then reload so iOS Safari lays the page out at the new width
    $('meta[name=viewport]').setAttribute('content',on?'width=device-width, initial-scale=1, viewport-fit=cover':'width=1280, viewport-fit=cover');
    document.documentElement.classList.toggle('dv',!on);setTimeout(()=>location.reload(),60)};
}
function toggleMenu(force){const m=$('#mm'),open=force??!m.classList.contains('open');m.classList.toggle('open',open);m.setAttribute('aria-hidden',!open);$('#menuBtn').innerHTML=open?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6 6 18"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 8h16M4 16h16"/></svg>';document.body.style.overflow=open?'hidden':'';if(open)$('#hdr').classList.add('dark')}

let lastY=0,darkTop=true;
function onScroll(){
  const y=scrollY,h=$('#hdr');
  h.classList.toggle('solid',y>60);
  h.classList.toggle('dark',darkTop&&y<=60);
  lastY=y;
  const d=document.documentElement,max=d.scrollHeight-innerHeight;$('#progress').style.width=(max>0?y/max*100:0)+'%';
  $$('[data-par]').forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;el.style.transform=`translate3d(0,${(r.top-innerHeight/2)*-0.15 - r.height*.12}px,0)`});
  tocSpy&&tocSpy();
}
addEventListener('scroll',onScroll,{passive:true});

let io;
function reveal(){io&&io.disconnect();io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});$$('.rv,.rvi').forEach(el=>io.observe(el))}

/* ---------- content helpers ---------- */
const CAN_EMBED=!/claude\.ai|claudeusercontent|anthropic/.test(location.hostname);
const ytId=u=>{const m=String(u).match(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?(?:.*&)?v=|live\/|shorts\/)|youtu\.be\/)([\w-]{11})/);return m?m[1]:null};
const player=(id,title='')=>`<div class="player"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1" title="${esc(title||'Video')}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
function enhance(root){
  try{linkOrgs(root)}catch(e){}
  $$('[data-embed]',root).forEach(d=>{
    const yt=d.dataset.yt,src=d.dataset.embed,t=d.dataset.title||'';
    const href=yt?`https://www.youtube.com/watch?v=${yt}`:src.replace('/embed/','/');
    const host=yt?'YouTube':(src.match(/\/\/(?:www\.|player\.)?([^/.]+)/)||[,'video'])[1];
    const w=document.createElement('div');
    if(CAN_EMBED){
      w.innerHTML=yt?player(yt,t):`<div class="player"><iframe src="${esc(src)}" title="${esc(t||host)}" loading="lazy" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
      d.replaceWith(w.firstChild);return;
    }
    const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener';
    a.className='vid'+(d.dataset.thumb?'':' plain');
    a.innerHTML=(d.dataset.thumb?`<img src="${d.dataset.thumb}" alt="">`:'')+`<span class="pl"><i><svg viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg></i></span><span class="lab">Watch on ${host[0].toUpperCase()+host.slice(1)}${t&&!/youtube video player/i.test(t)?' · '+esc(t):''}</span>`;
    d.replaceWith(a);
  });
  if(CAN_EMBED){
    // a YouTube link that stands on its own line gets a player right beneath it
    $$('.prose a[href]',root).forEach(a=>{
      const id=ytId(a.href);if(!id||a.closest('.player'))return;
      const blk=a.closest('p,li');if(!blk)return;
      const others=blk.textContent.replace(a.textContent,'').trim();
      if(others.length>60)return;
      if(blk.nextElementSibling&&blk.nextElementSibling.dataset.yt===id)return;
      const w=document.createElement('div');w.innerHTML=player(id,a.textContent.trim());const pl=w.firstChild;pl.dataset.yt=id;
      blk.after(pl);
    });
  }
  $$('.prose p, .prose > a',root).forEach(p=>{
    const as=p.tagName==='A'?[p]:$$(':scope > a',p);
    if(as.length!==1)return;const a=as[0];
    if(p.tagName!=='A'&&p.textContent.trim()!==a.textContent.trim())return;
    if(!a.textContent.trim()||a.closest('.player,.pn')||a.classList.contains('btn')||a.classList.contains('more'))return;
    if(CAN_EMBED&&ytId(a.href))return;
    let row=p;if(p.tagName==='A'){row=document.createElement('p');p.replaceWith(row);row.appendChild(a)}
    row.classList.add('linkrow');
    const ext=(a.getAttribute('href').match(/\.(pdf|docx?)(\?|$)/i)||[])[1];
    $$('br',a).forEach(b=>b.replaceWith(' '));
    if(ext)a.insertAdjacentHTML('afterbegin',`<span class="bdg">${ext.toUpperCase()}</span>`);
  });
  $$('a[href^="http"]',root).forEach(a=>{a.target='_blank';a.rel='noopener'});
}
function phead(title,{crumbs=[],sub='',img,key}={}){
  key=key||curSlug();const pi=photoFor(key,title);
  const bg=img||HERO.hero[pi].src;const fy=img?35:FOCUS[pi];
  return `<header class="phead"><div class="bg"><img src="${bg}" alt="" style="object-position:50% ${fy}%;transform-origin:50% ${fy}%"></div><img class="seal-bg" src="${HERO.seal}" alt=""><div class="wrap"><nav class="crumbs rv"><a href="#home">Home</a>${crumbs.map(([t,h])=>`<span>/</span>${h?`<a href="#${h}">${esc(t)}</a>`:`<em>${esc(t)}</em>`}`).join('')}</nav><h1 class="rv d1">${esc(title)}</h1>${sub?`<div class="sub rv d2">${sub}</div>`:''}</div></header>`;
}
const crumbsFor=s=>PARENT[s]?[[PARENT[s],null]]:[];
function cardHTML(c,i){
  const ext=/^https?:/.test(c.href), yid=CAN_EMBED&&ytId(c.href);
  if(yid)return `<div class="tcard vcard rv d${i%4}">${player(yid,c.title)}<div class="tx"><h3>${esc(c.title)}</h3>${(c.sub||[]).map(s=>`<span class="sub">${esc(s)}</span>`).join('')}<a class="more" href="${esc(c.href)}" target="_blank" rel="noopener" style="margin-top:auto;font-size:16px;align-self:flex-start">YouTube ${ICON.ext.replace('<svg','<svg style="width:13px;height:13px"')}</a></div></div>`;
  return `<a class="tcard rv d${i%4}" href="${esc(c.href)}"${ext?' target="_blank" rel="noopener"':''} style="--r:${c.ratio?1/c.ratio:1.33}">${c.img?`<div class="im"><img src="${c.img}" alt=""></div>`:''}${ext?`<span class="ext">${ICON.ext}</span>`:''}<div class="tx"><h3>${esc(c.title)}</h3>${(c.sub||[]).map(s=>`<span class="sub">${esc(s)}</span>`).join('')}</div></a>`;
}
function personCard(c,i){return `<a class="person rv d${i%4}" href="${esc(c.href)}"><div class="ph">${c.img?`<img src="${c.img}" alt="${esc(c.title)}">`:''}</div><h3>${esc(c.title)}</h3>${(c.sub||[]).map(s=>`<div class="role">${esc(s)}</div>`).join('')}</a>`}
function bookCard(c){const ext=/^https?:/.test(c.href);return `<a class="book" href="${esc(c.href)}"${ext?' target="_blank" rel="noopener"':''}><div class="cv"><img src="${c.img}" alt=""></div><h4>${esc(c.title)}</h4></a>`}
let NEWSFALL=[],NEWSFALLi=0;
function newsCard(p,th,cls=''){
  const t=th&&th[p.slug];
  return `<a class="ncard rv ${cls}" href="#${p.slug}"><div class="im${t?'':' none'}">${t?`<img src="${t}" alt="">`:(()=>{const pool=NEWSFALL.length?NEWSFALL:[...Array(HERO.hero.length).keys()];const i=NEWSFALL.length?pool[(NEWSFALLi++)%pool.length]:[...p.slug].reduce((a,c)=>a+c.charCodeAt(0),0)%pool.length;return `<img src="${HERO.hero[i].src}" alt="" style="object-position:50% ${FOCUS[i]}%"><span>${esc((p.tags[0]||'News'))}</span>`})()}</div><div><div class="meta"><span>${fmtDate(p.date)}</span>${p.tags[0]?`<span class="tg">${esc(p.tags[0])}</span>`:''}</div><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p></div></a>`;
}

/* book pages: Description / Reviews / Articles become organized, collapsible cards */
function bookify(prose){
  const kids=[...prose.children];
  const h1s=kids.filter(k=>k.tagName==='H1');
  if(h1s.length<2||!/^(Description|Descrizione)/i.test(h1s[0].textContent.trim()))return false;
  const frag=document.createDocumentFragment();
  const chips=document.createElement('nav');chips.className='bchips';frag.appendChild(chips);
  let sec=null,items=null,item=null,secIdx=0;
  const newSec=h=>{sec=document.createElement('section');sec.className='bsec';sec.id='bsec-'+(secIdx++);sec.appendChild(h);frag.appendChild(sec);items=null;item=null;
    const b=document.createElement('button');b.textContent=h.textContent.trim().replace(/ for Clerical Sexual Misconduct.*$/,'');b.onclick=()=>scrollTo({top:sec.getBoundingClientRect().top+scrollY-90,behavior:'smooth'});chips.appendChild(b)};
  const newItem=h=>{if(!items){items=document.createElement('div');items.className='bitems';sec.appendChild(items)}
    item=document.createElement('article');item.className='bitem';const hd=document.createElement('header');hd.appendChild(h);item.appendChild(hd);
    const body=document.createElement('div');body.className='bbody';item.appendChild(body);items.appendChild(item)};
  for(const k of kids){
    if(k.tagName==='H1'){newSec(k);continue}
    if(!sec){frag.appendChild(k);continue}
    const isDesc=secIdx===1;
    if(!isDesc&&(k.tagName==='H3'||k.tagName==='H2')){newItem(k);continue}
    if(k.tagName==='HR'){continue}
    if(item){const hd=item.querySelector('header'),body=item.querySelector('.bbody');
      if(k.tagName==='H4'&&!body.children.length&&/•/.test(k.textContent)){k.className='bmeta';hd.appendChild(k)}else body.appendChild(k);continue}
    sec.appendChild(k);
  }
  prose.innerHTML='';prose.appendChild(frag);prose.classList.add('book');prose.classList.remove('dropcap');
  $$('.bsec',prose).forEach(sc=>{const n=$$('.bitem',sc).length;if(n>1)sc.querySelector('h1').insertAdjacentHTML('beforeend',` <small>${n} entries</small>`)});
  // description: cover beside the text, buy links as buttons
  const d=prose.querySelector('.bsec');
  if(d){const img=d.querySelector(':scope > img, :scope > p > img');
    if(img){const wrap=document.createElement('div');wrap.className='bhero';const cv=document.createElement('div');cv.className='bcover';
      const tx=document.createElement('div');tx.className='btext';
      const h=d.querySelector('h1');[...d.childNodes].forEach(n=>{if(n!==h)tx.appendChild(n)});
      const im=tx.querySelector('img');(im.closest('p')&&im.closest('p').textContent.trim()===''?im.closest('p'):im).remove();cv.appendChild(im);
      wrap.append(cv,tx);d.appendChild(wrap)}
    const LOGO={wipfandstock:'wipf.png',amazon:'amazon.svg',clunymedia:'cluny.png',angelicopress:'angelico.png',enroutebooksandmedia:'enroute.png'};
    $$('p',d).forEach(p=>{const as=$$('a',p);
      if(/^\s*Edited by\s/.test(p.textContent)&&as.length===0){p.classList.add('beds');p.innerHTML=p.innerHTML.replace(/^\s*Edited by\s+/,'<span>Edited by</span><b>')+'</b>';return}
      if(as.length>=2&&as.every(a=>/^https?:/.test(a.getAttribute('href')||''))){p.classList.add('bbuy');$$('br',p).forEach(b=>b.remove());
        p.childNodes.forEach(n=>{if(n.nodeType===3&&n.textContent.trim())n.replaceWith(Object.assign(document.createElement('span'),{className:'bl',textContent:n.textContent.trim()}))});
        as.forEach(a=>{const host=(a.hostname||'').replace(/^www\./,'').split('.')[0];const f=LOGO[host];
          if(f){const t=a.textContent.trim();a.innerHTML=`<img src="img/sellers/${f}" alt="${esc(t)}">`;a.title=t;a.classList.add('lg')}})}});}
  // testimonial sections without item headings: quote cards
  $$('.bsec',prose).forEach(sc=>{if(sc.querySelector('.bitems'))return;
    const ps=$$(':scope > p',sc).filter(p=>/[“"]/.test(p.textContent)&&/[-–—]\s?[A-Z][^-–—]{2,80}$/.test(p.textContent.trim()));
    if(ps.length<2)return;const box=document.createElement('div');box.className='bquotes';ps[0].before(box);
    ps.forEach(p=>{const t=p.innerHTML.trim(),m=t.match(/^(.*[”"…\.])\s*[-–—]\s?([^-–—<]{2,120})$/s);
      const q=document.createElement('blockquote');q.className='bq';q.innerHTML=m?`<div class="bbody"><p>${m[1]}</p></div><cite>${m[2]}</cite>`:`<div class="bbody"><p>${t}</p></div>`;box.appendChild(q);p.remove()})});
  // collapse long bodies
  $$('.bitem,.bq',prose).forEach(it=>{const b=$('.bbody',it);if(!b)return;
    if(b.textContent.trim().length<(it.classList.contains('bq')?420:520)&&!b.querySelector('img,.player,.vid'))return;
    it.classList.add('clip');const btn=document.createElement('button');btn.className='bmore';btn.innerHTML='Read more <span>↓</span>';
    btn.onclick=()=>{const open=it.classList.toggle('open');btn.innerHTML=open?'Show less <span>↑</span>':'Read more <span>↓</span>';if(!open)it.scrollIntoView({block:'nearest',behavior:'smooth'})};
    (it.querySelector('cite')||b).after(btn)});
  return true;
}
function podcastify(prose){
  const kids=[...prose.children];const frag=document.createDocumentFragment();
  let ser=null,grid=null,ep=null,n=0;
  const EP=/^\s*(Podcast\s+(\d+)\s*:?\s*\(([^)]*)\)\s*:?|(\d+)\.\s*\(([^)]*)\)\s*:?)/;
  const nav=document.createElement('nav');nav.className='bchips pchips';frag.appendChild(nav);
  for(const k of kids){
    if(k.tagName==='H2'){ser=document.createElement('section');ser.className='pser';ser.id='pser-'+(n++);
      const full=k.textContent.trim(),m=full.match(/^(.*?)\s*(\((?:as of[^)]*)\))\s*$/i);
      k.innerHTML=esc(m?m[1]:full)+(m?` <small>${esc(m[2])}</small>`:'');ser.appendChild(k);
      const info=document.createElement('div');info.className='pinfo';ser.appendChild(info);
      grid=document.createElement('div');grid.className='pgrid';ser.appendChild(grid);frag.appendChild(ser);ep=null;
      const b=document.createElement('button');b.textContent=(m?m[1]:full).split(':')[0];const sref=ser;b.onclick=()=>scrollTo({top:sref.getBoundingClientRect().top+scrollY-90,behavior:'smooth'});nav.appendChild(b);continue}
    if(!ser){frag.appendChild(k);continue}
    if(k.tagName==='HR')continue;
    const t=k.textContent,m=t.match(EP);
    if(k.tagName==='P'&&m){
      const num=m[2]||m[4],date=(m[3]||m[5]||'').trim();
      ep=document.createElement('article');ep.className='pep';
      // keep the text verbatim; lift the "Podcast N (date):" label into the card header
      const body=k.cloneNode(true);const st=body.querySelector('strong');
      if(st&&EP.test(st.textContent))st.remove();else body.innerHTML=body.innerHTML.replace(/^\s*\d+\.\s*\([^)]*\)\s*:?\s*/,'');
      $$('br',body).forEach(b=>{if(!b.nextSibling||!b.nextSibling.textContent?.trim())b.remove()});
      ep.innerHTML=`<header><span class="pnum">${num}</span><span class="pd">${esc(date)}</span></header><div class="pmedia"></div><div class="pt"></div><div class="pl"></div>`;
      $('.pt',ep).append(...body.childNodes);grid.appendChild(ep);continue}
    const links=k.tagName==='P'?$$('a',k):[];
    if(ep&&links.length&&k.textContent.trim()===links.map(a=>a.textContent).join('').trim()){
      links.forEach(a=>{const id=ytId(a.href);
        if(id&&!$('.pmedia',ep).childElementCount){const mb=$('.pmedia',ep);mb.innerHTML=`<button class="pthumb" aria-label="Play ${esc(a.textContent)}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy"><span class="pplay"><svg viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg></span></button>`;
          $('button',mb).onclick=()=>{if(CAN_EMBED){mb.innerHTML=player(id,a.textContent).replace('?rel=0','?autoplay=1&rel=0')}else window.open(a.href,'_blank')}}
        a.classList.add(id?'pw':/spreaker/.test(a.href)?'pa':'px');$('.pl',ep).appendChild(a)});continue}
    if(k.tagName==='P'&&!ep){$('.pinfo',ser).appendChild(k);continue}
    if(links.length&&k.textContent.trim()===links.map(a=>a.textContent).join('').trim()){const f=document.createElement('p');f.className='pfoot';f.append(...links);ser.appendChild(f);continue}
    (ep?$('.pt',ep):$('.pinfo',ser)).appendChild(k);
  }
  $$('.pep',frag).forEach(e=>{if(!$('.pmedia',e).childElementCount)$('.pmedia',e).remove()});
  prose.innerHTML='';prose.appendChild(frag);prose.classList.add('book','pods');prose.classList.remove('dropcap');
  $$('.pinfo',prose).forEach(i=>{const ps=$$('p',i);if(ps.length>2){const d=document.createElement('details');d.innerHTML='<summary>About this series</summary>';ps.slice(1).forEach(p=>d.appendChild(p));i.appendChild(d)}});
  // newest first
  $$('.pgrid',prose).forEach(g=>[...g.children].reverse().forEach(c=>g.appendChild(c)));
  $$('.pser',prose).forEach(sc=>{const c=$$('.pep',sc).length;sc.querySelector('h2').insertAdjacentHTML('beforeend',`<span class="pc">${c} episodes</span>`)});
  podcastUpdates(prose);
}
// Pull any newer episodes straight from each series' Spreaker show, so the page stays current on its own.
async function podcastUpdates(prose){
  for(const sc of $$('.pser',prose)){
    const links=$$('.pep a[href*="spreaker.com/episode/"]',sc);if(!links.length)continue;
    const known=new Set(links.map(a=>(a.href.match(/--(\d+)\/?$/)||[])[1]).filter(Boolean));
    try{
      const one=[...known][0];
      const ep=await fetch(`https://api.spreaker.com/v2/episodes/${one}`).then(r=>r.json());
      const show=ep.response.episode.show_id;
      const list=await fetch(`https://api.spreaker.com/v2/shows/${show}/episodes?limit=50&sorting=newest`).then(r=>r.json());
      const maxN=Math.max(0,...$$('.pep .pnum',sc).map(x=>+x.textContent||0));
      const fresh=list.response.items.filter(e=>{if(known.has(String(e.episode_id)))return false;const m=e.title.match(/^\s*Episode\s+(\d+)\s*:/i);return m&&+m[1]>maxN});
      if(!fresh.length||!document.body.contains(sc))continue;
      const grid=$('.pgrid',sc);
      fresh.reverse().forEach(e=>{
        const m=e.title.match(/^\s*Episode\s+(\d+)\s*:\s*(.*?)\s*(\(([^)]*)\))?\s*$/i);
        const num=m?m[1]:'',title=m?m[2]:e.title,date=m&&m[4]?m[4]:new Date(e.published_at.replace(' ','T')+'Z').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
        const img=(e.image_original_url||e.image_url||'').replace(/t_square_limited_\d+/,'t_square_limited_720');
        const card=document.createElement('article');card.className='pep pnew';
        card.innerHTML=`<header><span class="pnum">${esc(num)}</span><span class="pd">${esc(date)}</span><span class="ptag">New</span></header>${img?`<div class="pmedia pmsq"><img src="${esc(img)}" alt="" loading="lazy"></div>`:''}<div class="pt"><p>${esc(title)}</p></div><div class="pl"><a class="pa" href="${esc(e.site_url)}" target="_blank" rel="noopener">Listen on Spreaker</a></div>`;
        grid.prepend(card)});
      const pc=$('h2 .pc',sc);if(pc)pc.textContent=`${$$('.pep',sc).length} episodes`;
    }catch(err){/* offline or API change: the page simply shows the listed episodes */}
  }
}
function memorial(prose){
  const items=[];let name=null;
  [...prose.querySelectorAll('strong, img')].forEach(el=>{
    if(el.tagName==='STRONG'){if(el.querySelector('img'))return;const t=el.textContent.replace(/\s+/g,' ').trim();if(!t)return;
      // "Fr." and the name are sometimes split across two bold runs
      if(name&&!name.img&&/^(Fr\.|Rev\.|Seminarian)$/.test(name.n)){name.n+=' '+t;return}
      name={n:t};items.push(name);return}
    if(name&&!name.img){name.img=el.getAttribute('src');const a=el.closest('a');name.href=a?a.getAttribute('href'):''}
  });
  const ok=items.filter(i=>i.img);if(ok.length<3)return;
  prose.innerHTML=`<div class="memgrid">${ok.map((i,k)=>`<figure class="mem rv d${k%4}"><div class="mph"><img src="${i.img}" alt="${esc(i.n)}"></div><figcaption><span class="mn">${esc(i.n)}</span>${i.href?`<a class="more" href="${esc(i.href)}" target="_blank" rel="noopener">Read the report →</a>`:''}</figcaption></figure>`).join('')}</div>`;
  prose.classList.remove('dropcap');prose.classList.add('memorial');
}
let tocSpy=null;
function buildTOC2(prose,host){
  const hs=$$('.bsec > h1',prose);if(!host)return;
  host.innerHTML='<b>On this page</b>'+hs.map((h,i)=>`<button data-i="${i}">${esc(h.textContent.trim())}</button>`).join('');
  $$('button',host).forEach(b=>b.onclick=()=>scrollTo({top:hs[b.dataset.i].getBoundingClientRect().top+scrollY-100,behavior:'smooth'}));
  tocSpy=()=>{let k=0;hs.forEach((h,i)=>{if(h.getBoundingClientRect().top<160)k=i});$$('button',host).forEach((b,i)=>b.classList.toggle('on',i===k))};
}
function buildTOC(prose,host){
  const hs=$$('h1,h2',prose).filter(h=>h.textContent.trim().length>1);
  if(hs.length<3){host.parentElement.classList.add('full');host.remove();return}
  host.innerHTML='<b>On this page</b>'+hs.map((h,i)=>`<button data-i="${i}">${esc(h.textContent.trim())}</button>`).join('');
  $$('button',host).forEach(b=>b.onclick=()=>scrollTo({top:hs[b.dataset.i].getBoundingClientRect().top+scrollY-100,behavior:'smooth'}));
  tocSpy=()=>{let k=0;hs.forEach((h,i)=>{if(h.getBoundingClientRect().top<160)k=i});$$('button',host).forEach((b,i)=>b.classList.toggle('on',i===k))};
}

/* ---------- views ---------- */
async function home(){
  darkTop=true;
  const [ws,hs,pr,bk,cf,ww,pc,t0]=await Promise.all(['what-we-stand-for','how-we-started','projects','books','conferences','who-we-are','podcast-series'].map(page).concat([thumbs(0)]));
  const D=new DOMParser();
  const wsd=D.parseFromString(ws.html,'text/html').body, hsd=D.parseFromString(hs.html,'text/html').body;
  const h3s=$$('h3',wsd);const mission=[];let n=h3s[0]?.nextElementSibling;while(n&&n.tagName==='P'){mission.push(n.innerHTML);n=n.nextElementSibling}
  const objs=$$('li',wsd).map(li=>li.innerHTML);
  const origins=$$('p',hsd).map(p=>p.innerHTML);
  const exec=ww.sections[0]?.cards||[];
  const pcd=D.parseFromString(pc.html,'text/html').body;const pcTitle=$('h2',pcd)?.textContent||'';
  const pps=$$('p',pcd);const pcDesc=(pps.find(p=>/^\s*Description:/.test(p.textContent))||{}).innerHTML||'';
  const pcBy=(pps.find(p=>/^\s*Interviews conducted by/.test(p.textContent))||{}).textContent||'';
  // featured episode: Podcast 5, with the Forum's Executive Director
  let feat=null;{const ep=pps.find(p=>/^\s*Podcast 5\b/.test(p.textContent));
    if(ep){let n=ep.nextElementSibling,id=null;while(n&&!id&&!/^\s*Podcast \d/.test(n.textContent)){const a=n.querySelector&&n.querySelector('a[href]');id=a&&ytId(a.href);n=n.nextElementSibling}
      const hd=ep.querySelector('strong')?.textContent.trim()||'';if(id)feat={id,head:hd,text:ep.textContent.replace(hd,'').trim(),label:ep.textContent.trim()}}}
  const latest=IDX.posts.slice(0,8);
  const projNames=['Leo','Francis','Benedict','John Paul II'];
  V.innerHTML=`
  <section class="hero" id="top">
    <div class="slides">${HERO.hero.map((h,i)=>`<figure${i===0?' class="on"':''} style="--o:${[30,70,50,20,80][i%5]}% ${[40,60,30,70,50][i%5]}%"><img src="${h.src}" alt=""></figure>`).join('')}</div>
    <div class="inner">
      <div class="sealwrap"><svg viewBox="0 0 200 200" aria-hidden="true"><defs><path id="ring" d="M100,100 m-84.6,0 a84.6,84.6 0 1,1 169.2,0 a84.6,84.6 0 1,1 -169.2,0"/></defs><circle cx="100" cy="100" r="89.5" fill="none" stroke="rgba(18,15,12,.9)" stroke-width="21"/><circle cx="100" cy="100" r="100" fill="none" stroke="#d6b878" stroke-width=".9"/><circle cx="100" cy="100" r="79" fill="none" stroke="rgba(214,184,120,.75)" stroke-width=".8"/><text><textPath href="#ring" textLength="526" lengthAdjust="spacing">${(PILLARS.join(' ✠ ')+' ✠ ')}</textPath></text></svg><img src="${HERO.seal}" alt="Seal of the International Catholic Jurists Forum"></div>
      <h1><span class="ln"><span>International</span></span><span class="ln"><span>Catholic Jurists</span></span><span class="ln"><span>Forum</span></span></h1>
      <div class="pillars" id="pillars">${PILLARS.map(w=>`<span>${w}</span>`).join('')}</div>
    </div>
  </section>

  <section class="s" id="mission"><div class="wrap">
    <div class="shead"><div><h2 class="h-l rv d1">${esc(h3s[0]?.textContent||'Mission Statement')}</h2></div><a class="more rv" href="#what-we-stand-for">Read more ${ICON.arrow}</a></div>
    <div class="mission"><p class="big rv">${mission[0]||''}</p><div class="side rv d2">${mission.slice(1).map(p=>`<p>${p}</p>`).join('')}</div></div>
  </div></section>

  <section class="s tint"><div class="wrap">
    <div class="shead"><div><h2 class="h-l rv d1">${esc(h3s[1]?.textContent||'')}</h2></div></div>
    <div class="objectives">${objs.map((o,i)=>`<div class="obj rv d${i%3}" data-n="${ROM(i+1)}"><p>${o}</p></div>`).join('')}</div>
  </div></section>

  <div class="photoBand"><img data-par src="${HERO.hero[5].src}" alt=""><blockquote><p class="rv">${(()=>{const t=(mission.join(' ').replace(/<[^>]+>/g,'').match(/Founded on a natural law perspective of human rights within the Catholic Intellectual Tradition/)||[''])[0];return t?t.replace('within the Catholic Intellectual Tradition','<em>within the Catholic Intellectual Tradition</em>'):''})()}</p></blockquote></div>

  <section class="s dark"><div class="wrap">
    <div class="origins">
      <div class="years" id="years">${['2013','2014','2021'].map((y,i)=>`<div class="yr rv d${i}" data-y="${y}">${y}<small>${YL[i]}</small></div>`).join('')}</div>
      <div class="copy"><h2 class="h-l rv d1" style="margin-bottom:30px">${esc(hs.title)}</h2><ol class="ystrip rv">${['2013','2014','2021'].map((y,i)=>`<li><b>${y}</b><span>${YL[i]}</span></li>`).join('')}</ol>${origins.map((p,i)=>`<p class="rv d${i%3}" data-yrs="${(p.match(/\b20(13|14|21)\b/g)||[]).join(' ')}">${p}</p>`).join('')}<a class="more rv" href="#who-we-are" style="margin-top:14px">Who We Are ${ICON.arrow}</a></div>
    </div>
  </div></section>

  <section class="s"><div class="wrap">
    <div class="shead"><div><h2 class="h-l rv d1">${esc(pr.title)}</h2></div><a class="more rv" href="#projects">View all ${ICON.arrow}</a></div>
    <div class="projects">${(pr.sections[0]?.cards||[]).map((c,i)=>{const m=c.title.match(/^(.*?):\s*(.*)$/);return `<a class="pcard rv d${i}" href="${esc(c.href)}"><img src="${c.img}" alt=""><div class="cap"><h3>${esc(m?m[1]:c.title)}${m?`<em>${esc(m[2])}</em>`:''}</h3></div></a>`}).join('')}</div>
  </div></section>

  <section class="s tint wall bks"><div class="wrap">
    <div class="shead"><div><h2 class="h-l rv d1">${esc(bk.title)}</h2></div><a class="more rv" href="#books">View all ${ICON.arrow}</a></div>
    <div class="cflow rv"><button class="cf-btn cf-prev" aria-label="Previous book">←</button><div class="shelf" id="shelf">${(bk.sections[0]?.cards||[]).map(bookCard).join('')}</div><button class="cf-btn cf-next" aria-label="Next book">→</button><div class="cf-dots" id="cfDots"></div></div>
  </div></section>

  <section class="s dark"><div class="wrap">
    <div class="shead"><div><h2 class="h-l rv d1">${esc(cf.title)}</h2></div><a class="more rv" href="#conferences">View all ${ICON.arrow}</a></div>
    <div class="tl">${tlItems(cf.items.slice(0,5))}</div>
  </div></section>

  <section class="s"><div class="wrap">
    <div class="shead"><div><h2 class="h-l rv d1">News</h2></div><a class="more rv" href="#news">View all ${ICON.arrow}</a></div>
    <div class="newsgrid">${(NEWSFALL=[1,8,3,2,9,13,11,14,10,12],NEWSFALLi=0,'')}${newsCard(latest[0],t0,'feat')}${latest.slice(1,5).map(p=>newsCard(p,t0,'q')).join('')}${latest.slice(5,8).map(p=>newsCard(p,t0,'row')).join('')}</div>
  </div></section>

  <section class="s tint wall"><div class="wrap">
    <div class="shead"><div><h2 class="h-l rv d1">${esc(ww.sections[0]?.heading||'')}</h2></div><a class="more rv" href="#who-we-are">View all ${ICON.arrow}</a></div>
    <div class="people lead">${exec.map(personCard).join('')}</div>
  </div></section>

  <section class="s dark pod"><div class="wrap">
    <div class="podgrid">
      <div class="podcopy">
        <div class="cospon rv"><span>Co-sponsored by</span><a href="https://enroutebooksandmedia.com/" target="_blank" rel="noopener"><img src="img/enroute-wordmark.webp" alt="En Route Books &amp; Media" width="800" height="166"></a><i></i><img class="sl" src="${HERO.sealSmall}" alt="International Catholic Jurists Forum"></div>
        <h2 class="h-m rv d1">${esc(pcTitle.replace(/\s*\(as of[^)]*\)\s*$/,''))}</h2>
        ${pcDesc?`<p class="rv d2">${pcDesc}</p>`:''}
        ${pcBy?`<p class="by rv d2">${pcBy}</p>`:''}
        <div class="rv d3" style="margin-top:34px;display:flex;gap:14px;flex-wrap:wrap"><a class="btn gold" href="#podcast-series">All episodes ${ICON.arrow}</a></div>
      </div>
      <figure class="podvid rv d2">${feat?(CAN_EMBED?player(feat.id,feat.label):`<a class="vid" href="https://www.youtube.com/watch?v=${feat.id}" target="_blank" rel="noopener"><span class="pl"><i><svg viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg></i></span><span class="lab">Watch on YouTube</span></a>`):''}
        ${feat?`<figcaption><b>${esc(feat.head)}</b> ${esc(feat.text)}</figcaption>`:''}</figure>
    </div>
  </div></section>

  <section class="affil" aria-label="Partners and affiliations"><div class="wrap"><div class="grid">
    <div class="grp rv"><h2>Partner</h2><div class="logos">
      <a class="pu" href="https://www.pontifex.university/" target="_blank" rel="noopener"><img src="img/pontifex-logo.png" alt="Pontifex University" width="640" height="262" loading="lazy"></a>
    </div></div>
    <div class="grp rv d1"><h2>Affiliations</h2><div class="logos">
      <a class="er" href="https://enroutebooksandmedia.com/" target="_blank" rel="noopener"><img src="img/enroute-wordmark.webp" alt="En Route Books &amp; Media" width="800" height="166" loading="lazy"></a>
      <a class="ins" href="https://www.iurisnaturalis.com/" target="_blank" rel="noopener"><img src="img/iuris-naturalis-leaf.png" alt="" width="128" height="128" loading="lazy"><span>Iuris Naturalis Societas<small>International Society of Natural Law Scholars</small></span></a>
    </div></div>
  </div></div></section>`;
  enhance(V);
  startHero();
  coverflow();
  // light the years one after another as the section scrolls past; each stays lit
  const yrs=$$('#years .yr'),org=$('.origins');
  const lightYears=()=>{if(!document.body.contains(org))return removeEventListener('scroll',lightYears);
    const r=org.getBoundingClientRect(),p=(innerHeight*.75-r.top)/(r.height*.8);
    const n=Math.max(0,Math.min(yrs.length,Math.floor(p*yrs.length)+1*(p>0)));
    yrs.forEach((y,i)=>y.classList.toggle('on',i<n))};
  addEventListener('scroll',lightYears,{passive:true});lightYears();
}
function coverflow(){
  const sh=$('#shelf');if(!sh)return;const bs=$$('.book',sh),dots=$('#cfDots');
  dots.innerHTML=bs.map((_,i)=>`<button aria-label="Book ${i+1}"></button>`).join('');const ds=$$('button',dots);
  let cur=0;
  const update=()=>{const c=sh.scrollLeft+sh.clientWidth/2;let best=0,bd=1e9;
    bs.forEach((b,i)=>{const bc=b.offsetLeft+b.offsetWidth/2,d=(bc-c)/b.offsetWidth,a=Math.min(Math.abs(d),3);
      if(Math.abs(d)<bd){bd=Math.abs(d);best=i}
      b.style.transform=`translateZ(${-a*60}px) rotateY(${Math.max(-1,Math.min(1,d))*-24}deg) scale(${1-Math.min(a,3)*.07})`;
      b.style.opacity=String(1-Math.min(a,3)*.16);b.style.zIndex=String(100-Math.round(a*10));});
    if(best!==cur||!bs[cur].classList.contains('cur')){bs.forEach((b,i)=>b.classList.toggle('cur',i===best));ds.forEach((d,i)=>d.classList.toggle('on',i===best));cur=best}};
  const go=i=>{i=(i+bs.length)%bs.length;const b=bs[i];sh.scrollTo({left:b.offsetLeft+b.offsetWidth/2-sh.clientWidth/2,behavior:'smooth'})};
  let raf=0;sh.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(update)},{passive:true});
  $('.cf-prev').onclick=()=>{pause();go(cur-1)};$('.cf-next').onclick=()=>{pause();go(cur+1)};
  ds.forEach((d,i)=>d.onclick=()=>{pause();go(i)});
  bs.forEach((b,i)=>b.addEventListener('click',e=>{if(i!==cur){e.preventDefault();pause();go(i)}}));
  let timer=null,idle=null;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const play=()=>{if(reduce)return;clearInterval(timer);timer=setInterval(()=>{if(!document.body.contains(sh))return clearInterval(timer);go(cur+1)},4800)};
  const pause=()=>{clearInterval(timer);clearTimeout(idle);idle=setTimeout(play,9000)};
  ['pointerenter','touchstart','focusin','wheel'].forEach(ev=>sh.parentElement.addEventListener(ev,pause,{passive:true}));
  requestAnimationFrame(()=>{const st=Math.min(2,bs.length-1),b0=bs[st];sh.scrollLeft=b0.offsetLeft+b0.offsetWidth/2-sh.clientWidth/2;update();play()});addEventListener('resize',update);
}
let heroT;
function startHero(){
  clearInterval(heroT);let i=0;const f=$$('.hero .slides figure');
  heroT=setInterval(()=>{if(!document.body.contains(f[0]))return clearInterval(heroT);
    f.forEach(x=>x.classList.remove('out'));f[i].classList.replace('on','out');i=(i+1)%f.length;
    void f[i].offsetWidth;f[i].classList.add('on');const n=$('#slN');if(n)n.textContent=ROM(i+1)},8000);
}
function tlItems(items){let last='';return items.map(it=>{const g=it.year===last;last=it.year;return `<div class="tli rv"><div class="y${g?' ghost':''}">${it.year}</div><span class="dot"></span><div class="b">${it.html}</div></div>`}).join('')}

async function generic(s){
  const p=await page(s);darkTop=true;
  const crumbs=crumbsFor(s);
  if(p.kind==='person')return person(p);
  if(p.kind==='timeline'){
    V.innerHTML=phead(p.title,{crumbs})+`<section class="s"><div class="wrap">${p.html?`<div class="prose">${p.html}</div>`:''}<div class="tl">${tlItems(p.items)}</div></div></section>`;
    enhance(V);
    return;
  }
  if(p.kind==='tiles'){
    const isPeople=s==='who-we-are', isBooks=/books/.test(s);
    let body='';
    if(p.html&&p.html.replace(/<hr\/?>|\s/g,'').length)body+=`<div class="prose" style="margin-bottom:50px">${p.html}</div>`;
    p.sections.forEach((sec,si)=>{
      if(isPeople){
        body+=`<div style="margin-bottom:90px"><div class="shead"><div><h2 class="h-l rv">${esc(sec.heading)}</h2></div>${si?`<label class="pfilter rv">${ICON.search}<input placeholder="Find an advisor" data-filter></label>`:''}</div><div class="people${si?'':' lead'}">${sec.cards.map(personCard).join('')}</div></div>`;
      }else{
        body+=`${sec.heading?`<h2 class="h-m rv" style="margin:40px 0 30px">${esc(sec.heading)}</h2>`:''}<div class="grid-cards${isBooks?' cover':''}">${sec.cards.map(cardHTML).join('')}</div>`;
      }
    });
    V.innerHTML=phead(p.title,{crumbs})+`<section class="s"><div class="wrap">${body}</div></section>`;
    const fi=$('[data-filter]');if(fi)fi.oninput=()=>{const q=fi.value.toLowerCase();$$('.people:not(.lead) .person').forEach(a=>a.style.display=a.textContent.toLowerCase().includes(q)?'':'none')};
    return;
  }
  if(s==='contact')return contact(p);
  const long=p.html.length>2500;
  V.innerHTML=phead(p.title,{crumbs})+`<section class="s"><div class="wrap"><div class="layout"><article class="prose${long?' dropcap':''} rv">${p.html}</article><aside class="toc"></aside></div></div></section>`;
  if(s==='podcast-series'){podcastify($('.prose'));$('.toc').remove();$('.layout').classList.add('full','bookl')}
  if(s==='mug-shots-of-martyred-priests'){memorial($('.prose'));$('.toc').remove();$('.layout').classList.add('full','bookl')}
  const bk=bookify($('.prose'));enhance(V);if(bk&&$('.toc')){$('.toc').remove();$('.layout').classList.add('full','bookl')}else if($('.toc'))buildTOC($('.prose'),$('.toc'));
}
let ORDER=null;
async function person(p){
  if(!ORDER){const w=await page('who-we-are');ORDER=w.sections.flatMap(x=>x.cards).filter(c=>c.href.startsWith('#')).map(c=>({s:c.href.slice(1),t:c.title,sub:c.sub}))}
  const i=ORDER.findIndex(o=>o.s===p.slug),pv=ORDER[i-1],nx=ORDER[i+1];
  const role=p.role?p.role.toLowerCase().replace(/(^|\s|-)(\S)/g,(m,a,b)=>a+b.toUpperCase()).replace(/\b(Of|And|The|For|To|In|On)\b/g,w=>w.toLowerCase()).replace(/^./,c=>c.toUpperCase()):(ORDER[i]?.sub?.[0]||'');
  V.innerHTML=phead(p.title,{crumbs:[['About',null],['Who We Are','who-we-are']]})+`<section class="s"><div class="wrap"><div class="prof"><div class="portrait rv">${p.img?`<div class="fr"><img src="${p.img}" alt="${esc(p.name||p.title)}"></div>`:''}</div><div>${p.role?`<span class="role rv">${esc(role)}</span>`:''}${p.name?`<h2 class="rv d1">${esc(p.name)}</h2>`:''}<div class="prose dropcap rv d2">${p.html}</div>
  ${i>=0?`<div class="pn">${pv?`<a href="#${pv.s}"><small>← Previous</small><span>${esc(pv.t)}</span></a>`:''}${nx?`<a class="nx" href="#${nx.s}"><small>Next →</small><span>${esc(nx.t)}</span></a>`:''}</div>`:''}</div></div></div></section>`;
  enhance(V);
}
function contact(p){
  const d=new DOMParser().parseFromString(p.html,'text/html').body;
  V.innerHTML=phead(p.title)+`<section class="s wall"><div class="wrap"><div class="contact"><div class="lead rv">${d.innerHTML}<img class="sealbig" src="${HERO.seal}" alt=""></div>
  <form class="cf rv d2" novalidate><span class="w" style="grid-column:1/-1;font-family:var(--display);font-style:italic;font-size:17px;color:var(--mute);margin-bottom:-18px">Name <span class="req">*</span></span><label>First<input name="first" required autocomplete="given-name"></label><label>Last<input name="last" required autocomplete="family-name"></label><label class="w">Email <span class="req">*</span><input type="email" name="email" required autocomplete="email"></label><label class="w">Comment or Message <span class="req">*</span><textarea name="message" required></textarea></label><input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" style="display:none"><div><button class="btn solid" type="submit">Submit ${ICON.arrow}</button></div><p class="ok" role="status"></p></form></div></div></section>`;
  const f=$('form.cf');
  f.onsubmit=async e=>{e.preventDefault();const ok=$('.ok',f),btn=$('button[type=submit]',f);ok.style.display='block';
    if(!f.checkValidity()){ok.textContent='Please fill in your name, email, and message.';return}
    if(f.botcheck.checked)return;
    const name=(f.first.value+' '+f.last.value).trim();
    btn.disabled=true;ok.textContent='Sending…';
    try{const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:WEB3FORMS_KEY,subject:'ICJF website message from '+name,from_name:'ICJF Website',name,email:f.email.value,replyto:f.email.value,message:f.message.value})});
      const j=await r.json().catch(()=>({}));
      if(r.ok&&j.success){f.reset();ok.textContent='Thank you. Your message has been sent to the Forum.'}
      else throw new Error(j.message||r.status)}
    catch(err){ok.textContent='Sorry, the message could not be sent. Please try again in a moment.'}
    finally{btn.disabled=false}};
}

let newsState={q:'',tag:'',year:'',n:24};
async function news(){
  darkTop=true;
  const counts={};IDX.posts.forEach(p=>p.tags.forEach(t=>counts[t]=(counts[t]||0)+1));
  const top=Object.entries(counts).sort((a,b)=>b[1]-a[1]).filter(([t])=>t!=='News').slice(0,18);
  const years=[...new Set(IDX.posts.map(p=>p.date.slice(0,4)))];
  V.innerHTML=phead('News',{sub:`${IDX.posts.length} articles · ${years[years.length-1]} to ${years[0]}`})+`<section class="s"><div class="wrap">
  <div class="newsbar"><label class="search">${ICON.search}<input id="nq" placeholder="Search the news archive" value="${esc(newsState.q)}"></label><select class="yr" id="ny"><option value="">All years</option>${years.map(y=>`<option${y===newsState.year?' selected':''}>${y}</option>`).join('')}</select><span class="count" id="nc"></span></div>
  <div class="chips"><button class="chip${newsState.tag?'':' on'}" data-t="">All</button>${top.map(([t,c])=>`<button class="chip${t===newsState.tag?' on':''}" data-t="${esc(t)}">${esc(t)}<b>${c}</b></button>`).join('')}</div>
  <div class="newsgrid" id="ng"></div><div class="loadmore"><button class="btn" id="nm">Load more ${ICON.arrow}</button></div></div></section>`;
  const draw=async()=>{
    const q=newsState.q.toLowerCase().trim();
    const list=IDX.posts.filter(p=>(!newsState.tag||p.tags.includes(newsState.tag))&&(!newsState.year||p.date.startsWith(newsState.year))&&(!q||(p.title+' '+p.excerpt+' '+p.tags.join(' ')).toLowerCase().includes(q)));
    const show=list.slice(0,newsState.n);
    const need=[...new Set(show.filter(p=>p.img).map(p=>p.c))];
    const th=Object.assign({},...(await Promise.all(need.map(thumbs))));
    $('#ng').innerHTML=show.length?show.map(p=>newsCard(p,th)).join(''):'<p class="count" style="grid-column:1/-1">No articles match.</p>';
    $('#nc').textContent=`${list.length} article${list.length===1?'':'s'}`;
    $('#nm').parentElement.style.display=list.length>newsState.n?'':'none';
    reveal();
  };
  let tmr;$('#nq').oninput=e=>{clearTimeout(tmr);tmr=setTimeout(()=>{newsState.q=e.target.value;newsState.n=24;draw()},180)};
  $('#ny').onchange=e=>{newsState.year=e.target.value;newsState.n=24;draw()};
  $$('.chip').forEach(c=>c.onclick=()=>{newsState.tag=c.dataset.t;newsState.n=24;$$('.chip').forEach(x=>x.classList.toggle('on',x===c));draw()});
  $('#nm').onclick=()=>{newsState.n+=24;draw()};
  await draw();
}
async function post(meta){
  darkTop=true;
  const [body,th]=await Promise.all([chunk(meta.c),meta.img?thumbs(meta.c):{}]);
  const i=IDX.posts.indexOf(meta),nw=IDX.posts[i-1],od=IDX.posts[i+1];
  V.innerHTML=`<header class="phead"><div class="bg">${th[meta.slug]?`<img src="${th[meta.slug]}" alt="">`:(()=>{const k=photoFor(meta.slug,meta.title);return `<img src="${HERO.hero[k].src}" alt="" style="object-position:50% ${FOCUS[k]}%">`})()}</div><div class="wrap"><nav class="crumbs rv"><a href="#home">Home</a><span>/</span><a href="#news">News</a></nav><h1 class="rv d1" style="font-size:clamp(34px,4.6vw,66px);max-width:24ch">${esc(meta.title)}</h1><div class="art-meta rv d2"><span>${fmtDate(meta.date)}</span>${meta.tags.filter(t=>t!=='News').slice(0,4).map(t=>`<button class="t" data-t="${esc(t)}">${esc(t)}</button>`).join('')}</div></div></header>
  ${th[meta.slug]?`<div class="wrap"><figure class="art-hero rvi"><img src="${th[meta.slug]}" alt=""></figure></div>`:''}
  <section class="s" style="${th[meta.slug]?'padding-top:0':''}"><div class="wrap"><div class="layout full"><article class="prose rv" style="margin:0 auto">${body[meta.slug]||''}
  <div class="pn">${od?`<a href="#${od.slug}"><small>← Older</small><span>${esc(od.title)}</span></a>`:''}${nw?`<a class="nx" href="#${nw.slug}"><small>Newer →</small><span>${esc(nw.title)}</span></a>`:''}</div>
  <p style="text-align:center;margin-top:50px"><a class="btn" href="#news">All News ${ICON.arrow}</a></p></article></div></div></section>`;
  $$('.art-meta .t').forEach(b=>b.onclick=()=>{newsState={q:'',tag:b.dataset.t,year:'',n:24};go('news')});
  enhance(V);
}
function donate(){
  darkTop=true;
  const L=n=>`img/pay/${n}.svg`,col={stripe:'#635bff',paypal:'#003087',visa:'#1a1f71',mastercard:'#eb001b',americanexpress:'#2e77bc',applepay:'#000',googlepay:'#4285f4',venmo:'#3d95ce'};
  V.innerHTML=phead('Support the Forum',{sub:'Give to the International Catholic Jurists Forum'})+`<section class="s wall"><div class="wrap"><div class="don">
  <div class="intro rv"><p>Gifts to the Forum support its conferences, books, podcasts, and research on the rights of the family, life, and religious freedom.</p><p class="small">You can give once or monthly, by card or PayPal. Every gift goes to the work of the Forum.</p></div>
  <div class="dcard rv d2">
    <div class="dfreq"><button class="on" data-f="once">One time</button><button data-f="monthly">Monthly</button></div>
    <div class="damts">${[25,50,100,250,500,1000].map((a,i)=>`<button data-a="${a}"${i===2?' class="on"':''}>$${a.toLocaleString()}</button>`).join('')}<input id="damt" inputmode="decimal" placeholder="Other amount ($)"></div>
    <div class="dpay"><button class="card" data-p="stripe"><img src="${L('stripe')}" alt=""> Give by card</button><button class="pp" data-p="paypal"><img src="${L('paypal')}" alt=""> Give with PayPal</button></div>
    <div class="dmarks">${['visa','mastercard','americanexpress','applepay','googlepay','venmo'].map(n=>`<img src="${L(n)}" alt="${n}" title="${n}">`).join('')}</div>
    <p class="dmsg" role="status"></p>
  </div></div>
  <div class="dother">
    <div class="rv"><h4>By check</h4><p>To give by mail, <a href="#contact">contact the Forum</a> for the mailing address.</p></div>
    <div class="rv d1"><h4>Stock or donor-advised fund</h4><p>For gifts of stock or grants from a donor-advised fund, <a href="#contact">contact the Forum</a>.</p></div>
    <div class="rv d2"><h4>Questions</h4><p>For questions about giving, please <a href="#contact">write to us</a>.</p></div>
  </div></div></section>`;
  // tint the monochrome brand marks
  $$('.dmarks img').forEach(i=>{fetch(i.src).then(r=>r.text()).then(t=>{const n=i.alt;i.src='data:image/svg+xml;utf8,'+encodeURIComponent(t.replace('<svg','<svg fill="'+(col[n]||'#333')+'"'))}).catch(()=>{})});
  let freq='once',amt=100;
  $$('.dfreq button').forEach(b=>b.onclick=()=>{freq=b.dataset.f;$$('.dfreq button').forEach(x=>x.classList.toggle('on',x===b))});
  $$('.damts button').forEach(b=>b.onclick=()=>{amt=+b.dataset.a;$('#damt').value='';$$('.damts button').forEach(x=>x.classList.toggle('on',x===b))});
  $('#damt').oninput=e=>{const v=parseFloat(e.target.value.replace(/[^\d.]/g,''));if(v>0){amt=v;$$('.damts button').forEach(x=>x.classList.remove('on'))}};
  $$('.dpay button').forEach(b=>b.onclick=()=>{const p=b.dataset.p,m=$('.dmsg');
    const url=p==='stripe'?(freq==='monthly'&&DONATE.stripeMonthly||DONATE.stripe):DONATE.paypal;
    if(!url){m.textContent='Online giving opens soon. In the meantime, please use the Contact page.';return}
    const u=new URL(url);if(p==='paypal'){u.searchParams.set('amount',amt)}else if(!DONATE.stripeMonthly||freq==='once'){u.searchParams.set('__prefilled_amount',Math.round(amt*100))}
    window.open(u.toString(),'_blank','noopener')});
}
function notFound(){darkTop=true;V.innerHTML=phead('Page not found')+`<section class="s"><div class="wrap" style="text-align:center"><p class="lede">That page isn't on this site.</p><p><a class="btn" href="#home">Home ${ICON.arrow}</a></p></div></section>`}

/* ---------- router ---------- */

const BASE=(document.querySelector('base')?.getAttribute('href'))||'/';
const slugToPath=s=>(!s||s==='home')?BASE:BASE+s+'/';
function curSlug(){
  let p=location.pathname;
  if(p.startsWith(BASE))p=p.slice(BASE.length);else p=p.replace(/^\//,'');
  p=decodeURIComponent(p.replace(/\/+$/,'').replace(/index\.html$/,''));
  if(!p&&location.hash.length>1){const h=decodeURIComponent(location.hash.slice(1));history.replaceState(null,'',slugToPath(h));return h}
  return p||'home';
}
function go(s){history.pushState(null,'',slugToPath(s));route()}
function fixLinks(root){$$('a[href^="#"]',root).forEach(a=>{const s=a.getAttribute('href').slice(1);a.setAttribute('href',(!s||s==='home')?'./':s+'/')})}
document.addEventListener('click',e=>{
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
  const raw=a.getAttribute('href');
  if(raw.startsWith('#')){e.preventDefault();go(raw.slice(1)||'home');return}
  if(a.origin!==location.origin||!a.pathname.startsWith(BASE))return;
  const rest=a.pathname.slice(BASE.length);
  if(/^(files|img|data|assets|admin)\//.test(rest)||/\.[a-z0-9]{2,5}$/i.test(rest))return;
  e.preventDefault();const s=decodeURIComponent(rest.replace(/\/+$/,''))||'home';
  if(s===curSlug()&&!a.hash){scrollTo({top:0,behavior:'smooth'});return}
  go(s);
});
addEventListener('popstate',route);
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1&&!n.closest('#pal')){if(n.matches('a[href^="#"]'))fixLinks(n.parentNode);else fixLinks(n)}}).observe(document.body,{childList:true,subtree:true});
async function route(){
  toggleMenu(false);closePal();tocSpy=null;
  let s=curSlug();if(s==='media'){history.replaceState(null,'',slugToPath('press'));s='press';}
  $$('#nav .nl').forEach(a=>a.classList.toggle('on',!!((a.dataset.k||'').split(' ').includes(s)||(postBySlug[s]&&a.dataset.k==='news'))));
  try{
    if(s==='home')await home();
    else if(s==='news')await news();
    else if(s==='donate')donate();
    else if(IDX.pages[s])await generic(s);
    else if(postBySlug[s])await post(postBySlug[s]);
    else notFound();
  }catch(e){console.error(e);notFound()}
  {const c=document.querySelector('link[rel=canonical]');if(c&&c.dataset.origin)c.href=c.dataset.origin+(s==='home'?'/':'/'+s+'/')}
  document.title=(s==='home'?'':($('.phead h1')?.textContent+' · '))+'International Catholic Jurists Forum';
  V.classList.remove('swap');void V.offsetWidth;V.classList.add('swap');
  scrollTo({top:0,behavior:'instant'});lastY=0;onScroll();reveal();
}


/* ---------- search palette ---------- */
let palSel=0,palItems=[];
function openPal(){$('#pal').classList.add('open');$('#palIn').value='';palRender();setTimeout(()=>$('#palIn').focus(),30)}
function closePal(){$('#pal').classList.remove('open')}
function palRender(){
  const q=$('#palIn').value.toLowerCase().trim();
  const pages=Object.entries(IDX.pages).map(([s,p])=>({s,t:p.title,k:p.kind==='person'?'Person':'Page',x:(p.text+' '+p.name+' '+p.role).toLowerCase()}));
  const posts=IDX.posts.map(p=>({s:p.slug,t:p.title,k:'News · '+fmtDate(p.date),x:(p.excerpt+' '+p.tags.join(' ')).toLowerCase()}));
  let all=[...pages,...posts];
  if(q){const ws=q.split(/\s+/);all=all.map(r=>{const tl=r.t.toLowerCase();let sc=0;for(const w of ws){if(tl.includes(w))sc+=tl.startsWith(w)?6:4;else if(r.x.includes(w))sc+=1;else return null}return{...r,sc:sc+(r.k==='News'?0:1)}}).filter(Boolean).sort((a,b)=>b.sc-a.sc)}
  else all=[...pages.filter(p=>p.k==='Page').slice(0,8)];
  palItems=all.slice(0,40);palSel=0;
  $('#palRes').innerHTML=palItems.length?palItems.map((r,i)=>`<a href="#${r.s}" class="${i?'':'sel'}"><small>${esc(r.k)}</small><span>${esc(r.t)}</span></a>`).join(''):'<div class="empty">Nothing found.</div>';
}
$('#palIn').addEventListener('input',palRender);
$('#pal').addEventListener('click',e=>{if(e.target.id==='pal')closePal()});
addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPal();return}
  if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement.tagName)){e.preventDefault();openPal();return}
  if(!$('#pal').classList.contains('open'))return;
  if(e.key==='Escape')closePal();
  const as=$$('#palRes a');
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();palSel=(palSel+(e.key==='ArrowDown'?1:-1)+as.length)%as.length;as.forEach((a,i)=>a.classList.toggle('sel',i===palSel));as[palSel]?.scrollIntoView({block:'nearest'})}
  if(e.key==='Enter'&&as[palSel]){e.preventDefault();go(as[palSel].getAttribute('href').slice(1))}
});

/* ---------- boot ---------- */
(async()=>{
  [IDX,HERO]=await Promise.all([get('data/index.json'),get('data/hero.json')]);
  {const l=$('#ldSeal');if(l)l.src=HERO.sealSmall}
  IDX.posts.forEach(p=>postBySlug[p.slug]=p);
  buildChrome();fixLinks(document.body);route();
})();
})();
