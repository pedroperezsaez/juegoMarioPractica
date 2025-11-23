'use strict'

let canvas=document.getElementById('canvas');
let ctx= canvas.getContext('2d');
let background=null;
let playerImg=null;
let scrollH=0;
let scrollV=0;
let frames=0;
let playerDirection={};
let velocidadCanvas={};
let animacion=0;
let playerPositionY=192;
let saltando=false;
let saltoAltura=0;

function getKeys(){
    let keys={};
    window.onkeydown=function(e){
        keys[e.key]=true;
    }
    window.onkeyup=function(e){
        keys[e.key]=false;
    }
    return keys;
}
let keys=getKeys();

function loadImage(url){
    let img= new Image();
    img.src=url;
    return new Promise(function (resolve,reject) {
        img.onload=function(){
            resolve(img)
        }
    })
}
let fondoJuego={
    posicionY:256,
    posicionX:240,
}
let player={
    posx:fondoJuego.posicionX/2,
    posy:192,
    width:40,
    height:50,
   
}



 

let marioIzqu={
    posx:177,
    posy:88
}
let marioDer={
    posx:216,
    posy:88,
}
let marioCaminandoDer={
    posx:255,
    posy:88,
}
let marioCaminandoIzq={
 posx:134,
    posy:88,
};
playerDirection=marioDer;

function marioMovimientoDer(){    
    if(animacion<10){
        playerDirection=marioDer;
      
    }else if(animacion>=10 && animacion<20){
        playerDirection=marioCaminandoDer;
    }else{
        animacion=0;
    }
}

function marioMovimientoIzq(){
    
    if(animacion<10){
        playerDirection=marioIzqu;
      
    }else if(animacion>=10 && animacion<20){
        playerDirection=marioCaminandoIzq;
    }else{
        animacion=0;
    }
}

function salto(){
        if(!saltando){
            saltando= true;
            saltoAltura=-5;

        }
        
    }
    //tengo que seguir mirando aqui
    let alturaMaximaDeSalto = 100;
    function saltoYBajada(){       
         player.posy=player.posy+saltoAltura;
        console.log(player.posy)

        if(player.posy<=alturaMaximaDeSalto){ 
             player.posy = playerPositionY;
            saltando = false;
            saltoAltura = 0;
        }   
        
        
    }
  



function pararArrancarCanvas() {
    if (((player.posx) - (fondoJuego.posicionX / 2))<0) {
       player.posx+=1
    } else {
        scrollH += 1;   
    }
}


function update(){

if(keys['ArrowLeft']){
   marioMovimientoIzq();
   player.posx-=1;
}

if(keys['ArrowRight']){
   marioMovimientoDer()
 pararArrancarCanvas();
}
if(keys['ArrowUp']){
    salto();
   
    
}
if(keys['ArrowDown']){
    player.posy+=5
}
if(keys['z']){
    velocidadCanvas.izquierda;
}
if(keys['x']){
    scrollH+=2
}
if(keys['q']){
    scrollV-=2
}
if(keys['a']){
    scrollV+=2
}

}

function draw(){
    //esto es el fondo
   ctx.drawImage(background,scrollH,scrollV,fondoJuego.posicionY,fondoJuego.posicionX,0,0, fondoJuego.posicionY,fondoJuego.posicionX)

   //personaje
    ctx.drawImage(playerImg, playerDirection.posx, playerDirection.posy, 18,18, player.posx, player.posy, 18,18 )
   //ctx.beginPath();
    //ctx.rect(player.posx,player.posy,player.width,player.height);
    //ctx.fill();
}
function mainLoop(){
    saltoYBajada()
   animacion++;
    frames++;
    //Actualitzar el mon (entitats, controls..)
    update();
    //Dibuixar els elements dle joc
    ctx.save()
    ctx.scale(2.5,2.5)
    draw();
    ctx.restore();
    requestAnimationFrame(mainLoop);
}

async function main(){
// inicialitzacions
background = await loadImage('imgs/bg-1-1.png')
playerImg=await loadImage('imgs/mario.png')

//bucl principal(60fps)
mainLoop()
}

main();