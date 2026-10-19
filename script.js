const menuToggle=document.getElementById('menuToggle');const nav=document.getElementById('nav');menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));function closeMenu(){nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Abrir menu')}document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menuToggle.focus()}});document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!menuToggle.contains(e.target))closeMenu()});document.getElementById('year').textContent=new Date().getFullYear();
const tiltEnabled=window.matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)').matches;if(tiltEnabled){document.querySelectorAll('[data-tilt]').forEach(scene=>{scene.addEventListener('pointermove',e=>{const r=scene.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;scene.style.setProperty('--ry',(x*5).toFixed(2)+'deg');scene.style.setProperty('--rx',(-y*5).toFixed(2)+'deg')});scene.addEventListener('pointerleave',()=>{scene.style.setProperty('--ry','0deg');scene.style.setProperty('--rx','0deg')})})}
const gallery=[...document.querySelectorAll('.gallery-item')],dialog=document.getElementById('lightbox'),photo=document.getElementById('lightboxImg'),count=document.getElementById('photoCount');let index=0;function renderPhoto(){photo.decoding="async";photo.src=gallery[index].dataset.img;photo.alt=gallery[index].querySelector('img').alt;count.textContent=String(index+1).padStart(2,'0')+' / '+String(gallery.length).padStart(2,'0')}gallery.forEach((item,i)=>item.addEventListener('click',()=>{index=i;renderPhoto();dialog.showModal()}));document.getElementById('closeLightbox').addEventListener('click',()=>dialog.close());document.getElementById('prevPhoto').addEventListener('click',()=>{index=(index+gallery.length-1)%gallery.length;renderPhoto()});document.getElementById('nextPhoto').addEventListener('click',()=>{index=(index+1)%gallery.length;renderPhoto()});dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});document.addEventListener('keydown',e=>{if(!dialog.open)return;if(e.key==='ArrowRight'){index=(index+1)%gallery.length;renderPhoto()}if(e.key==='ArrowLeft'){index=(index+gallery.length-1)%gallery.length;renderPhoto()}});

// Progressive 3D direction: visual depth, no heavy WebGL payload.
(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const hero=document.querySelector('.hero');
  const progress=document.getElementById('scrollProgress');
  const reveals=[...document.querySelectorAll('[data-reveal]')];
  const parallax=[...document.querySelectorAll('[data-parallax]')];
  if('IntersectionObserver' in window && !reduce.matches){
    document.documentElement.classList.add('js-motion');
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -15px 0px'});
    reveals.forEach(el=>observer.observe(el));
    requestAnimationFrame(()=>document.documentElement.classList.add('motion-ready'));
  }
  if(fine.matches&&!reduce.matches){
    hero?.addEventListener('pointermove',ev=>{
      const rect=hero.getBoundingClientRect();
      const nx=(ev.clientX-rect.left)/rect.width-.5;
      const ny=(ev.clientY-rect.top)/rect.height-.5;
      hero.style.setProperty('--depth-x',(-nx*15).toFixed(1)+'px');
      hero.style.setProperty('--depth-y',(-ny*10).toFixed(1)+'px');
    },{passive:true});
    hero?.addEventListener('pointerleave',()=>{hero.style.setProperty('--depth-x','0px');hero.style.setProperty('--depth-y','0px')});
    document.querySelectorAll('.feature-photo').forEach(el=>el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect();el.style.setProperty('--pointer-x',((e.clientX-r.left)/r.width*100)+'%');el.style.setProperty('--pointer-y',((e.clientY-r.top)/r.height*100)+'%');
    },{passive:true}));
    document.querySelectorAll('[data-tilt-gallery]').forEach(el=>{
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--gry',(x*3).toFixed(2)+'deg');el.style.setProperty('--grx',(-y*3).toFixed(2)+'deg')},{passive:true});
      el.addEventListener('pointerleave',()=>{el.style.setProperty('--gry','0deg');el.style.setProperty('--grx','0deg')});
    });
    document.querySelectorAll('[data-spotlight]').forEach(el=>el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--spot-x',((e.clientX-r.left)/r.width*100)+'%');el.style.setProperty('--spot-y',((e.clientY-r.top)/r.height*100)+'%')},{passive:true}));
  }
  let scheduled=false;
  const update=()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    const fraction=max>0?scrollY/max:0;
    document.documentElement.style.setProperty('--scroll-progress',fraction.toFixed(4));
    if(!reduce.matches){parallax.forEach(el=>{
      const rect=el.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;
      const amount=(rect.top+rect.height/2-innerHeight/2)/innerHeight;
      el.style.setProperty('--parallax-px',(Math.max(-1,Math.min(1,amount))*-25).toFixed(1)+'px');
    })}
    scheduled=false;
  };
  const request=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}};
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});request();
})();
