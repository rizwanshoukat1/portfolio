(function(){
  var root=document.documentElement, body=document.body;
  root.setAttribute('data-theme','light'); // always open in day mode
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loader ---------- */
  var loader=document.getElementById('loader'), ld=document.getElementById('ldName'), d=0;
  'Rizwan Shoukat'.split(' ').forEach(function(w){
    var word=document.createElement('span');word.className='ld-word';
    w.split('').forEach(function(ch){var s=document.createElement('span');s.textContent=ch;s.style.animationDelay=(d++*0.07)+'s';word.appendChild(s)});
    ld.appendChild(word);
  });
  var fontsReady=document.fonts?Promise.race([document.fonts.ready,new Promise(function(r){setTimeout(r,1200)})]):Promise.resolve();
  fontsReady.then(function(){
    loader.classList.add('go');
    var bar=document.getElementById('ldBar'),cnt=document.getElementById('ldCount'),t0=performance.now(),dur=reduce?300:2400;
    (function tick(now){
      var p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,3);
      bar.style.width=(e*100)+'%'; cnt.textContent=Math.round(e*100)+'%';
      if(p<1) requestAnimationFrame(tick);
      else setTimeout(function(){
        loader.classList.add('open'); body.classList.remove('locked');
        setTimeout(function(){body.classList.add('ready');movePill();heroCount()},200);
        setTimeout(function(){loader.style.display='none'},1100);
      },350);
    })(t0);
  });

  function heroCount(){document.querySelectorAll('[data-hc]').forEach(function(n){var to=+n.dataset.hc,st=performance.now()+900;(function c(now){var p=Math.max(0,Math.min(1,(now-st)/1300));n.textContent=Math.round(to*p);if(p<1)requestAnimationFrame(c)})(performance.now())})}
  /* ---------- Theme ---------- */
  var tb=document.getElementById('themeBtn');
  tb.addEventListener('click',function(){
    var dark=root.getAttribute('data-theme')!=='dark';
    root.setAttribute('data-theme',dark?'dark':'light');
    tb.setAttribute('aria-label',dark?'Switch to day mode':'Switch to night mode');
    readDotColor();
  });

  /* ---------- Nav ---------- */
  var mb=document.getElementById('menuBtn'),links=document.getElementById('links'),pill=document.getElementById('pill');
  var navA=links.querySelectorAll('a');
  mb.addEventListener('click',function(){var o=links.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
  navA.forEach(function(a){a.addEventListener('click',function(){links.classList.remove('open');mb.setAttribute('aria-expanded',false)})});
  function movePill(){var a=links.querySelector('a.active');if(!a)return;pill.style.left=a.offsetLeft+'px';pill.style.width=a.offsetWidth+'px'}
  addEventListener('resize',movePill);
  var hdr=document.getElementById('hdr');
  addEventListener('scroll',function(){hdr.classList.toggle('scrolled',scrollY>30)},{passive:true});

  /* ---------- Custom cursor ---------- */
  var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(fine&&!reduce){
    var dot=document.getElementById('curDot'),ring=document.getElementById('curRing'),mx=-100,my=-100,rx=-100,ry=-100,last=0;
    body.classList.add('cursor-on');
    addEventListener('mousemove',function(e){
      mx=e.clientX;my=e.clientY;dot.style.transform='translate('+mx+'px,'+my+'px)';
      var now=performance.now();
      if(now-last>40){last=now;var t=document.createElement('span');t.className='trail';t.style.left=mx+'px';t.style.top=my+'px';
        var shades=['#0F2EA3','#1652FF','#6690FF','#3BE3FF','#9BB6FF'];t.style.background=shades[Math.floor(Math.random()*shades.length)];
        body.appendChild(t);setTimeout(function(){t.remove()},700)}
    });
    (function loop(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.transform='translate('+rx+'px,'+ry+'px)';requestAnimationFrame(loop)})();
    document.addEventListener('mouseover',function(e){ring.classList.toggle('hover',!!e.target.closest('a,button,.tico,.fact,.stat,.phone'))});
    addEventListener('mousedown',function(){ring.classList.add('down')});
    addEventListener('mouseup',function(){ring.classList.remove('down')});
    document.addEventListener('mouseleave',function(){body.classList.remove('cursor-on')});
    document.addEventListener('mouseenter',function(){body.classList.add('cursor-on')});
  }

  /* ---------- Interactive dot field ---------- */
  var cv=document.getElementById('dots'),ctx=cv.getContext('2d'),hero=document.getElementById('home');
  var W,H,dpr,pts=[],pmx=-9999,pmy=-9999,dotRGB=[22,82,255],visible=true;
  function readDotColor(){dotRGB=root.getAttribute('data-theme')==='dark'?[59,227,255]:[22,82,255]}
  function size(){dpr=Math.min(devicePixelRatio||1,2);W=hero.clientWidth;H=hero.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    pts=[];var gap=W<700?26:32;for(var y=gap/2;y<H;y+=gap)for(var x=gap/2;x<W;x+=gap)pts.push({x:x,y:y})}
  size();addEventListener('resize',size);
  hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();pmx=e.clientX-r.left;pmy=e.clientY-r.top});
  hero.addEventListener('pointerleave',function(){pmx=pmy=-9999});
  new IntersectionObserver(function(es){visible=es[0].isIntersecting}).observe(hero);
  function draw(t){
    requestAnimationFrame(draw); if(!visible)return;
    ctx.clearRect(0,0,W,H); var s=t*0.0012, R=150;
    for(var i=0;i<pts.length;i++){var p=pts[i];
      var wave=Math.sin(p.x*0.012+s)*Math.cos(p.y*0.014-s*0.8); // idle wave
      var dx=p.x-pmx,dy=p.y-pmy,dist=Math.sqrt(dx*dx+dy*dy),f=dist<R?1-dist/R:0;
      var ox=f?dx/dist*f*18:0, oy=f?dy/dist*f*18:0;
      var r=1.1+wave*0.6+f*3.2, a=0.18+(wave+1)*0.12+f*0.7;
      ctx.fillStyle='rgba('+dotRGB[0]+','+dotRGB[1]+','+dotRGB[2]+','+a.toFixed(3)+')';
      ctx.beginPath();ctx.arc(p.x+ox,p.y+oy,Math.max(.4,r),0,6.283);ctx.fill();
    }
  }
  if(!reduce)requestAnimationFrame(draw);else{draw(0)}

  /* ---------- Scroll reveals + count up ---------- */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);
    e.target.querySelectorAll('[data-count]').forEach(function(n){var to=+n.dataset.count,st=performance.now();(function c(now){var p=Math.min(1,(now-st)/1200);n.textContent=Math.round(to*p);if(p<1)requestAnimationFrame(c)})(st)})}})},{threshold:.2});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

  /* ---------- Tilt on about photo ---------- */
  var tilt=document.getElementById('tilt');
  if(fine&&!reduce){tilt.addEventListener('mousemove',function(e){var r=tilt.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;tilt.style.transform='perspective(900px) rotateY('+(x*10)+'deg) rotateX('+(-y*10)+'deg)'});
    tilt.addEventListener('mouseleave',function(){tilt.style.transform=''})}

  /* ---------- Tool icons ---------- */
  var tools=[
    ['Adobe Illustrator','assets/tools/adobe-illustrator.webp'],
    ['Adobe Photoshop','assets/tools/adobe-photoshop.webp'],
    ['Figma','assets/tools/figma.webp'],
    ['Adobe XD','assets/tools/adobe-xd.webp'],
    ['CapCut','assets/tools/capcut.webp'],
    ['Notion','assets/tools/notion.webp'],
    ['Creative Cloud','assets/tools/creative-cloud.webp']
  ];
  var track=document.getElementById('track'),html='';
  for(var k=0;k<2;k++)tools.forEach(function(t){html+='<div class="tico" data-name="'+t[0]+'" title="'+t[0]+'"'+(k?' aria-hidden="true"':'')+'><img src="'+t[1]+'" alt="'+(k?'':t[0])+'" width="80" height="80"></div>'});
  track.innerHTML=html;

  /* ================= ASSETS + LAZY LOADING ================= */
  var A={
 "am0": "assets/images/am0.webp",
 "am1": "assets/images/am1.webp",
 "am10": "assets/images/am10.webp",
 "am11": "assets/images/am11.webp",
 "am12": "assets/images/am12.webp",
 "am2": "assets/images/am2.webp",
 "am3": "assets/images/am3.webp",
 "am4": "assets/images/am4.webp",
 "am5": "assets/images/am5.webp",
 "am6": "assets/images/am6.webp",
 "am7": "assets/images/am7.webp",
 "am8": "assets/images/am8.webp",
 "am9": "assets/images/am9.webp",
 "bf0": "assets/images/bf0.webp",
 "bf1": "assets/images/bf1.webp",
 "bf2": "assets/images/bf2.webp",
 "bk01_00": "assets/images/bk01_00.webp",
 "bk01_01": "assets/images/bk01_01.webp",
 "bk01_02": "assets/images/bk01_02.webp",
 "bk01_03": "assets/images/bk01_03.webp",
 "bk01_04": "assets/images/bk01_04.webp",
 "bk01_05": "assets/images/bk01_05.webp",
 "bk01_06": "assets/images/bk01_06.webp",
 "bk01_07": "assets/images/bk01_07.webp",
 "bk01_08": "assets/images/bk01_08.webp",
 "bk01_09": "assets/images/bk01_09.webp",
 "bk01_10": "assets/images/bk01_10.webp",
 "bk01_11": "assets/images/bk01_11.webp",
 "bk01_12": "assets/images/bk01_12.webp",
 "bk01_13": "assets/images/bk01_13.webp",
 "bk01_14": "assets/images/bk01_14.webp",
 "bk01_15": "assets/images/bk01_15.webp",
 "bk01_16": "assets/images/bk01_16.webp",
 "bk01_17": "assets/images/bk01_17.webp",
 "bk01_18": "assets/images/bk01_18.webp",
 "bk01_19": "assets/images/bk01_19.webp",
 "bk01_20": "assets/images/bk01_20.webp",
 "bk01_21": "assets/images/bk01_21.webp",
 "bk01_22": "assets/images/bk01_22.webp",
 "bk01_23": "assets/images/bk01_23.webp",
 "bk02_00": "assets/images/bk02_00.webp",
 "bk02_01": "assets/images/bk02_01.webp",
 "bk02_02": "assets/images/bk02_02.webp",
 "bk02_03": "assets/images/bk02_03.webp",
 "bk02_04": "assets/images/bk02_04.webp",
 "bk02_05": "assets/images/bk02_05.webp",
 "bk02_06": "assets/images/bk02_06.webp",
 "bk02_07": "assets/images/bk02_07.webp",
 "bk02_08": "assets/images/bk02_08.webp",
 "bk02_09": "assets/images/bk02_09.webp",
 "bk02_10": "assets/images/bk02_10.webp",
 "bk02_11": "assets/images/bk02_11.webp",
 "bk02_12": "assets/images/bk02_12.webp",
 "bk02_13": "assets/images/bk02_13.webp",
 "bk02_14": "assets/images/bk02_14.webp",
 "bk02_15": "assets/images/bk02_15.webp",
 "bk02_16": "assets/images/bk02_16.webp",
 "bk02_17": "assets/images/bk02_17.webp",
 "bk02_18": "assets/images/bk02_18.webp",
 "bk02_19": "assets/images/bk02_19.webp",
 "bk02_20": "assets/images/bk02_20.webp",
 "bk02_21": "assets/images/bk02_21.webp",
 "bk02_22": "assets/images/bk02_22.webp",
 "bk02_23": "assets/images/bk02_23.webp",
 "bk02_24": "assets/images/bk02_24.webp",
 "bk02_25": "assets/images/bk02_25.webp",
 "bk02_26": "assets/images/bk02_26.webp",
 "bk02_27": "assets/images/bk02_27.webp",
 "bk02_28": "assets/images/bk02_28.webp",
 "bk02_29": "assets/images/bk02_29.webp",
 "bk02_30": "assets/images/bk02_30.webp",
 "bk02_31": "assets/images/bk02_31.webp",
 "bk02_32": "assets/images/bk02_32.webp",
 "bk02_33": "assets/images/bk02_33.webp",
 "bk02_34": "assets/images/bk02_34.webp",
 "bk02_35": "assets/images/bk02_35.webp",
 "bm0": "assets/images/bm0.webp",
 "bm1": "assets/images/bm1.webp",
 "bm2": "assets/images/bm2.webp",
 "bm3": "assets/images/bm3.webp",
 "book_back": "assets/images/book_back.webp",
 "book_front": "assets/images/book_front.webp",
 "book_spine": "assets/images/book_spine.webp",
 "br0": "assets/images/br0.webp",
 "br1": "assets/images/br1.webp",
 "br10": "assets/images/br10.webp",
 "br11": "assets/images/br11.webp",
 "br12": "assets/images/br12.webp",
 "br13": "assets/images/br13.webp",
 "br14": "assets/images/br14.webp",
 "br15": "assets/images/br15.webp",
 "br2": "assets/images/br2.webp",
 "br3": "assets/images/br3.webp",
 "br4": "assets/images/br4.webp",
 "br5": "assets/images/br5.webp",
 "br6": "assets/images/br6.webp",
 "br7": "assets/images/br7.webp",
 "br8": "assets/images/br8.webp",
 "br9": "assets/images/br9.webp",
 "pk0": "assets/images/pk0.webp",
 "pk1": "assets/images/pk1.webp",
 "pk2": "assets/images/pk2.webp",
 "sp0": "assets/images/sp0.webp",
 "sp1": "assets/images/sp1.webp",
 "sp2": "assets/images/sp2.webp",
 "sp3": "assets/images/sp3.webp",
 "sp4": "assets/images/sp4.webp",
 "sp5": "assets/images/sp5.webp",
 "sp6": "assets/images/sp6.webp",
 "sp7": "assets/images/sp7.webp",
 "sp8": "assets/images/sp8.webp",
 "sp9": "assets/images/sp9.webp",
 "ss0": "assets/images/ss0.webp",
 "ss1": "assets/images/ss1.webp",
 "ss2": "assets/images/ss2.webp",
 "ss3": "assets/images/ss3.webp",
 "ss4": "assets/images/ss4.webp",
 "ss5": "assets/images/ss5.webp",
 "ss6": "assets/images/ss6.webp",
 "ui_about": "assets/images/ui_about.webp",
 "ui_home": "assets/images/ui_home.webp",
 "ui_onb": "assets/images/ui_onb.webp",
 "ui_portfolio": "assets/images/ui_portfolio.webp",
 "ui_process": "assets/images/ui_process.webp",
 "ui_s0": "assets/images/ui_s0.webp",
 "ui_s1": "assets/images/ui_s1.webp",
 "ui_s2": "assets/images/ui_s2.webp",
 "ui_s3": "assets/images/ui_s3.webp",
 "ui_s4": "assets/images/ui_s4.webp",
 "ui_s5": "assets/images/ui_s5.webp",
 "ui_s6": "assets/images/ui_s6.webp",
 "ui_s7": "assets/images/ui_s7.webp",
 "ui_s8": "assets/images/ui_s8.webp",
 "ui_s9": "assets/images/ui_s9.webp",
 "ui_wallet": "assets/images/ui_wallet.webp"
};
  var lazyIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){fill(e.target);lazyIO.unobserve(e.target)}})},{rootMargin:'900px 0px'});
  function fill(el){
    if(el.dataset.k){if(el.src)return;el.addEventListener('load',function(){el.classList.add('ld');el.dispatchEvent(new Event('filled'))},{once:true});el.src=A[el.dataset.k]}
    else if(el.dataset.bg){el.style.backgroundImage='url('+A[el.dataset.bg]+')'}
  }
  function watch(root){(root||document).querySelectorAll('img[data-k],[data-bg]').forEach(function(el){lazyIO.observe(el)})}
  function mkImg(k,alt){var i=document.createElement('img');i.dataset.k=k;i.alt=alt||'';i.draggable=false;return i}
  var svg=function(d,f){return '<svg viewBox="0 0 24 24" fill="'+(f||'none')+'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>'};

  /* ================= REVEALS ================= */
  var rvIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');rvIO.unobserve(e.target)}})},{threshold:.12});
  function rvWatch(){document.querySelectorAll('.rv:not(.in),.bento2:not(.in)').forEach(function(el){rvIO.observe(el)})}

  /* ================= LIGHTBOX ================= */
  var lb=document.getElementById('lb'),lbImg=document.getElementById('lbImg'),lbC=document.getElementById('lbC'),lbList=[],lbI=0,lbFocus;
  function lbShow(){var it=lbList[lbI];lbImg.src=A[it.k];lbImg.alt=it.c||'';lbC.textContent=(it.c?it.c+'  ·  ':'')+(lbI+1)+' / '+lbList.length;
    document.getElementById('lbP').style.display=document.getElementById('lbN').style.display=lbList.length>1?'grid':'none'}
  function openLB(list,i){lbFocus=document.activeElement;lbList=list;lbI=i;lbShow();lb.classList.add('open');document.body.style.overflow='hidden';document.getElementById('lbX').focus()}
  function closeLB(){lb.classList.remove('open');document.body.style.overflow='';if(lbFocus)lbFocus.focus()}
  document.getElementById('lbX').onclick=closeLB;
  document.getElementById('lbP').onclick=function(){lbI=(lbI-1+lbList.length)%lbList.length;lbShow()};
  document.getElementById('lbN').onclick=function(){lbI=(lbI+1)%lbList.length;lbShow()};
  lb.addEventListener('click',function(e){if(e.target===lb)closeLB()});
  addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')closeLB();if(e.key==='ArrowRight')document.getElementById('lbN').click();if(e.key==='ArrowLeft')document.getElementById('lbP').click()});
  var lsx=null;lb.addEventListener('touchstart',function(e){lsx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(lsx===null)return;var dx=e.changedTouches[0].clientX-lsx;if(Math.abs(dx)>50)document.getElementById(dx<0?'lbN':'lbP').click();lsx=null});
  function tile(item,list,i,cls){var b=document.createElement('button');b.className='tile '+(cls||'');b.setAttribute('aria-label','Open '+(item.c||'image'));
    b.appendChild(mkImg(item.k,item.c));if(item.c){var s=document.createElement('span');s.className='lbl';s.textContent=item.c;b.appendChild(s)}
    b.addEventListener('click',function(){if(b.dataset.dragged)return;openLB(list,i)});return b}

  /* ================= UI/UX: auto-scrolling app screens ================= */
  function sizeScreens(){document.querySelectorAll('#appRow .scr img.ld').forEach(function(im){
    var h=im.getBoundingClientRect().height,H=im.parentNode.getBoundingClientRect().height,y=Math.min(0,H-h);
    im.style.setProperty('--y',y+'px');im.style.setProperty('--d',Math.max(6,Math.abs(y)/55)+'s');if(y<0&&!reduce)im.classList.add('run')})}
  document.querySelectorAll('#appRow .scr img').forEach(function(im){im.addEventListener('filled',sizeScreens)});
  addEventListener('resize',sizeScreens);

  /* stage slider */
  var SHOTS=[['ui_s0','Three key screens'],['ui_s1','Agent profile'],['ui_s2','Property search'],['ui_s3','Listing details'],['ui_s4','Find your dream home'],['ui_s5','Log in'],['ui_s6','Search results'],['ui_s7','Map view'],['ui_s8','Property tour'],['ui_s9','Available for projects']];
  var stage=document.getElementById('stage'),sth=document.getElementById('stageThumbs'),sCap=document.getElementById('stageCap'),si=0,sT,simgs=[],sbtn=[],SD=4200;
  sth.style.setProperty('--dur',SD+'ms');
  SHOTS.forEach(function(s,i){var im=mkImg(s[0],s[1]);stage.insertBefore(im,sCap);simgs.push(im);
    var b=document.createElement('button');b.setAttribute('aria-label','Show '+s[1]);b.appendChild(mkImg(s[0],''));var bar=document.createElement('i');bar.className='bar';b.appendChild(bar);
    b.onclick=function(){showS(i)};sth.appendChild(b);sbtn.push(b)});
  stage.addEventListener('click',function(){openLB(SHOTS.map(function(s){return{k:s[0],c:s[1]}}),si)});stage.style.cursor='zoom-in';
  function showS(i){si=(i+SHOTS.length)%SHOTS.length;simgs.forEach(function(im,k){if(k===si||k===(si+1)%SHOTS.length)fill(im);im.classList.toggle('on',k===si)});
    sbtn.forEach(function(b){b.classList.remove('on')});void sbtn[si].offsetWidth;sbtn[si].classList.add('on');sCap.textContent=SHOTS[si][1];
    clearTimeout(sT);if(!reduce)sT=setTimeout(function(){showS(si+1)},SD)}
  showS(0);

  /* ================= BRANDING ================= */
  var BR=[['br0','Brand guidelines','b'],['br1','Logo','w'],['br2','Merchandise',''],['br3','Takeaway bag','t'],['br4','Delivery bag','t'],['br5','Packaging',''],['br6','Business cards','w'],['br11','Storefront',''],['br7','Signage','w'],['br9','Chef uniform','t'],['br8','Stamp',''],['br10','Wall clock',''],['br12','Social profile','t'],['br14','Brand pattern','w'],['br13','Social post',''],['br15','Print ad','w']];
  var brList=BR.map(function(b){return{k:b[0],c:b[1]}}),bg=document.getElementById('brandGrid');
  BR.forEach(function(b,i){var t=tile(brList[i],brList,i,b[2]);t.style.transitionDelay=(i%8*60)+'ms';bg.appendChild(t)});

  /* ================= SOCIAL ================= */
  var POSTS=[['sp0','Grow faster with Odoo CRM'],['sp1','Service your car'],['sp2','Unleash your power'],['sp3','Turn every lead into an opportunity'],['sp4','Toyota genuine parts'],['sp5','Premium Ajwa dates box'],['sp6','What is Odoo ERP'],['sp7','Still managing leads in Excel?'],['sp8','Is your profile intentional?'],['sp9','Car service menu']];
  var flow=document.getElementById('flow'),fDots=document.getElementById('fDots'),cur=0,phones=[];
  var heart='<svg class="heart" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>';
  POSTS.forEach(function(p,i){
    var el=document.createElement('div');el.className='ph';el.setAttribute('role','group');el.setAttribute('aria-label',p[1]);
    el.innerHTML='<div class="scr"><div class="sb"><span>9:41</span><span>5G ▮</span></div><div class="feed-top"><div class="av"><span>RS</span></div><div><b>rizwan.designs</b><small>Lahore, Pakistan</small></div><em>···</em></div>'+
      '<img class="post" data-k="'+p[0]+'" alt="'+p[1]+'" draggable="false">'+
      '<div class="acts">'+heart+svg('<path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2-5.4A8.4 8.4 0 1 1 21 11.5z"/>')+svg('<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>')+svg('<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>')+'</div>'+
      '<div class="likes">'+(1200+i*347).toLocaleString('en-US')+' likes</div><div class="capt"><b>rizwan.designs</b> '+p[1]+'</div></div>';
    el.addEventListener('click',function(){if(i!==cur)go(i);else openLB(POSTS.map(function(q){return{k:q[0],c:q[1]}}),i)});
    flow.appendChild(el);phones.push(el);
    var d=document.createElement('button');d.setAttribute('aria-label','Show post '+(i+1));d.onclick=function(){go(i)};fDots.appendChild(d)});
  function layout(){var n=phones.length,w=innerWidth<640?.6:.7;
    phones.forEach(function(el,i){var o=i-cur;if(o>n/2)o-=n;if(o<-n/2)o+=n;var a=Math.abs(o);
      el.style.transform='translateX('+(o*w*100)+'%) translateZ('+(-a*140)+'px) rotateY('+(-o*26)+'deg) scale('+(1-a*.06)+')';
      el.style.zIndex=10-a;el.style.opacity=a>2?0:1;el.style.filter=a?'saturate(.75) brightness(.92)':'none';el.style.pointerEvents=a>2?'none':'auto';el.classList.toggle('active',a===0)});
    fDots.querySelectorAll('button').forEach(function(d,i){d.classList.toggle('on',i===cur)});
    document.getElementById('fTitle').textContent=POSTS[cur][1];document.getElementById('fCount').textContent=(cur+1)+' of '+phones.length}
  function go(i){cur=(i+phones.length)%phones.length;layout();restartF()}
  document.getElementById('fPrev').onclick=function(){go(cur-1)};document.getElementById('fNext').onclick=function(){go(cur+1)};
  var fT,flowHover=false,flowVis=false;function restartF(){clearInterval(fT);if(!reduce)fT=setInterval(function(){if(!flowHover&&flowVis)go(cur+1)},3400)}
  flow.addEventListener('mouseenter',function(){flowHover=true});flow.addEventListener('mouseleave',function(){flowHover=false});
  new IntersectionObserver(function(es){flowVis=es[0].isIntersecting}).observe(flow);
  var sx=null;flow.addEventListener('pointerdown',function(e){sx=e.clientX});
  addEventListener('pointerup',function(e){if(sx===null)return;var dx=e.clientX-sx;if(Math.abs(dx)>40)go(cur+(dx<0?1:-1));sx=null});
  addEventListener('resize',layout);layout();restartF();

  var SPREADS=[['ss0','Wireless earbuds'],['ss1','Smart watches'],['ss2','Earbuds, set two'],['ss3','Ajwa dates set'],['ss4','UX challenges'],['ss5','AERO car launch'],['ss6','Ajwa dates presentation']];
  var spList=SPREADS.map(function(s){return{k:s[0],c:s[1]}}),rail=document.getElementById('rail');
  SPREADS.forEach(function(s,i){rail.appendChild(tile(spList[i],spList,i,''))});
  (function(){var down=false,sx0=0,sl=0,moved=0;rail.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=0;sx0=e.clientX;sl=rail.scrollLeft;rail.classList.add('drag')});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx0;moved=Math.max(moved,Math.abs(dx));rail.scrollLeft=sl-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;rail.classList.remove('drag');rail.querySelectorAll('.tile').forEach(function(t){if(moved>6){t.dataset.dragged=1;setTimeout(function(){delete t.dataset.dragged},50)}})})})();

  /* ================= FLIPBOOK ================= */
  var BOOKS=[{n:24,p:'bk01_',name:'TechCon Southwest 2026'},{n:36,p:'bk02_',name:'TechCon 2026 Events'}];
  var fb=document.getElementById('fb'),pL=document.querySelector('#pL img'),pR=document.querySelector('#pR img'),pLw=document.getElementById('pL'),pRw=document.getElementById('pR'),
      leaf=document.getElementById('leaf'),lF=leaf.querySelector('.f img'),lB=leaf.querySelector('.bk img'),fbInfo=document.getElementById('fbInfo'),strip=document.getElementById('pgStrip');
  var bk=0,sp=0,busy=false;
  function key(i){return BOOKS[bk].p+(i<10?'0':'')+i}
  function N(){return BOOKS[bk].n}
  function setImg(im,wrap,i){if(i<0||i>=N()){wrap.classList.add('empty');im.removeAttribute('src');return}wrap.classList.remove('empty');im.src=A[key(i)];im.alt=BOOKS[bk].name+', page '+(i+1)}
  function maxSp(){return Math.floor(N()/2)}
  function render(){var l=2*sp-1,r=2*sp;setImg(pL,pLw,l);setImg(pR,pRw,r);
    fb.classList.toggle('cover',sp===0);fb.classList.toggle('end',r>=N());
    fbInfo.textContent=sp===0?'Cover':(r>=N()?'Back cover':'Pages '+(l+1)+'–'+(r+1)+' of '+N())}
  function anim(from,to,done){var t0=performance.now(),D=reduce?1:900;leaf.classList.add('go');
    (function step(now){var p=Math.min(1,(now-t0)/D),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2,a=from+(to-from)*e;
      leaf.style.transform='rotateY('+a+'deg)';leaf.style.setProperty('--sh',Math.sin(Math.abs(a)*Math.PI/180).toFixed(2));
      if(p<1)requestAnimationFrame(step);else{leaf.classList.remove('go');done()}})(t0)}
  function next(){if(busy||sp>=maxSp())return;busy=true;var r=2*sp;lF.src=A[key(r)];lB.src=A[key(r+1)]||'';
    if(r+2<N()){setImg(pR,pRw,r+2)}else{pRw.classList.add('empty')}
    sp++;fb.classList.toggle('cover',false);fb.classList.toggle('end',2*sp>=N());
    anim(0,-180,function(){render();busy=false})}
  function prev(){if(busy||sp<=0)return;busy=true;var l=2*sp-1;lB.src=A[key(l)];lF.src=A[key(l-1)];
    setImg(pL,pLw,l-2);sp--;fb.classList.toggle('cover',sp===0);fb.classList.toggle('end',false);
    anim(-180,0,function(){render();busy=false})}
  document.getElementById('fbNext').onclick=next;document.getElementById('fbPrev').onclick=prev;
  document.getElementById('hitR').onclick=next;document.getElementById('hitL').onclick=prev;
  var fsx=null;fb.addEventListener('touchstart',function(e){fsx=e.touches[0].clientX},{passive:true});
  fb.addEventListener('touchend',function(e){if(fsx===null)return;var dx=e.changedTouches[0].clientX-fsx;if(Math.abs(dx)>40)(dx<0?next:prev)();fsx=null});
  function buildStrip(){strip.innerHTML='';for(var i=0;i<N();i++){var im=mkImg(key(i),BOOKS[bk].name+', page '+(i+1));(function(i){im.onclick=function(){openLB(Array.from({length:N()},function(_,j){return{k:key(j),c:BOOKS[bk].name+', page '+(j+1)}}),i)}})(i);strip.appendChild(im);lazyIO.observe(im)}}
  document.querySelectorAll('#fbTabs button').forEach(function(b){b.onclick=function(){if(busy)return;bk=+b.dataset.b;sp=0;
    document.querySelectorAll('#fbTabs button').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});render();buildStrip()}});
  var fbLoaded=false;new IntersectionObserver(function(es,o){if(es[0].isIntersecting&&!fbLoaded){fbLoaded=true;render();buildStrip();o.disconnect()}},{rootMargin:'800px 0px'}).observe(fb.parentNode);

  var BF=[['bf0','Bi-fold, flat spread'],['bf1','Bi-fold, closed'],['bf2','Bi-fold, open']];
  var bfList=BF.map(function(s){return{k:s[0],c:s[1]}}),bfEl=document.getElementById('bifold');
  BF.forEach(function(s,i){bfEl.appendChild(tile(bfList[i],bfList,i,''))});
  var BM=[['bm0','Front cover, standing'],['bm1','Green edition'],['bm2','Front and back, brown'],['bm3','Front and back, green']];
  var bmList=BM.map(function(s){return{k:s[0],c:s[1]}}),bmEl=document.getElementById('bookShots');
  BM.forEach(function(s,i){bmEl.appendChild(tile(bmList[i],bmList,i,''))});

  /* 3D book: auto spin + drag */
  (function(){var b=document.getElementById('book3d'),ang=-28,drag=false,lx=0,hold=0;b.classList.remove('auto');
    function set(){b.style.transform='rotateX(-6deg) rotateY('+ang+'deg)'}
    b.addEventListener('pointerdown',function(e){drag=true;lx=e.clientX;b.setPointerCapture(e.pointerId);b.style.cursor='grabbing'});
    b.addEventListener('pointermove',function(e){if(!drag)return;ang+=(e.clientX-lx)*.6;lx=e.clientX;set()});
    b.addEventListener('pointerup',function(){drag=false;hold=performance.now()+2500;b.style.cursor='grab'});
    var vis=false;new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(b);
    (function loop(now){if(vis&&!drag&&!reduce&&now>hold){ang+=.35;set()}requestAnimationFrame(loop)})(0);set()})();

  /* ================= PACKAGING ================= */
  var PK=[['pk0','Charging cable box'],['pk1','Fast charging cable box'],['pk2','Tempered glass pack']],pkEl=document.getElementById('pack');
  var pkList=PK.map(function(s){return{k:s[0],c:s[1]}});
  PK.forEach(function(p,i){var f=document.createElement('figure');f.className='pcard';f.appendChild(mkImg(p[0],p[1]));var c=document.createElement('figcaption');c.textContent=p[1];f.appendChild(c);
    f.style.cursor='zoom-in';f.onclick=function(){openLB(pkList,i)};
    if(fine&&!reduce){f.addEventListener('mousemove',function(e){var r=f.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;f.style.transform='rotateY('+(x*12)+'deg) rotateX('+(-y*12)+'deg) translateZ(10px)'});
      f.addEventListener('mouseleave',function(){f.style.transform=''})}
    pkEl.appendChild(f)});

  /* Amazon product page */
  var SHOP=[{t:'Smart watch',title:'Smart watch with 112+ sports modes, heart rate, sleep tracking and call alerts',g:['am8','am9','am10','am11','am12','am6'],a:[]},
            {t:'Cotton towels',title:'100% cotton towel set, soft, absorbent and quick drying',g:['am5','am1','am2','am3','am4'],a:['am1','am2','am3','am4']},
            {t:'Serum ads',title:'Face serum, listing images and sponsored ads',g:['am0'],a:[]}];
  var stabs=document.getElementById('shopTabs'),sTh=document.getElementById('shopTh'),sMain=document.querySelector('#shopMain img'),ap=document.getElementById('aplus'),shopI=0,gI=0;
  SHOP.forEach(function(s,i){var b=document.createElement('button');b.textContent=s.t;b.onclick=function(){shop(i)};stabs.appendChild(b)});
  function shopImg(k){sMain.style.opacity=0;setTimeout(function(){sMain.src=A[k];sMain.style.opacity=1},150)}
  function shop(i){shopI=i;gI=0;var s=SHOP[i];stabs.querySelectorAll('button').forEach(function(b,k){b.classList.toggle('on',k===i)});
    document.getElementById('shopTitle').textContent=s.title;document.getElementById('shopRev').textContent=s.g.length+' listing images';
    document.getElementById('shopUrl').textContent='store.example/'+s.t.toLowerCase().replace(/\s+/g,'-');
    sTh.innerHTML='';s.g.forEach(function(k,j){var b=document.createElement('button');b.setAttribute('aria-label','Image '+(j+1));var im=document.createElement('img');im.src=A[k];im.alt='';b.appendChild(im);
      b.onmouseenter=b.onclick=function(){gI=j;sTh.querySelectorAll('button').forEach(function(x,q){x.classList.toggle('on',q===j)});shopImg(k)};sTh.appendChild(b)});
    sTh.firstChild.classList.add('on');shopImg(s.g[0]);
    ap.innerHTML=s.a.length?'<h5>From the brand</h5>':'';s.a.forEach(function(k){var im=document.createElement('img');im.src=A[k];im.alt='A+ content';ap.appendChild(im)})}
  var shopMain=document.getElementById('shopMain');
  shopMain.addEventListener('click',function(){var s=SHOP[shopI];openLB(s.g.map(function(k){return{k:k,c:s.t}}),gI)});
  if(fine){shopMain.addEventListener('mousemove',function(e){var r=shopMain.getBoundingClientRect();sMain.style.transformOrigin=((e.clientX-r.left)/r.width*100)+'% '+((e.clientY-r.top)/r.height*100)+'%';sMain.style.transform='scale(1.8)'});
    shopMain.addEventListener('mouseleave',function(){sMain.style.transform=''})}
  var shopLoaded=false;new IntersectionObserver(function(es,o){if(es[0].isIntersecting&&!shopLoaded){shopLoaded=true;shop(0);o.disconnect()}},{rootMargin:'800px 0px'}).observe(shopMain);

  /* ================= TESTIMONIALS ================= */
  var TS=[['Sarah M.','Marketing Manager, events company, USA','Rizwan turned a messy brief into a clean, on-brand brochure in days. Our sponsors noticed the difference.'],
          ['Daniel K.','Founder, e-commerce brand, UK','The Amazon listing images lifted our product page instantly. Clear, fast and easy to work with.'],
          ['Elif Y.','Brand Lead, skincare company, Turkey','He built our whole visual identity with real care for detail. Every piece feels consistent.'],
          ['Hamza R.','Product Owner, fintech startup','Strong UX thinking, not just pretty screens. The onboarding flow he designed made sign-ups smoother.'],
          ['Ayesha T.','Social Media Lead, retail brand','Our posts finally look premium. He understands what stops the scroll.'],
          ['Omar S.','Operations Head, restaurant group','From logo to packaging to signage, the Fork & Flame identity came together beautifully.']];
  var tr=document.getElementById('tRows');
  function row(list,rev){var r=document.createElement('div');r.className='t-row'+(rev?' rev':'');var h='';
    list.concat(list).forEach(function(t,i){h+='<figure class="tcard"'+(i>=list.length?' aria-hidden="true"':'')+'><div class="st" aria-label="5 out of 5 stars">★★★★★</div><blockquote><p>“'+t[2]+'”</p></blockquote><figcaption class="who"><i>'+t[0].split(' ').map(function(w){return w[0]}).join('')+'</i><div><b>'+t[0]+'</b><small>'+t[1]+'</small></div></figcaption></figure>'});
    r.innerHTML=h;return r}
  tr.appendChild(row(TS.slice(0,3).concat(TS.slice(3,4)),false));tr.appendChild(row(TS.slice(3).concat(TS.slice(0,1)),true));

  /* ================= NAV SPY + DOCK ================= */
  var dock=document.getElementById('dock'),dockA=dock.querySelectorAll('a'),WORK=['uiux','branding','social','print','packaging'];
  var spy2=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var id=e.target.id,navId=WORK.indexOf(id)>-1?'uiux':id;
    navA.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+navId)});movePill();
    dock.classList.toggle('show',WORK.indexOf(id)>-1);dockA.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+id)});
    var on=dock.querySelector('a.on');if(on)dock.scrollTo({left:on.offsetLeft-dock.clientWidth/2+on.clientWidth/2,behavior:'smooth'})})},{rootMargin:'-45% 0px -50% 0px'});
  ['home','about','uiux','branding','social','print','packaging','reviews','contact'].forEach(function(id){spy2.observe(document.getElementById(id))});
  document.getElementById('toTop').onclick=function(){scrollTo({top:0,behavior:reduce?'auto':'smooth'})};

  watch();rvWatch();

  /* ---------- CV download ---------- */
  /* CV download */
  document.querySelectorAll('[data-cv]').forEach(function(b){b.addEventListener('click',function(){
    var a=document.createElement('a');a.href='assets/Rizwan_Shoukat_CV.pdf';a.download='Rizwan_Shoukat_CV.pdf';document.body.appendChild(a);a.click();a.remove()})});
})();
