/* Sistema de assets. Os sprites definitivos são feitos por outra pessoa.
   Basta colocar os PNGs nos caminhos abaixo (tira horizontal: frames lado a lado).
   Se um arquivo não existir, desenha-se um PLACEHOLDER técnico identificado. */
const ASSET_MANIFEST = {
 player_idle:{src:"assets/sprites/player/idle.png",frames:1,fps:4,label:"Cérebro parado",color:"#c77"},
 player_run:{src:"assets/sprites/player/run.png",frames:4,fps:10,label:"Cérebro correndo",color:"#c77"},
 player_jump:{src:"assets/sprites/player/jump.png",frames:1,fps:1,label:"Cérebro pulando",color:"#c77"},
 player_fall:{src:"assets/sprites/player/fall.png",frames:1,fps:1,label:"Cérebro caindo",color:"#c77"},
 player_hurt:{src:"assets/sprites/player/hurt.png",frames:1,fps:1,label:"Cérebro dano",color:"#c77"},
 player_dead:{src:"assets/sprites/player/dead.png",frames:1,fps:1,label:"Cérebro morto",color:"#c77"},
 enemy_idle:{src:"assets/sprites/enemy/idle.png",frames:1,fps:2,label:"Jornal FAKE NEWS",color:"#889"},
 enemy_attack:{src:"assets/sprites/enemy/attack.png",frames:2,fps:6,label:"Jornal atacando",color:"#889"},
 scene_classroom:{src:"assets/sprites/scenes/classroom.png",frames:1,fps:1,label:"Sala de aula",color:"#2a3358"},
 scene_library:{src:"assets/sprites/scenes/library.png",frames:1,fps:1,label:"Biblioteca",color:"#4a3a2a"},
 text_gameover:{src:"assets/sprites/effects/gameover.png",frames:1,fps:1,label:"GAME OVER",color:"#000"}
};
const Assets={imgs:{},
 load(){return Promise.all(Object.entries(ASSET_MANIFEST).map(([k,a])=>new Promise(res=>{
   const im=new Image(); im.onload=()=>{this.imgs[k]=im;res()}; im.onerror=()=>{this.imgs[k]=null;res()}; im.src=a.src;})));},
 /* x,y = canto superior esquerdo; w,h = tamanho em tela; t = tempo (s) */
 draw(ctx,k,x,y,w,h,t=0){
  const a=ASSET_MANIFEST[k],im=this.imgs[k];
  if(im){const fw=im.width/a.frames,f=Math.floor(t*a.fps)%a.frames;ctx.drawImage(im,f*fw,0,fw,im.height,x,y,w,h);return;}
  ctx.save();ctx.fillStyle=a.color;ctx.globalAlpha=.55;ctx.fillRect(x,y,w,h);ctx.globalAlpha=1;
  ctx.strokeStyle="#fff";ctx.setLineDash([6,4]);ctx.strokeRect(x,y,w,h);ctx.setLineDash([]);
  ctx.fillStyle="#fff";ctx.font="10px monospace";ctx.textAlign="center";
  ctx.fillText("PLACEHOLDER",x+w/2,y+h/2-2);ctx.fillText(a.label,x+w/2,y+h/2+10,w-4);ctx.restore();}
};
