/* Tá tudo bem – lógica principal (estados, física, colisão, perguntas, telas). */
(()=>{
const W=800,H=400,GROUND=340,GRAV=2200,JUMP_V=-780,READ_START=5,WIN_TARGET=Math.min(10,QUESTIONS.length);
const $=id=>document.getElementById(id), cv=$("cv"), ctx=cv.getContext("2d");
let S=null,last=0,muted=false,raf=0,audio=null;

const getBest=()=>{try{return +localStorage.getItem("ttb_best")||0}catch(e){return 0}};
const setBest=v=>{try{localStorage.setItem("ttb_best",v)}catch(e){}};
const show=id=>["menu","how","game"].forEach(s=>$(s).hidden=s!==id);
const refreshBest=()=>{$("bestMenu").textContent="Recorde: "+getBest();$("hBest").textContent="Recorde: "+getBest()};

function beep(f,d=.12){if(muted)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();
 const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+d);}catch(e){}}

/* ---------- Estado ---------- */
function newGame(){
 S={mode:"run",phase:"read",t:0,lives:3,score:0,right:0,wrong:0,scroll:0,
  bag:QUESTIONS.map((_,i)=>i).sort(()=>Math.random()-.5),q:null,timer:READ_START,proj:null,
  p:{x:110,y:GROUND,vy:0,w:56,h:64,hurt:0},enemy:{x:690,attack:0},confetti:[],paused:false,endAt:0};
 $("end").hidden=true;$("fb").hidden=true;$("btnPause").textContent="PAUSAR";
 nextQuestion();hud();cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(loop);
}
const level=()=>Math.floor(S.right/3);
const speed=()=>220+level()*45;
function nextQuestion(){ // sorteio sem repetição
 if(!S.bag.length)S.bag=QUESTIONS.map((_,i)=>i).sort(()=>Math.random()-.5);
 S.q=QUESTIONS[S.bag.pop()];S.phase="read";S.timer=Math.max(2.8,READ_START-level()*.5);S.proj=null;
 $("stmt").textContent=S.q.text;$("fb").hidden=true;
}
function hud(){$("hScore").textContent="Pontos: "+S.score;$("hLives").textContent="Vidas: "+"♥".repeat(S.lives)+"♡".repeat(3-S.lives);
 $("hLevel").textContent="Nível "+(level()+1)+" ("+S.right+"/"+WIN_TARGET+")";refreshBest();}

/* ---------- Ações ---------- */
function jump(){if(!S||S.mode!=="run"||S.paused)return;const p=S.p;if(p.y>=GROUND){p.vy=JUMP_V;beep(520,.1)}}
function words(txt){const w=txt.replace(/[.,]/g,"").split(" ").filter(x=>x.length>3);return w[Math.floor(Math.random()*w.length)].toUpperCase();}
function launch(){const word=words(S.q.text);ctx.font="bold 20px monospace";
 S.proj={x:S.enemy.x-20,w:Math.max(60,ctx.measureText(word).width+16),h:34,word,done:false,v:380+level()*30};
 S.enemy.attack=.6;S.phase="incoming";}
function resolve(){ // decide no instante em que a palavra chega ao personagem
 const jumped=S.p.y<GROUND-S.proj.h, ok=(S.q.answer===false)===jumped;
 S.proj.done=true;
 if(ok){S.right++;S.score+=10;beep(780);if(S.q.answer===true)S.proj=null;}
 else{S.wrong++;S.lives--;S.score=Math.max(0,S.score-5);S.p.hurt=.6;beep(180,.3);S.proj=null;}
 const fb=$("fb");fb.className=ok?"ok":"bad";
 fb.innerHTML="<b>"+(ok?"Acertou! +10":"Errou! −5")+"</b> – era "+(S.q.answer?"VERDADEIRA":"FALSA")+". "+S.q.explain;fb.hidden=false;
 S.phase="explain";S.timer=4.5;hud();
 if(S.lives<=0){S.mode="dead";S.p.vy=0;S.endAt=1.6;}
 else if(S.right>=WIN_TARGET){S.mode="win";S.endAt=1.8;for(let i=0;i<160;i++)S.confetti.push({x:Math.random()*W,y:-Math.random()*H,vy:60+Math.random()*140,vx:(Math.random()-.5)*60,c:`hsl(${Math.random()*360},90%,60%)`});}
}

/* ---------- Atualização ---------- */
function update(dt){
 S.t+=dt;const p=S.p;
 if(S.mode==="run"||S.mode==="win"||S.mode==="dead"){
  p.vy+=GRAV*dt;p.y=Math.min(GROUND,p.y+p.vy*dt);if(p.y>=GROUND)p.vy=0;
 }
 p.hurt=Math.max(0,p.hurt-dt);S.enemy.attack=Math.max(0,S.enemy.attack-dt);
 S.confetti.forEach(c=>{c.x+=c.vx*dt;c.y+=c.vy*dt;if(c.y>H){c.y=-10}});
 if(S.mode==="run"){
  S.scroll+=speed()*dt;
  if(S.phase==="read"){S.timer-=dt;if(S.timer<=0)launch();}
  else if(S.phase==="incoming"){const pr=S.proj;pr.x-=pr.v*dt;
   if(!pr.done&&pr.x<=p.x+p.w/2)resolve();}
  else if(S.phase==="explain"){S.timer-=dt;if(S.proj)S.proj.x-=S.proj.v*dt;if(S.timer<=0)nextQuestion();}
 }else if(S.proj){S.proj.x-=S.proj.v*dt;}
 if(S.mode!=="run"&&S.endAt>0){S.endAt-=dt;if(S.endAt<=0)finish();}
}
function finish(){
 const win=S.mode==="win",best=getBest();if(S.score>best)setBest(S.score);
 $("endTitle").textContent=win?"Você venceu!":"GAME OVER";
 $("endMsg").textContent=win?"Conhecimento e informação de qualidade são o melhor remédio contra o preconceito e a desinformação. Cuidar da saúde mental é cuidar de você e de quem está ao seu lado.":"O jornal fake news levou a melhor dessa vez. Tente de novo!";
 $("endStats").textContent="Pontuação: "+S.score+" | Acertos: "+S.right+" | Erros: "+S.wrong+" | Recorde: "+Math.max(best,S.score);
 $("end").hidden=false;$("fb").hidden=true;hud();
}

/* ---------- Desenho ---------- */
function drawBg(){
 const win=S.mode==="win",k=win?"scene_library":"scene_classroom",im=Assets.imgs[k];
 if(im){const w=H*im.width/im.height,o=-(S.scroll%w);for(let x=o;x<W;x+=w)ctx.drawImage(im,x,0,w,H);}
 else{Assets.draw(ctx,k,0,0,W,H);ctx.strokeStyle="rgba(255,255,255,.25)";for(let x=-(S.scroll%80);x<W;x+=80){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}}
 ctx.fillStyle="rgba(0,0,0,.35)";ctx.fillRect(0,GROUND,W,H-GROUND);
}
function playerKey(){const p=S.p;
 if(S.mode==="dead")return"player_dead";if(p.hurt>0)return"player_hurt";
 if(p.y<GROUND)return p.vy<0?"player_jump":"player_fall";
 return S.mode==="win"?"player_idle":"player_run";}
function draw(){
 ctx.clearRect(0,0,W,H);drawBg();
 const e=S.enemy;Assets.draw(ctx,e.attack>0?"enemy_attack":"enemy_idle",e.x-20,GROUND-110,90,110,S.t);
 const p=S.p;Assets.draw(ctx,playerKey(),p.x,p.y-p.h,p.w,p.h,S.t);
 if(S.proj){const r=S.proj;ctx.fillStyle="#fff";ctx.strokeStyle="#000";ctx.lineWidth=3;
  ctx.fillRect(r.x,GROUND-r.h,r.w,r.h);ctx.strokeRect(r.x,GROUND-r.h,r.w,r.h);
  ctx.fillStyle="#b00";ctx.font="bold 20px monospace";ctx.textAlign="center";ctx.fillText(r.word,r.x+r.w/2,GROUND-10);}
 S.confetti.forEach(c=>{ctx.fillStyle=c.c;ctx.fillRect(c.x,c.y,6,10)});
 if(S.paused){ctx.fillStyle="rgba(0,0,0,.6)";ctx.fillRect(0,0,W,H);ctx.fillStyle="#fff";ctx.font="bold 36px monospace";ctx.textAlign="center";ctx.fillText("PAUSADO",W/2,H/2);}
}
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!S.paused)update(dt);draw();raf=requestAnimationFrame(loop);}

/* ---------- Controles e telas ---------- */
function togglePause(){if(!S||S.mode!=="run")return;S.paused=!S.paused;$("btnPause").textContent=S.paused?"CONTINUAR":"PAUSAR";}
addEventListener("keydown",e=>{if(e.code==="Space"||e.code==="ArrowUp"){if(!$("game").hidden){e.preventDefault();jump();}}if(e.code==="KeyP")togglePause();});
cv.addEventListener("pointerdown",e=>{e.preventDefault();jump();});
$("btnJump").onclick=jump;$("btnPause").onclick=togglePause;$("btnRestart").onclick=()=>newGame();
$("btnMute").onclick=()=>{muted=!muted;$("btnMute").textContent="SOM: "+(muted?"DESLIGADO":"LIGADO");};
$("btnPlay").onclick=()=>{show("game");newGame();};
$("btnStart").onclick=()=>{show("game");newGame();};
$("btnHow").onclick=()=>show("how");$("btnBack").onclick=()=>show("menu");
$("btnAgain").onclick=()=>newGame();
$("btnMenu").onclick=()=>{cancelAnimationFrame(raf);show("menu");refreshBest();};
refreshBest();Assets.load();
})();
